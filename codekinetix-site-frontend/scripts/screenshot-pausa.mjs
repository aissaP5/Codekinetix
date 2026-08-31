import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.resolve(__dirname, "../public/media/pausa.png");

const WIDTH = 1440;
const HEIGHT = 900;

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  console.log("[pausa] loading page...");
  await page.goto("http://localhost:3000/projects/pausa/index.html", {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  // Let the natural page load & GSAP timeline complete, then force complete all timelines and ensure all hero elements are visible
  await page.evaluate(async () => {
    // Fast forward any active GSAP timelines
    if (window.gsap) {
      window.gsap.globalTimeline.timeScale(10);
    }
    // Wait 2s for all animations to reach end state
    await new Promise((r) => setTimeout(r, 2000));
    
    // Explicitly clean up preloader and enforce final hero opacity
    const pre = document.getElementById("preloader");
    if (pre) pre.remove();
    document.body.classList.remove("loading");
    
    const nav = document.getElementById("main-nav");
    if (nav) {
      nav.style.opacity = "1";
      nav.style.transform = "none";
    }
    
    const heroChars = document.querySelectorAll("#hero-title .char");
    heroChars.forEach((c) => {
      c.style.transform = "none";
      c.style.opacity = "1";
    });
    
    const heroMeta = document.querySelectorAll("#hero-meta > *");
    heroMeta.forEach((m) => {
      m.style.opacity = "1";
      m.style.transform = "none";
    });
    
    const heroBottom = document.querySelectorAll("#hero-bottom > *");
    heroBottom.forEach((b) => {
      b.style.opacity = "1";
      b.style.transform = "none";
    });
  });

  // Wait 1.5s for fonts & layout
  console.log("[pausa] waiting for layout to be crystal clear...");
  await new Promise((r) => setTimeout(r, 1500));

  console.log("[pausa] taking final screenshot...");
  await page.screenshot({
    path: dest,
    type: "png",
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });

  console.log(`[pausa] saved to ${dest}`);
  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
