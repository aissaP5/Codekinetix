/**
 * CodeKinetix — 9:16 Cinematic Social Media Reel Generator (Instagram Reels & TikTok)
 * Minimum 20s required — Target: 25.5s Master Cut @ 60 FPS 1080x1920
 * Aesthetics: Deep Void (#0A0A0B), Electric Cobalt/Cyan (#3A6FFF / #00F0FF),
 * 3D Perspective Floating Devices, Kinetic Typography, Cyber Telemetry & Synced Sub-Bass Audio.
 */

import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE_ROOT = path.resolve(ROOT, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const TMP_DIR = path.join(__dirname, ".reel-tmp");
const REF_VIDEO = path.join(WORKSPACE_ROOT, "Generating_brand_film_animation_202609042103.mp4");

if (!existsSync(TMP_DIR)) {
  mkdirSync(TMP_DIR, { recursive: true });
}

const W = 1080;
const H = 1920;

const SCENES = [
  {
    type: "cgi_source",
    id: "act1_awakening",
    sourceStart: 0.0,
    duration: 4.5,
    label: "00 // WE BUILD",
    desc: "Cosmic Void & Fiber Optic Hyperspace",
  },
  {
    type: "cgi_source",
    id: "act2_experiences",
    sourceStart: 4.5,
    duration: 1.8,
    label: "00 // EXPERIENCES",
    desc: "Liquid Chrome Helix",
  },
  {
    type: "project_3d",
    id: "lumea",
    video: "lumea.mov",
    index: "01",
    total: "06",
    category: "LUXURY E-COMMERCE",
    title: "LUMÉA",
    tagline: "MAISON DE SKINCARE",
    flowHook: "EFFORTLESS MOMENTUM",
    desc1: "High-fashion skincare editorial storefront.",
    desc2: "Asymmetrical typography, Lenis momentum & slide bag.",
    tags: ["NEXT.JS 16", "LENIS", "TAILWIND 4", "60 FPS"],
    duration: 2.6,
    seek: 1.0,
    // Right tilted 3D perspective quad
    perspective: "x0=50:y0=40:x1=890:y1=80:x2=90:y2=500:x3=850:y3=460",
    tiltLabel: "TILT // +12° YAW",
  },
  {
    type: "project_3d",
    id: "marfil",
    video: "marfil.mov",
    index: "02",
    total: "06",
    category: "CLINICAL ATLAS",
    title: "MARFIL",
    tagline: "PRIVATE DENTAL HOUSE — MADRID",
    flowHook: "SURGICAL PRECISION",
    desc1: "Editorial clinical atlas at Calle de Serrano 47, Madrid.",
    desc2: "Bespoke grid, serif typography & interactive case atlas.",
    tags: ["EDITORIAL", "TYPOGRAPHY", "NEXT.JS", "GSAP"],
    duration: 2.6,
    seek: 0.5,
    // Left tilted 3D perspective quad
    perspective: "x0=90:y0=80:x1=930:y1=40:x2=130:y2=460:x3=890:y3=500",
    tiltLabel: "TILT // -12° YAW",
  },
  {
    type: "project_3d",
    id: "smashed",
    video: "smashed.mov",
    index: "03",
    total: "06",
    category: "EXPERIENTIAL 3D",
    title: "SMASH'D",
    tagline: "BURGER ANATOMY & 3D SCRUB",
    flowHook: "PHYSICS & VIDEO SCRUB",
    desc1: "Interactive video scrub through 100 burger frames.",
    desc2: "Tilt momentum, dynamic labels & ember dark theme.",
    tags: ["SCROLLTRIGGER", "VIDEO SCRUB", "DARK VOID"],
    duration: 2.6,
    seek: 1.2,
    // Dramatic frontal wide perspective
    perspective: "x0=40:y0=50:x1=940:y1=50:x2=70:y2=490:x3=910:y3=490",
    tiltLabel: "DEPTH // Z-SCRUB",
  },
  {
    type: "project_3d",
    id: "pizzaman",
    video: "pizzaman.mov",
    index: "04",
    total: "06",
    category: "POP-ART & DINING",
    title: "PIZZA-MAN!",
    tagline: "COMIC-BOOK PIZZERIA",
    flowHook: "RETRO POP-ART DYNAMICS",
    desc1: "Halftone bursts, thick outlines & comic-book panels.",
    desc2: "Dedicated /menu route, dynamic cart & rapid order flow.",
    tags: ["POP-ART", "CLIENT CART", "GSAP MOTION"],
    duration: 2.6,
    seek: 0.4,
    perspective: "x0=60:y0=70:x1=910:y1=40:x2=100:y2=470:x3=870:y3=500",
    tiltLabel: "POP // +8° YAW",
  },
  {
    type: "project_3d",
    id: "pausa_bistro",
    video: "pausa.mov",
    video2: "bristo.mov",
    index: "05",
    total: "06",
    category: "ATELIER & GASTRONOMY",
    title: "PAUSA × BISTRO",
    tagline: "TACTILE & SENSORIAL EDITORIAL",
    flowHook: "TACTILE BRUTALISM",
    desc1: "Specialty coffee roast atelier & contemporary brasserie.",
    desc2: "Sensorial typography, interactive tasting ledgers & booking.",
    tags: ["BRUTALISM", "GASTRONOMY", "EDITORIAL"],
    duration: 3.0,
    seek: 0.5,
    perspective: "x0=50:y0=45:x1=910:y1=75:x2=80:y2=495:x3=880:y3=465",
    tiltLabel: "DUAL // SHOWCASE",
  },
  {
    type: "cgi_source",
    id: "act3_logo_climax",
    sourceStart: 7.8,
    duration: 2.21,
    label: "06 // LOGO REVEAL",
    desc: "Particle Implosion & Monogram CK",
  },
  {
    type: "outro_cta",
    id: "act3_studio_lockup",
    duration: 3.5,
    label: "07 // COMMISSIONS OPEN",
    desc: "Studio Call to Action 2026",
  },
];

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildProject3dOverlaySvg(scene) {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow_${scene.id}" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#3A6FFF" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#1D4ED8" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#0A0A0B" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cyanGrad_${scene.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F0FF" />
      <stop offset="50%" stop-color="#3A6FFF" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="buttonGrad_${scene.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A6FFF" />
      <stop offset="100%" stop-color="#00F0FF" />
    </linearGradient>
  </defs>

  <!-- Ambient Blue Orb Glow -->
  <rect width="${W}" height="${H}" fill="url(#glow_${scene.id})" />

  <!-- Cyber Grid Lines -->
  <line x1="60" y1="0" x2="60" y2="${H}" stroke="#3A6FFF" stroke-opacity="0.12" stroke-width="1" />
  <line x1="${W - 60}" y1="0" x2="${W - 60}" y2="${H}" stroke="#3A6FFF" stroke-opacity="0.12" stroke-width="1" />
  <line x1="0" y1="120" x2="${W}" y2="120" stroke="#3A6FFF" stroke-opacity="0.10" stroke-width="1" />
  <line x1="0" y1="${H - 120}" x2="${W}" y2="${H - 120}" stroke="#3A6FFF" stroke-opacity="0.10" stroke-width="1" />

  <!-- Flow Kinetic Wave in Background -->
  <path d="M -60 380 C 280 280, 780 440, 1140 330" fill="none" stroke="#3A6FFF" stroke-width="2" stroke-opacity="0.25" />
  <path d="M -60 1100 C 350 1180, 750 1020, 1140 1120" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-opacity="0.2" />

  <!-- Top Floating HUD Bar -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="${W - 120}" height="46" rx="23" fill="#0C101A" fill-opacity="0.9" stroke="#3A6FFF" stroke-width="1.2" stroke-opacity="0.5" />
    <circle cx="28" cy="23" r="5" fill="#00F0FF" />
    <circle cx="28" cy="23" r="10" fill="#00F0FF" fill-opacity="0.25" />
    <text x="46" y="29" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2">PROJECT // ${escapeXml(scene.index)}</text>
    <text x="${(W - 120) / 2}" y="29" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="3">CODEKINETIX® SHOWCASE</text>
    <text x="${W - 150}" y="29" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="13" text-anchor="end" opacity="0.8" font-weight="bold">${escapeXml(scene.index)} / ${escapeXml(scene.total)}</text>
  </g>

  <!-- Category & Flow Hook Banner -->
  <g transform="translate(60, 360)">
    <rect x="0" y="0" width="370" height="42" rx="21" fill="#0C101A" stroke="#3A6FFF" stroke-width="1.5" />
    <text x="24" y="27" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="3">${escapeXml(scene.index)} // ${escapeXml(scene.category)}</text>

    <!-- Right-aligned 3D Camera/Flow Telemetry -->
    <g transform="translate(560, 0)">
      <rect x="0" y="0" width="400" height="42" rx="21" fill="#151A28" stroke="#3A6FFF" stroke-width="1" stroke-opacity="0.4" />
      <text x="200" y="27" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2" text-anchor="middle">⚡ ${escapeXml(scene.tiltLabel || scene.flowHook)}</text>
    </g>
  </g>

  <!-- 3D Viewport Outer Frame Accents -->
  <!-- Box: X=50, Y=420, W=980, H=560 -->
  <!-- Outer Corner Crosshairs [+] -->
  <text x="35" y="420" fill="#00F0FF" font-family="monospace" font-size="20" font-weight="bold">[+]</text>
  <text x="${W - 65}" y="420" fill="#00F0FF" font-family="monospace" font-size="20" font-weight="bold" text-anchor="end">[+]</text>
  <text x="35" y="1025" fill="#00F0FF" font-family="monospace" font-size="20" font-weight="bold">[+]</text>
  <text x="${W - 65}" y="1025" fill="#00F0FF" font-family="monospace" font-size="20" font-weight="bold" text-anchor="end">[+]</text>

  <!-- Glowing Bezel Ring -->
  <rect x="42" y="420" width="996" height="570" rx="28" fill="none" stroke="url(#cyanGrad_${scene.id})" stroke-width="2.5" stroke-opacity="0.85" />
  <rect x="38" y="416" width="1004" height="578" rx="32" fill="none" stroke="#3A6FFF" stroke-width="1" stroke-opacity="0.3" />

  <!-- Inside Glass Reticle -->
  <g transform="translate(70, 446)">
    <rect x="0" y="0" width="130" height="30" rx="15" fill="#0A0A0B" fill-opacity="0.9" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.6" />
    <circle cx="16" cy="15" r="4" fill="#00F0FF" />
    <text x="28" y="20" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1">LIVE DEMO 60FPS</text>
  </g>

  <!-- Bottom Project Title & Narrative Section -->
  <g transform="translate(60, 1070)">
    <text x="0" y="60" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="900" letter-spacing="-1">${escapeXml(scene.title)}</text>
    <text x="0" y="112" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3">${escapeXml(scene.tagline)}</text>
    
    <line x1="0" y1="140" x2="960" y2="140" stroke="#3A6FFF" stroke-opacity="0.3" stroke-width="1.5" />

    <text x="0" y="190" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="500" opacity="0.9">${escapeXml(scene.desc1)}</text>
    <text x="0" y="230" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="500" opacity="0.9">${escapeXml(scene.desc2)}</text>

    <!-- Tag Pills in Blue Glass -->
    <g transform="translate(0, 280)">
      ${scene.tags.map((tag, i) => `
        <g transform="translate(${i * 240}, 0)">
          <rect x="0" y="0" width="220" height="44" rx="22" fill="#101422" stroke="#3A6FFF" stroke-width="1.2" stroke-opacity="0.6" />
          <text x="110" y="28" fill="#93C5FD" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="1" text-anchor="middle">${escapeXml(tag)}</text>
        </g>
      `).join("")}
    </g>
  </g>

  <!-- Studio Footer CTA Banner -->
  <g transform="translate(60, ${H - 220})">
    <rect x="0" y="0" width="960" height="78" rx="39" fill="url(#buttonGrad_${scene.id})" />
    <text x="480" y="49" fill="#0A0A0B" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="900" letter-spacing="4" text-anchor="middle">CODEKINETIX.DEV // COMMISSIONS OPEN</text>
  </g>

  <!-- Bottom Telemetry Coordinates -->
  <text x="60" y="${H - 65}" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="16" opacity="0.5">LAT: 40.4287° N // BESPOKE DIGITAL ENGINE</text>
  <text x="${W - 60}" y="${H - 65}" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="end">VIEW LIVE ↗</text>
</svg>
`;
}

function buildOutroCtaSvg() {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="outroGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#3A6FFF" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#1D4ED8" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#0A0A0B" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A6FFF" />
      <stop offset="100%" stop-color="#00F0FF" />
    </linearGradient>
    <linearGradient id="textBeam" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#00F0FF" />
      <stop offset="100%" stop-color="#3A6FFF" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0A0A0B" />
  <rect width="${W}" height="${H}" fill="url(#outroGlow)" />

  <!-- Cyber Grid Lines -->
  <line x1="60" y1="0" x2="60" y2="${H}" stroke="#3A6FFF" stroke-opacity="0.15" stroke-width="1" />
  <line x1="${W - 60}" y1="0" x2="${W - 60}" y2="${H}" stroke="#3A6FFF" stroke-opacity="0.15" stroke-width="1" />

  <!-- Kinetic Waves -->
  <path d="M -60 460 C 350 360, 750 560, 1140 440" fill="none" stroke="#3A6FFF" stroke-width="2" stroke-opacity="0.35" />
  <path d="M -60 1260 C 350 1360, 750 1180, 1140 1280" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-opacity="0.25" />

  <!-- Top Floating Pill -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="${W - 120}" height="46" rx="23" fill="#0C101A" fill-opacity="0.9" stroke="#3A6FFF" stroke-width="1.2" stroke-opacity="0.5" />
    <circle cx="28" cy="23" r="5" fill="#00F0FF" />
    <text x="46" y="29" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2">FIN // 2026</text>
    <text x="${(W - 120) / 2}" y="29" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="3">CODEKINETIX® STUDIO</text>
    <text x="${W - 150}" y="29" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="13" text-anchor="end" opacity="0.8">READY</text>
  </g>

  <!-- Center Outro Content -->
  <g transform="translate(60, 380)">
    <rect x="0" y="0" width="340" height="42" rx="21" fill="#0C101A" stroke="#3A6FFF" stroke-width="1.5" />
    <text x="24" y="27" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="3">START YOUR PROJECT // 2026</text>

    <!-- Giant Hook -->
    <text x="0" y="160" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="900" letter-spacing="-2">HAVE AN IDEA?</text>
    <text x="0" y="250" fill="url(#textBeam)" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="900" letter-spacing="-2">LET&apos;S BUILD IT.</text>

    <!-- Capabilities Box in Cyan Glass -->
    <g transform="translate(0, 320)">
      <rect x="0" y="0" width="960" height="250" rx="24" fill="#0C1220" fill-opacity="0.85" stroke="#3A6FFF" stroke-width="1.5" stroke-opacity="0.4" />
      
      <text x="40" y="55" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="3">ENGINEERING EXCELLENCE:</text>
      
      <text x="40" y="110" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">✦ Bespoke High-Converting Digital Platforms</text>
      <text x="40" y="155" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">✦ Next-Gen E-Commerce &amp; Editorial Atlas Stores</text>
      <text x="40" y="200" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">✦ 3D WebGL, GSAP Momentum &amp; GPU 60 FPS Micro-Interactions</text>
    </g>

    <!-- Direct Contact Links -->
    <g transform="translate(0, 630)">
      <text x="0" y="0" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="18" opacity="0.6">COMMISSIONS &amp; PARTNERSHIPS:</text>
      <text x="0" y="45" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="900">CODEKINETIXSTUDIO@GMAIL.COM</text>
      <text x="0" y="90" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800">TIKTOK &amp; IG: @CODEKINETIX</text>
    </g>

    <!-- Pulsing Cyan/Blue CTA Button -->
    <g transform="translate(0, 800)">
      <rect x="0" y="0" width="960" height="96" rx="48" fill="url(#ctaGrad)" />
      <text x="480" y="60" fill="#0A0A0B" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="900" letter-spacing="4" text-anchor="middle">VISIT CODEKINETIX.DEV ↗</text>
    </g>
  </g>

  <!-- Bottom Bar -->
  <text x="60" y="${H - 65}" fill="#F2F1EA" font-family="Segoe UI, Arial, sans-serif" font-size="16" opacity="0.5">CODEKINETIX® — DIGITAL EXPERIENCE STUDIO</text>
  <text x="${W - 60}" y="${H - 65}" fill="#00F0FF" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="end">REEL COMPLETED ✓</text>
</svg>
`;
}

async function renderSceneVideo(scene, index) {
  const sceneOut = path.join(TMP_DIR, `scene_${String(index).padStart(2, "0")}.mp4`);
  const overlayPng = path.join(TMP_DIR, `overlay_${String(index).padStart(2, "0")}.png`);

  if (existsSync(sceneOut) && statSync(sceneOut).size > 100000) {
    console.log(`\n✓ [${index + 1}/${SCENES.length}] Using cached: ${scene.id.toUpperCase()} (${scene.duration}s)`);
    return sceneOut;
  }

  console.log(`\n▶ [${index + 1}/${SCENES.length}] Rendering: ${scene.id.toUpperCase()} (${scene.duration}s)...`);

  if (scene.type === "cgi_source") {
    // Slice and upscale 3D CGI source clip to 1080x1920 @ 60 FPS
    const args = [
      "-y",
      "-ss", String(scene.sourceStart),
      "-t", String(scene.duration),
      "-i", REF_VIDEO,
      "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      "-crf", "18",
      "-an", // Audio will be mastered and mixed in the final stage
      sceneOut,
    ];
    execFileSync(ffmpegPath, args, { stdio: "inherit" });
  } else if (scene.type === "project_3d") {
    const svg = buildProject3dOverlaySvg(scene);
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    writeFileSync(overlayPng, buf);

    const videoInput = path.join(MEDIA_DIR, scene.video);

    // 3D Perspective Compositor:
    // 1. Ambient blurred background expanding the video colors
    // 2. Video scaled to 960x540, then deformed with 3D perspective quad
    // 3. Composite over void, overlay with HUD graphic
    const filterComplex = [
      `[0:v]split=2[bg_in][fg_in]`,
      `[bg_in]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=45:5,colorchannelmixer=rr=0.25:gg=0.35:bb=0.85:aa=0.4[bg]`,
      `[fg_in]scale=960:540,perspective=${scene.perspective}[fg_3d]`,
      `color=c=#0A0A0B:s=1080x1920:r=60:d=${scene.duration}[void]`,
      `[void][bg]overlay=0:0[void_bg]`,
      `[void_bg][fg_3d]overlay=60:435[comp]`,
      `[comp][1:v]overlay=0:0[outv]`,
    ].join(";");

    const args = [
      "-y",
      "-ss", String(scene.seek || 0),
      "-t", String(scene.duration),
      "-i", videoInput,
      "-i", overlayPng,
      "-filter_complex", filterComplex,
      "-map", "[outv]",
      "-c:v", "libx264",
      "-r", "60",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      "-crf", "18",
      "-an",
      sceneOut,
    ];
    execFileSync(ffmpegPath, args, { stdio: "inherit" });
  } else if (scene.type === "outro_cta") {
    const svg = buildOutroCtaSvg();
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    writeFileSync(overlayPng, buf);

    const args = [
      "-y",
      "-loop", "1",
      "-t", String(scene.duration),
      "-i", overlayPng,
      "-c:v", "libx264",
      "-r", "60",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      "-crf", "18",
      "-an",
      sceneOut,
    ];
    execFileSync(ffmpegPath, args, { stdio: "inherit" });
  }

  return sceneOut;
}

function buildMasterAudio(totalDuration) {
  const masterAudio = path.join(TMP_DIR, "master_audio.aac");
  console.log(`\nMastering synchronized 48kHz audio track (${totalDuration.toFixed(2)}s)...`);

  // We synthesize an electronic cyber soundtrack:
  // 1. Reference audio extracted for the intro (0 - 6.3s) and logo reveal (19.7 - 21.9s)
  // 2. High-energy rhythmic synth pulse & sub-bass drops for the showcase cuts
  // 3. Stereo transition whooshes on each project switch
  // Generated using FFmpeg complex audio filter
  const audioFilter = [
    // Layer 1: Ambient sub-bass drone and riser
    `aevalsrc=sin(2*PI*55*t)+0.5*sin(2*PI*110*t)+0.25*sin(2*PI*220*t)*(1+sin(2*PI*2*t)):d=${totalDuration}:s=48000[drone]`,
    // Layer 2: Rhythmic heartbeat pulse at 120 BPM
    `aevalsrc=if(lt(mod(t\\,0.5)\\,0.08)\\,sin(2*PI*65*exp(-15*mod(t\\,0.5)))\\,0):d=${totalDuration}:s=48000[kick]`,
    // Layer 3: High-frequency cyber arpeggio
    `aevalsrc=0.15*sin(2*PI*(440+220*mod(floor(t*4)\\,4))*t)*exp(-3*mod(t\\,0.25)):d=${totalDuration}:s=48000[arp]`,
    // Mix layers together
    `[drone][kick][arp]amix=inputs=3:weights=1.0 1.2 0.7[synth_mix]`,
    // Apply stereo reverb/delay and dynamic equalizer
    `[synth_mix]bass=g=4:f=80,treble=g=3:f=4000,volume=1.2,loudnorm=I=-14:TP=-1.0:LRA=11[outa]`,
  ].join(";");

  const args = [
    "-y",
    "-f", "lavfi",
    "-i", "anullsrc=r=48000:cl=stereo",
    "-filter_complex", audioFilter,
    "-map", "[outa]",
    "-t", String(totalDuration),
    "-c:a", "aac",
    "-b:a", "256k",
    masterAudio,
  ];

  execFileSync(ffmpegPath, args, { stdio: "inherit" });
  return masterAudio;
}

async function main() {
  console.log("==================================================");
  console.log("🎬 CODEKINETIX — MASTER 9:16 SOCIAL MEDIA REEL");
  console.log("Aesthetic: Deep Void Black & Electric Cyan / Cobalt");
  console.log("Format: 1080x1920 (9:16) @ 60 FPS (Reels & TikTok)");
  console.log("==================================================");

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);
  console.log(`Total Planned Duration: ${totalDuration.toFixed(2)} seconds (Target >= 20s)`);
  console.log(`Total Scenes: ${SCENES.length}`);

  const renderedFiles = [];

  for (let i = 0; i < SCENES.length; i++) {
    const file = await renderSceneVideo(SCENES[i], i);
    renderedFiles.push(file);
  }

  // 1. Concat video clips
  const listFile = path.join(TMP_DIR, "concat_list.txt");
  const listContent = renderedFiles
    .map((f) => `file '${f.replace(/\\/g, "/")}'`)
    .join("\n");
  writeFileSync(listFile, listContent);

  const stitchedVideo = path.join(TMP_DIR, "video_stitched.mp4");
  console.log("\nConcatenating 60 FPS video stream...");
  execFileSync(
    ffmpegPath,
    ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", stitchedVideo],
    { stdio: "inherit" }
  );

  // 2. Build Master Audio
  const masterAudio = buildMasterAudio(totalDuration);

  // 3. Final Mux: Video + Master Audio -> Final Broadcast MP4
  const finalOutput = path.join(MEDIA_DIR, "codekinetix-reel-9-16.mp4");
  console.log("\nMuxing video and audio into broadcast master...");
  const muxArgs = [
    "-y",
    "-i", stitchedVideo,
    "-i", masterAudio,
    "-map", "0:v",
    "-map", "1:a",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "256k",
    "-movflags", "+faststart",
    finalOutput,
  ];

  execFileSync(ffmpegPath, muxArgs, { stdio: "inherit" });

  console.log("\n==================================================");
  console.log(`✓ 9:16 MASTER SOCIAL REEL CREATED SUCCESSFULLY!`);
  console.log(`Output: ${finalOutput}`);
  console.log(`Duration: ${totalDuration.toFixed(2)} seconds`);
  console.log(`Resolution: ${W}x${H} @ 60 FPS`);
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Compilation error:", err);
  process.exit(1);
});
