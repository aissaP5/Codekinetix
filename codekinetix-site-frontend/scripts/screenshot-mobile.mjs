/**
 * Takes 390×650 mobile viewport screenshots of all embedded projects
 * to use as native portrait thumbnails on mobile devices.
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(__dirname, "../public/media");

const PROJECTS = [
  { id: "lumea", url: "http://localhost:3000/projects/lumea/index.html", out: "Lumea-mobile.png" },
  { id: "marfil", url: "http://localhost:3000/projects/marfil/index.html", out: "marfil-mobile.png" },
  { id: "smashd", url: "http://localhost:3000/projects/smashd/index.html", out: "smashed-mobile.png" },
  { id: "pausa", url: "http://localhost:3000/projects/pausa/index.html", out: "pausa-mobile.png" },
  { id: "bistro", url: "http://localhost:3000/projects/bistro/index.html", out: "bristo-mobile.png" },
  { id: "pizzaman", url: "http://localhost:3000/projects/pizzaman/index.html", out: "pizzaman-mobile.png" },
];

const WIDTH = 390;
const HEIGHT = 620;

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const { id, url, out } of PROJECTS) {
    console.log(`[mobile screenshot] ${id} → ${out}`);
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, isMobile: true, hasTouch: true });

    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    }

    if (id === "pausa") {
      await page.evaluate(() => {
        const pre = document.getElementById("preloader");
        if (pre) pre.remove();
        document.body.classList.remove("loading");
      });
    }

    await new Promise((r) => setTimeout(r, 2500));
    const dest = path.join(mediaDir, out);
    await page.screenshot({ path: dest, type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    console.log(`[mobile screenshot] saved → ${dest}`);
    await page.close();
  }

  await browser.close();
  console.log("[mobile screenshot] all done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
