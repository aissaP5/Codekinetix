/**
 * Recapture just LUMÉA mobile screenshot — waits for preloader to fully clear.
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.resolve(__dirname, "../public/media/Lumea-mobile.png");

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 620, isMobile: true, hasTouch: true });

  try {
    await page.goto("http://localhost:3000/projects/lumea/index.html", {
      waitUntil: "networkidle0",
      timeout: 20000,
    });
  } catch {
    await page.goto("http://localhost:3000/projects/lumea/index.html", {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
  }

  // Preloader timeline completes at ~3.42s — wait 5s total for full hero reveal
  await new Promise((r) => setTimeout(r, 5500));

  // Force-nuke any remaining preloader overlay
  await page.evaluate(() => {
    document.querySelectorAll("[aria-hidden]").forEach((el) => {
      if (el.classList.contains("fixed") || getComputedStyle(el).position === "fixed") {
        el.remove();
      }
    });
  });

  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: dest, type: "png", clip: { x: 0, y: 0, width: 390, height: 620 } });
  console.log(`[lumea mobile] saved → ${dest}`);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
