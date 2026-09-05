import puppeteer from "puppeteer";
import ffmpegPath from "ffmpeg-static";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const TEMP_DIR = path.join(ROOT, ".ad-video-temp");
const OUTPUT_VIDEO = path.join(ROOT, "public", "media", "codekinetix-ad-reel.mp4");
const WORKSPACE_OUTPUT = path.resolve(ROOT, "..", "codekinetix-ad-reel.mp4");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Clean old temp files
const oldFiles = fs.readdirSync(TEMP_DIR);
for (const f of oldFiles) {
  try {
    fs.unlinkSync(path.join(TEMP_DIR, f));
  } catch {}
}

const SCENES = [
  {
    id: "smashed",
    num: "01 / 06",
    category: "3D & KINETIC MOTION",
    title: "SMASH'D BURGERS",
    subtitle: "Scroll-Triggered 3D Sequence & Custom Bag Drawer",
    metric1: "STACK: NEXT.JS 16 · GSAP · CANVAS",
    metric2: "PERFORMANCE: 60 FPS · 0.38S LOAD",
    videoFile: "smashed.mov",
    duration: 3.0,
  },
  {
    id: "lumea",
    num: "02 / 06",
    category: "LUXURY DIGITAL COMMERCE",
    title: "LUMÉA PARIS",
    subtitle: "Haute-Couture Skincare Flagship & Bespoke Cart",
    metric1: "TYPOGRAPHY: CORMORANT GARAMOND",
    metric2: "ENGAGEMENT: 98% RETENTION · ZERO BLOAT",
    videoFile: "lumea.mov",
    duration: 3.0,
  },
  {
    id: "marfil",
    num: "03 / 06",
    category: "CLINICAL ARCHITECTURE",
    title: "MARFIL MADRID",
    subtitle: "Private Dental House — Calle de Serrano 47",
    metric1: "ARCHITECTURE: DIRECT BOOKINGS ENGINE",
    metric2: "SPEED: 99 PERFORMANCE · EDGE CDN",
    videoFile: "marfil.mov",
    duration: 3.0,
  },
  {
    id: "pizzaman",
    num: "04 / 06",
    category: "POP-CULTURE STORYTELLING",
    title: "PIZZA-MAN!",
    subtitle: "Comic-Book Pizzeria with Interactive Cart",
    metric1: "IDENTITY: HALFTONE BURSTS · KINETIC PANELS",
    metric2: "CHECKOUT: 3-STEP INSTANT ORDERING",
    videoFile: "pizzaman.mov",
    duration: 2.5,
  },
  {
    id: "pausa",
    num: "05 & 06",
    category: "HOSPITALITY SHOWCASE",
    title: "PAUSA COFFEE ATELIER",
    subtitle: "Artisanal Sensory Roastery & Dining Space",
    metric1: "EXPERIENCE: BESPOKE VISUALS & SOUND",
    metric2: "DEPLOYMENT: EDGE NATIVE ARCHITECTURE",
    videoFile: "pausa.mov",
    duration: 2.0,
  },
];

console.log("Launching Puppeteer to render 1080x1920 graphic overlays...");

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

