import { create } from "zustand";
import { getSlot } from "@/lib/projects";

export type TabId = "studio" | "works" | "about" | "lab" | "contact";

export type Phase =
  | "booting" // preloader visible
  | "site" // portfolio visible
  | "opening" // project transition overlay playing
  | "project"; // embedded project view rendered full-screen

interface KinetixState {
  phase: Phase;
  activeProject: string | null;
  activeTab: TabId; // target tab — drives the liquid transition overlay
  contentTab: TabId; // tab actually rendered under the overlay
  contactOpen: boolean;

  booted: (tab?: TabId) => void;
  setActiveTab: (tab: TabId) => void;
  setContentTab: (tab: TabId) => void;
  openProject: (id: string) => void;
  projectReady: () => void;
  exitProject: () => void;
  siteReady: () => void;
  openContact: () => void;
  closeContact: () => void;
}

export const useKinetix = create<KinetixState>((set) => ({
  phase: "booting",
  activeProject: null,
  activeTab: "studio",
  contentTab: "studio",
  contactOpen: false,

  booted: (tab) =>
    set({ phase: "site", activeTab: tab ?? "studio", contentTab: tab ?? "studio" }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setContentTab: (tab) => set({ contentTab: tab }),
  openProject: (id) => {
    if (typeof window !== "undefined") {
      const slot = getSlot(id);
      if (slot) {
        window.history.pushState({ project: id }, "", `/works/${slot.slug}?view=live`);
      }
    }
    set({ phase: "opening", activeProject: id });
  },
  projectReady: () => set({ phase: "project" }),
  exitProject: () => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("view=live") || window.location.pathname.startsWith("/works/")) {
        window.history.pushState(null, "", "/works");
      }
    }
    set({ phase: "opening", activeProject: null });
  },
  siteReady: () => set({ phase: "site" }),
  openContact: () => set({ contactOpen: true }),
  closeContact: () => set({ contactOpen: false }),
}));
