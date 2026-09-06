"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SceneMeta {
  time: number;
  label: string;
  category: string;
  flowHook: string;
  project: string;
}

const TIMESTAMPS: SceneMeta[] = [
  { time: 0, label: "00 // WE BUILD", category: "MANIFESTO", flowHook: "COSMIC VOID HYPERSPACE", project: "CODEKINETIX 3D FILM" },
  { time: 4.5, label: "00 // EXPERIENCES", category: "MANIFESTO", flowHook: "LIQUID CHROME HELIX", project: "CODEKINETIX 3D FILM" },
  { time: 6.3, label: "01 // LUMÉA", category: "LUXURY E-COMMERCE", flowHook: "TILT // +12° YAW 3D", project: "MAISON DE SKINCARE" },
  { time: 8.9, label: "02 // MARFIL", category: "CLINICAL ATLAS", flowHook: "TILT // -12° YAW 3D", project: "MADRID DENTAL HOUSE" },
  { time: 11.5, label: "03 // SMASH'D", category: "EXPERIENTIAL 3D", flowHook: "DEPTH // 100-FRAME SCRUB", project: "BURGER ANATOMY" },
  { time: 14.1, label: "04 // PIZZA-MAN!", category: "POP-ART DINING", flowHook: "POP // +8° YAW 3D", project: "COMIC PIZZERIA" },
  { time: 16.7, label: "05 // PAUSA × BISTRO", category: "ATELIER & GASTRONOMY", flowHook: "TACTILE & SENSORIAL EDITORIAL", project: "SPECIALTY CRAFT" },
  { time: 19.7, label: "06 // LOGO REVEAL", category: "BRAND IDENTITY", flowHook: "3D PARTICLE IMPLOSION", project: "MONOGRAM CK" },
  { time: 21.9, label: "07 // COMMISSIONS OPEN", category: "START A PROJECT", flowHook: "COMMISSIONS OPEN // 2026", project: "STUDIO CALL TO ACTION" },
];