function getOverlayHTML(scene) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: transparent;
      color: #F2F1EA;
      font-family: 'Archivo', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 56px 80px 56px;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .serif { font-family: 'Instrument Serif', Georgia, serif; }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(242, 241, 234, 0.18);
      padding-bottom: 24px;
    }
    .brand-mark {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .diamond {
      width: 14px;
      height: 14px;
      background: #C6FF00;
      transform: rotate(45deg);
    }
    .slot-pill {
      background: rgba(198, 255, 0, 0.12);
      border: 1px solid #C6FF00;
      color: #C6FF00;
      font-size: 15px;
      padding: 6px 16px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .header-block {
      margin-top: 36px;
    }
    .category-label {
      font-size: 15px;
      letter-spacing: 0.35em;
      color: #C6FF00;
      text-transform: uppercase;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .project-title {
      font-size: 68px;
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #F2F1EA;
      margin-bottom: 14px;
    }
    .project-sub {
      font-size: 26px;
      color: rgba(242, 241, 234, 0.75);
      line-height: 1.3;
    }

    .video-frame-container {
      width: 968px;
      height: 544px;
      margin: 36px auto;
      border: 1.5px solid rgba(242, 241, 234, 0.3);
      position: relative;
      background: transparent;
      box-shadow: 0 0 60px rgba(0,0,0,0.8);
    }
    .corner-tick {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: #C6FF00;
      border-style: solid;
    }
    .c-tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; }
    .c-tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; }
    .c-bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; }
    .c-br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; }

    .live-badge {
      position: absolute;
      top: -16px;
      right: 24px;
      background: #0A0A0B;
      border: 1px solid rgba(242, 241, 234, 0.25);
      padding: 4px 14px;
      font-size: 13px;
      color: #C6FF00;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.15em;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #C6FF00;
      border-radius: 50%;
    }

    .meta-box {
      border: 1px solid rgba(242, 241, 234, 0.15);
      background: rgba(21, 21, 23, 0.85);
      padding: 24px 28px;
      margin-top: 20px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      letter-spacing: 0.2em;
      margin-bottom: 12px;
      color: rgba(242, 241, 234, 0.65);
      text-transform: uppercase;
    }
    .meta-row:last-child { margin-bottom: 0; }
    .meta-highlight { color: #C6FF00; font-weight: 700; }

    .bottom-cta-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(242, 241, 234, 0.18);
      padding-top: 24px;
      margin-top: 36px;
    }
    .cta-text {
      font-size: 14px;
      letter-spacing: 0.25em;
      color: rgba(242, 241, 234, 0.5);
      text-transform: uppercase;
    }
    .cta-button {
      background: #C6FF00;
      color: #0A0A0B;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.2em;
      padding: 12px 24px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="brand-mark">
      <span class="diamond"></span>
      <span>CodeKinetix<sup style="color:#C6FF00; font-size:12px">®</sup></span>
    </div>
    <div class="slot-pill mono">
      SLOT ${scene.num}
    </div>
  </div>

  <div class="header-block">
    <div class="category-label mono">
      <span>//</span>
      <span>${scene.category}</span>
    </div>
    <h1 class="project-title">${scene.title}</h1>
    <p class="project-sub serif italic">&ldquo;${scene.subtitle}&rdquo;</p>
  </div>

  <div class="video-frame-container">
    <span class="corner-tick c-tl"></span>
    <span class="corner-tick c-tr"></span>
    <span class="corner-tick c-bl"></span>
    <span class="corner-tick c-br"></span>
    <div class="live-badge mono">
      <span class="live-dot"></span>
      <span>60 FPS CAPTURE</span>
    </div>
  </div>

  <div class="meta-box mono">
    <div class="meta-row">
      <span>${scene.metric1}</span>
      <span class="meta-highlight">VERIFIED</span>
    </div>
    <div class="meta-row">
      <span>${scene.metric2}</span>
      <span class="meta-highlight">EDGE NATIVE</span>
    </div>
  </div>

  <div class="bottom-cta-strip">
    <div class="cta-text mono">
      WWW.CODEKINETIX.DEV
    </div>
    <div class="cta-button mono">
      START A PROJECT ↗
    </div>
  </div>
</body>
</html>`;
}

// 1. Render PNG Overlays for each project scene
for (const scene of SCENES) {
  console.log(`Rendering overlay for ${scene.id}...`);
  const html = getOverlayHTML(scene);
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  const outPath = path.join(TEMP_DIR, `overlay_${scene.id}.png`);
  await page.screenshot({ path: outPath, type: "png", omitBackground: true });
}

// 2. Render Intro Scene (90 frames at 30 FPS = 3.0s)
console.log("Setting up animated Intro Hook...");
const baseIntroHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #0A0A0B;
      color: #F2F1EA;
      font-family: 'Archivo', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 90px 60px 100px 60px;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(242, 241, 234, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(242, 241, 234, 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .serif { font-family: 'Instrument Serif', Georgia, serif; }

    .top-beacon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(242, 241, 234, 0.15);
      padding-bottom: 24px;
      position: relative;
      z-index: 2;
    }
    .diamond {
      width: 16px;
      height: 16px;
      background: #C6FF00;
      transform: rotate(45deg);
    }
    .badge {
      color: #C6FF00;
      font-size: 15px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #mainCenter {
      position: relative;
      z-index: 2;
      transform-origin: center center;
    }
    .studio-kicker {
      font-size: 16px;
      letter-spacing: 0.4em;
      color: #C6FF00;
      text-transform: uppercase;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .studio-wordmark {
      font-size: 92px;
      font-weight: 900;
      line-height: 0.88;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      color: #F2F1EA;
      margin-bottom: 36px;
    }
    .manifesto-box {
      border-left: 4px solid #C6FF00;
      padding-left: 28px;
      margin-bottom: 40px;
    }
    .manifesto-text {
      font-size: 42px;
      line-height: 1.15;
      color: #F2F1EA;
    }
    .manifesto-sub {
      font-size: 18px;
      color: rgba(242, 241, 234, 0.6);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-top: 18px;
    }

    .bottom-status {
      position: relative;
      z-index: 2;
      border-top: 1px solid rgba(242, 241, 234, 0.15);
      padding-top: 28px;
    }
    #progressLine {
      height: 3px;
      background: #C6FF00;
      width: 0%;
      margin-bottom: 24px;
    }
    .status-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: rgba(242, 241, 234, 0.5);
      letter-spacing: 0.25em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>

  <div class="top-beacon mono">
    <div style="display:flex; align-items:center; gap:14px;">
      <span class="diamond"></span>
      <span style="font-weight:900; letter-spacing:0.2em; font-size:18px;">CODEKINETIX STUDIO</span>
    </div>
    <div class="badge">
      <span>● SHOWREEL 2026</span>
    </div>
  </div>

  <div id="mainCenter">
    <div class="studio-kicker mono">
      <span>// CREATIVE FRONT-END ARCHITECTURE</span>
    </div>
    <div class="studio-wordmark">
      WE BUILD<br>
      DIGITAL<br>
      EXPERIENCES<br>
      <span style="color:#C6FF00;">THAT PEOPLE</span><br>
      <span style="color:#C6FF00;">REMEMBER.</span>
    </div>
    <div class="manifesto-box">
      <p class="serif italic manifesto-text">
        Zero templates. Zero page bloat.<br>
        Haute-couture typography & 60 FPS motion.
      </p>
      <p class="mono manifesto-sub">
        6 FLAGSHIP PROJECTS REVIEWED //
      </p>
    </div>
  </div>

  <div class="bottom-status mono">
    <div id="progressLine"></div>
    <div class="status-row">
      <span>STARTING CLIENT SHOWCASE</span>
      <span>01 OF 06 ↗</span>
    </div>
  </div>
</body>
</html>`;

await page.setContent(baseIntroHTML, { waitUntil: "domcontentloaded", timeout: 15000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});

console.log("Rendering 90 Intro Hook frames...");
for (let frame = 0; frame < 90; frame++) {
  const t = frame / 90;
  const opacity = Math.min(1, t * 3.5);
  const scale = 1.04 - t * 0.04;
  const lineW = Math.min(100, Math.round(t * 120));

  await page.evaluate(
    (op, sc, lw) => {
      const el = document.getElementById("mainCenter");
      if (el) {
        el.style.opacity = op;
        el.style.transform = `scale(${sc})`;
      }
      const pl = document.getElementById("progressLine");
      if (pl) {
        pl.style.width = `${lw}%`;
      }
    },
    opacity,
    scale,
    lineW
  );

  const framePadded = String(frame).padStart(4, "0");
  await page.screenshot({ path: path.join(TEMP_DIR, `intro_${framePadded}.png`), type: "png" });
}

// 3. Render Outro CTA Scene (90 frames at 30 FPS = 3.0s)
console.log("Setting up animated Outro CTA...");
const baseOutroHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #0A0A0B;
      color: #F2F1EA;
      font-family: 'Archivo', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 90px 60px 100px 60px;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(242, 241, 234, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(242, 241, 234, 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .serif { font-family: 'Instrument Serif', Georgia, serif; }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(242, 241, 234, 0.18);
      padding-bottom: 24px;
      position: relative;
      z-index: 2;
    }
    .diamond {
      width: 16px;
      height: 16px;
      background: #C6FF00;
      transform: rotate(45deg);
    }
    .live-slot {
      background: #C6FF00;
      color: #0A0A0B;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.2em;
      padding: 6px 16px;
      text-transform: uppercase;
    }

    .main-cta {
      position: relative;
      z-index: 2;
      text-align: left;
    }
    .cta-kicker {
      font-size: 16px;
      letter-spacing: 0.35em;
      color: #C6FF00;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .cta-heading {
      font-size: 96px;
      font-weight: 900;
      line-height: 0.9;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      color: #F2F1EA;
      margin-bottom: 32px;
    }
    .cta-quote {
      font-size: 36px;
      color: rgba(242, 241, 234, 0.8);
      margin-bottom: 48px;
      line-height: 1.25;
    }

    #buttonWrap {
      display: inline-block;
      transform-origin: left center;
      margin-bottom: 48px;
    }
    .big-btn {
      background: #C6FF00;
      color: #0A0A0B;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 0.15em;
      padding: 28px 60px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 18px;
      border: none;
    }

    .info-grid {
      border-top: 1px solid rgba(242, 241, 234, 0.2);
      padding-top: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .info-label {
      font-size: 13px;
      letter-spacing: 0.25em;
      color: rgba(242, 241, 234, 0.4);
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .info-val {
      font-size: 20px;
      color: #F2F1EA;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .bottom-bar {
      border-top: 1px solid rgba(242, 241, 234, 0.15);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: rgba(242, 241, 234, 0.45);
      letter-spacing: 0.25em;
      text-transform: uppercase;
      position: relative;
      z-index: 2;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>

  <div class="top-bar mono">
    <div style="display:flex; align-items:center; gap:14px;">
      <span class="diamond"></span>
      <span style="font-weight:900; font-size:18px; letter-spacing:0.15em;">CODEKINETIX®</span>
    </div>
    <div class="live-slot">
      NEXT SPRINT // OPEN
    </div>
  </div>

  <div class="main-cta">
    <div class="cta-kicker mono">
      // READY TO BUILD SOMETHING MEMORABLE?
    </div>
    <h1 class="cta-heading">
      YOUR NEXT<br>
      WEBSITE<br>
      STARTS<br>
      <span style="color:#C6FF00;">HERE.</span>
    </h1>
    <p class="serif italic cta-quote">
      Direct founder partnership. 5-week sprint from blank canvas to global CDN.
    </p>

    <div id="buttonWrap">
      <div class="big-btn mono">
        <span>START A PROJECT</span>
        <span style="font-size:36px;">↗</span>
      </div>
    </div>

    <div class="info-grid mono">
      <div>
        <div class="info-label">OFFICIAL WEBSITE</div>
        <div class="info-val" style="color:#C6FF00;">CODEKINETIX.DEV</div>
      </div>
      <div>
        <div class="info-label">DIRECT INQUIRIES</div>
        <div class="info-val">hello@codekinetix.dev</div>
      </div>
    </div>
  </div>

  <div class="bottom-bar mono">
    <span>ORAN / WORLDWIDE CDN</span>
    <span>© 2026 CODEKINETIX STUDIO</span>
  </div>
</body>
</html>`;

await page.setContent(baseOutroHTML, { waitUntil: "domcontentloaded", timeout: 15000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});

console.log("Rendering 90 Outro CTA frames...");
for (let frame = 0; frame < 90; frame++) {
  const t = frame / 90;
  const pulseScale = 1 + Math.sin(t * Math.PI * 4) * 0.025;

  await page.evaluate((sc) => {
    const btn = document.getElementById("buttonWrap");
    if (btn) {
      btn.style.transform = `scale(${sc})`;
    }
  }, pulseScale);

  const framePadded = String(frame).padStart(4, "0");
  await page.screenshot({ path: path.join(TEMP_DIR, `outro_${framePadded}.png`), type: "png" });
}

await browser.close();
console.log("All frames and overlays generated successfully!");

// 4. Encode Intro video clip
console.log("Encoding Intro video clip (H.264)...");
const introClipPath = path.join(TEMP_DIR, "clip_intro.mp4");
execSync(
  `"${ffmpegPath}" -y -framerate 30 -i "${path.join(TEMP_DIR, "intro_%04d.png")}" -c:v libx264 -pix_fmt yuv420p -r 30 "${introClipPath}"`,
  { stdio: "inherit" }
);

// 5. Encode Outro video clip
console.log("Encoding Outro video clip (H.264)...");
const outroClipPath = path.join(TEMP_DIR, "clip_outro.mp4");
execSync(
  `"${ffmpegPath}" -y -framerate 30 -i "${path.join(TEMP_DIR, "outro_%04d.png")}" -c:v libx264 -pix_fmt yuv420p -r 30 "${outroClipPath}"`,
  { stdio: "inherit" }
);

// 6. Encode each project scene
const sceneClipPaths = [];

for (const scene of SCENES) {
  console.log(`Compositing project clip for ${scene.id}...`);
  const rawVideoPath = path.join(MEDIA_DIR, scene.videoFile);
  const overlayPath = path.join(TEMP_DIR, `overlay_${scene.id}.png`);
  const sceneOutPath = path.join(TEMP_DIR, `clip_${scene.id}.mp4`);

  const filter = `
    color=c=#0A0A0B:s=1080x1920:d=${scene.duration}:r=30[bg];
    [0:v]setpts=PTS-STARTPTS,scale=968:544:force_original_aspect_ratio=increase,crop=968:544,fps=30[vid];
    [bg][vid]overlay=x=56:y=490[composite];
    [composite][1:v]overlay=x=0:y=0[final]
  `.replace(/\s+/g, " ").trim();

  const cmd = `"${ffmpegPath}" -y -t ${scene.duration} -i "${rawVideoPath}" -i "${overlayPath}" -filter_complex "${filter}" -map "[final]" -c:v libx264 -pix_fmt yuv420p -r 30 "${sceneOutPath}"`;
  execSync(cmd, { stdio: "inherit" });
  sceneClipPaths.push(sceneOutPath);
}

// 7. Concatenate all clips into master video
console.log("Concatenating all clips...");
const concatListFile = path.join(TEMP_DIR, "concat_list.txt");
const allClips = [introClipPath, ...sceneClipPaths, outroClipPath];
const concatContent = allClips.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n");
fs.writeFileSync(concatListFile, concatContent);

const silentConcatVideo = path.join(TEMP_DIR, "master_no_audio.mp4");
execSync(
  `"${ffmpegPath}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${silentConcatVideo}"`,
  { stdio: "inherit" }
);

// 8. Generate Synthesized Sync Audio Track (16-bit PCM WAV)
console.log("Synthesizing audio soundtrack...");
const sampleRate = 44100;
const totalSeconds = 3.0 + 3.0 + 3.0 + 3.0 + 2.5 + 2.0 + 3.0; // 19.5 seconds
const numSamples = Math.floor(sampleRate * totalSeconds);
const audioBuffer = Buffer.alloc(44 + numSamples * 2);

// WAV Header (44 bytes, 16-bit Mono PCM, 44100 Hz)
audioBuffer.write("RIFF", 0);
audioBuffer.writeUInt32LE(36 + numSamples * 2, 4);
audioBuffer.write("WAVE", 8);
audioBuffer.write("fmt ", 12);
audioBuffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
audioBuffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
audioBuffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
audioBuffer.writeUInt32LE(sampleRate, 24); // SampleRate
audioBuffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
audioBuffer.writeUInt16LE(2, 32);  // BlockAlign
audioBuffer.writeUInt16LE(16, 34); // BitsPerSample
audioBuffer.write("data", 36);
audioBuffer.writeUInt32LE(numSamples * 2, 40);

// Transition timestamps in seconds
const transitions = [3.0, 6.0, 9.0, 12.0, 14.5, 16.5];

// Synthesize samples:
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;

  // 1. Kick Bass: every 0.5 seconds (120 BPM)
  const beatTime = t % 0.5;
  const kickFreq = 120 * Math.exp(-beatTime * 18) + 48;
  const kickEnv = Math.exp(-beatTime * 8);
  const kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.45;

  // 2. Hi-Hat tick: every 0.25 seconds (eighth notes)
  const hatTime = t % 0.25;
  const hatEnv = Math.exp(-hatTime * 45);
  const whiteNoise = (Math.random() * 2 - 1) * hatEnv * 0.08;

  // 3. Whoosh / Riser sweep before each scene cut (0.4s leading up to cut)
  let sweep = 0;
  for (const trans of transitions) {
    if (t >= trans - 0.45 && t <= trans) {
      const sweepProgress = (t - (trans - 0.45)) / 0.45;
      const sweepFreq = 300 + sweepProgress * 1200;
      sweep += Math.sin(2 * Math.PI * sweepFreq * t) * sweepProgress * 0.18;
    }
  }

  // 4. Sub-bass ring on the CTA outro (16.5s to 19.5s)
  let outroChime = 0;
  if (t >= 16.5) {
    const outroT = t - 16.5;
    const chimeEnv = Math.exp(-outroT * 0.8);
    outroChime = (Math.sin(2 * Math.PI * 65.4 * t) + Math.sin(2 * Math.PI * 130.8 * t) * 0.5) * chimeEnv * 0.35;
  }

  const sampleVal = Math.max(-1, Math.min(1, kick + whiteNoise + sweep + outroChime));
  const int16 = Math.round(sampleVal * 32767);
  audioBuffer.writeInt16LE(int16, 44 + i * 2);
}

const audioWavPath = path.join(TEMP_DIR, "soundtrack.wav");
fs.writeFileSync(audioWavPath, audioBuffer);
console.log("Soundtrack synthesized successfully!");

// 9. Combine Video and Audio into final Master Reel
console.log(`Writing final social video to ${OUTPUT_VIDEO}...`);
execSync(
  `"${ffmpegPath}" -y -i "${silentConcatVideo}" -i "${audioWavPath}" -c:v copy -c:a aac -b:a 192k -movflags +faststart "${OUTPUT_VIDEO}"`,
  { stdio: "inherit" }
);

// Copy to workspace root for instant access
fs.copyFileSync(OUTPUT_VIDEO, WORKSPACE_OUTPUT);

console.log("\n==========================================");
console.log("🎉 SUCCESS! CODEKINETIX AD REEL IS READY!");
console.log(`→ Saved in frontend: ${OUTPUT_VIDEO}`);
console.log(`→ Saved in workspace root: ${WORKSPACE_OUTPUT}`);
console.log("==========================================");
