import { create } from "zustand";

export type TabId = "about" | "works" | "career";

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
  activeTab: "about",
  contentTab: "about",
  contactOpen: false,

  booted: (tab) =>
    set({ phase: "site", activeTab: tab ?? "about", contentTab: tab ?? "about" }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setContentTab: (tab) => set({ contentTab: tab }),
  openProject: (id) => set({ phase: "opening", activeProject: id }),
  projectReady: () => set({ phase: "project" }),
  exitProject: () => set({ phase: "opening", activeProject: null }),
  siteReady: () => set({ phase: "site" }),
  openContact: () => set({ contactOpen: true }),
  closeContact: () => set({ contactOpen: false }),
}));