export default function ShowreelPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(25.4);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      const t = v.currentTime;
      setCurrentTime(t);

      let idx = 0;
      for (let i = TIMESTAMPS.length - 1; i >= 0; i--) {
        if (t >= TIMESTAMPS[i].time) {
          idx = i;
          break;
        }
      }
      setActiveSceneIndex(idx);
    };

    const onLoadedMetadata = () => {
      if (v.duration) setDuration(v.duration);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const jumpToScene = (sceneTime: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = sceneTime;
    v.play().catch(() => {});
  };

  const currentScene = TIMESTAMPS[activeSceneIndex] || TIMESTAMPS[0];
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen relative px-4 sm:px-8 pt-6 sm:pt-12 pb-24 max-w-6xl mx-auto overflow-hidden">
      {/* Google Flow Ambient Blue Radial Glows */}
      <div
        className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#3A6FFF] opacity-20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#1D4ED8] opacity-15 blur-[120px]"
        aria-hidden="true"
      />

      {/* Top Breadcrumb & Status */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-bone/60 hover:text-[#60A5FA] transition-colors"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 text-[#3A6FFF]">
            ←
          </span>
          <span>STUDIO // WORKS</span>
        </Link>
        <div className="flex items-center gap-3 font-mono text-[11px] text-bone/60 uppercase">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3A6FFF] shadow-[0_0_12px_#3A6FFF] animate-pulse" />
          <span className="text-[#60A5FA] font-bold">GOOGLE FLOW TRANSITIONS // 9:16 60FPS</span>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Left: 9:16 Vertical Video Player inside Floating 3D Device Glass Frame */}
        <div className="flex flex-col items-center justify-center">
          {/* Phone Mockup Frame */}
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[9/16] rounded-3xl border-2 border-[#3A6FFF]/40 bg-[#0A0A0B] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(58,111,255,0.3)] transition-transform duration-500 hover:scale-[1.01]">
            {/* Ambient inner rim glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#93C5FD]/20 z-20" />

            {/* Top Phone Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-[#0A0A0B]/90 rounded-full border border-bone/20 flex items-center justify-center pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#3A6FFF]/40" />
            </div>

            {/* Video Element */}
            <video
              ref={videoRef}
              src="/media/codekinetix-reel-9-16.mp4"
              playsInline
              muted={isMuted}
              loop
              autoPlay
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-20 bg-[#0A0A0B]/60 backdrop-blur-xs flex flex-col items-center justify-center cursor-pointer transition-opacity"
              >
                <div className="w-16 h-16 rounded-full border border-[#3A6FFF] bg-[#3A6FFF]/20 text-[#60A5FA] flex items-center justify-center font-bold text-2xl pl-1 shadow-[0_0_40px_rgba(58,111,255,0.6)]">
                  ▶
                </div>
                <span className="mt-4 font-mono text-xs uppercase tracking-widest text-[#93C5FD]">
                  PREVIEW GOOGLE FLOW REEL
                </span>
              </div>
            )}

            {/* Live Flow HUD Badge */}
            <div className="absolute top-10 left-4 right-4 z-20 pointer-events-none flex items-center justify-between font-mono text-[10px] text-bone/80 bg-[#0A0A0B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#3A6FFF]/30">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A6FFF] animate-ping" />
                <span className="text-[#60A5FA] font-bold">{currentScene.flowHook}</span>
              </div>
              <span className="text-bone/50">{formatTimecode(currentTime)}</span>
            </div>

            {/* Bottom HUD info */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between font-mono text-[10px] text-bone/80 bg-[#0A0A0B]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-bone/15">
              <span className="truncate max-w-[170px] uppercase font-bold text-[#F2F1EA]">
                {currentScene.label}
              </span>
              <span className="text-[#60A5FA] font-bold">60 FPS FLOW</span>
            </div>

            {/* Progress Scrub Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#101422] z-30">
              <div
                className="h-full bg-[#3A6FFF] shadow-[0_0_8px_#3A6FFF] transition-all duration-75"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Quick Playback Bar under phone */}
          <div className="w-full max-w-[360px] sm:max-w-[400px] flex items-center justify-between gap-3 mt-4 font-mono text-xs">
            <button
              onClick={togglePlay}
              className="flex-1 py-2 px-3 rounded-full border border-[#3A6FFF]/50 bg-[#101422] hover:bg-[#3A6FFF] hover:text-white hover:border-[#3A6FFF] transition-colors font-bold uppercase tracking-wider text-center"
            >
              {isPlaying ? "PAUSE FLOW" : "PLAY FLOW"}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="py-2 px-4 rounded-full border border-bone/20 bg-panel/50 hover:border-[#3A6FFF] transition-colors text-bone/80 text-[11px]"
            >
              {isMuted ? "UNMUTE 🔇" : "SOUND 🔊"}
            </button>
            <button
              onClick={() => jumpToScene(0)}
              className="py-2 px-3 rounded-full border border-bone/20 bg-panel/50 hover:border-[#3A6FFF] transition-colors text-bone/80"
              title="Replay from start"
            >
              ↺
            </button>
          </div>
        </div>

        {/* Right Column: Google Flow Details & Instant Download */}
        <div className="space-y-6">
          {/* Header Card */}
          <div className="border border-[#3A6FFF]/30 bg-[#101422]/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="inline-flex items-center gap-2 border border-[#3A6FFF]/50 bg-[#3A6FFF]/10 px-3 py-1 rounded-full font-mono text-[10px] text-[#00F0FF] tracking-widest uppercase mb-4">
              3D CGI &amp; PERSPECTIVE FLOW // 9:16
            </div>
            <h1 className="font-extrabold type-xwide uppercase tracking-[-0.01em] text-bone text-2xl sm:text-3xl leading-[1.05] mb-3">
              CODEKINETIX®
              <br />
              <span className="text-[#3A6FFF]">3D MASTER REEL</span>
            </h1>
            <p className="font-mono text-xs text-bone/70 leading-relaxed">
              Cinematic 25.4-second 9:16 motion reel featuring 3D cosmic typography, liquid chrome helix, floating 3D perspective viewports for all 6 flagship projects, and synchronized electronic sound design.
            </p>
          </div>

          {/* Download & File Specs Card */}
          <div className="border border-[#3A6FFF]/50 bg-gradient-to-br from-[#101428] to-[#0A0A0B] p-6 rounded-2xl space-y-4 shadow-[0_15px_45px_rgba(58,111,255,0.18)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase font-bold text-[#60A5FA] tracking-wider">
                EXPORT SPECIFICATIONS
              </span>
              <span className="font-mono text-[10px] border border-[#3A6FFF]/40 px-2.5 py-0.5 rounded-full text-[#93C5FD] bg-[#3A6FFF]/10">
                BROADCAST MP4
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs text-bone/80 border-t border-b border-bone/10 py-3">
              <div>
                <span className="text-bone/40 text-[10px] block">PALETTE</span>
                <span className="font-bold text-[#60A5FA]">BLUE &amp; BLACK</span>
              </div>
              <div>
                <span className="text-bone/40 text-[10px] block">RATIO / FPS</span>
                <span className="font-bold text-bone">9:16 @ 60 FPS</span>
              </div>
              <div>
                <span className="text-bone/40 text-[10px] block">RESOLUTION</span>
                <span className="font-bold text-bone">1080 × 1920 PX</span>
              </div>
              <div>
                <span className="text-bone/40 text-[10px] block">TRANSITIONS</span>
                <span className="font-bold text-bone">GOOGLE FLOW</span>
              </div>
            </div>

            {/* Direct Download Button */}
            <a
              href="/media/codekinetix-reel-9-16.mp4"
              download="codekinetix-flow-reel-9-16.mp4"
              className="group flex items-center justify-center gap-3 w-full py-3.5 rounded-full bg-[#3A6FFF] text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#2563EB] transition-colors shadow-[0_0_30px_rgba(58,111,255,0.4)]"
            >
              <span>DOWNLOAD 9:16 FLOW REEL (.MP4)</span>
              <span className="text-sm group-hover:translate-y-0.5 transition-transform duration-200">
                ↓
              </span>
            </a>
            <p className="font-mono text-[10px] text-center text-bone/50">
              Format 9:16 prêt à publier sur Instagram Reels, TikTok et Shorts.
            </p>
          </div>

          {/* Interactive Scene Jumper */}
          <div className="border border-bone/15 bg-[#101422]/50 p-6 rounded-2xl">
            <p className="font-mono text-xs tracking-widest text-[#60A5FA] uppercase mb-3 font-bold">
              FLOW TIMELINE DIRECTORY:
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              {TIMESTAMPS.map((s, i) => {
                const isActive = activeSceneIndex === i;
                return (
                  <button
                    key={s.label}
                    onClick={() => jumpToScene(s.time)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                      isActive
                        ? "border-[#3A6FFF] bg-[#3A6FFF]/15 text-[#60A5FA] font-bold shadow-[0_0_15px_rgba(58,111,255,0.2)]"
                        : "border-bone/10 hover:border-[#3A6FFF]/30 bg-panel/30 text-bone/70 hover:text-bone"
                    }`}
                  >
                    <span className="truncate">{s.label} — {s.project}</span>
                    <span className="text-[10px] opacity-60 ml-2 shrink-0">
                      {formatTimecode(s.time)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
