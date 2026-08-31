/**
 * Takes 1440×900 viewport screenshots of all embedded projects
 * and saves them to public/media/ as proper 16:9 thumbnails.
 */
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(__dirname, "../public/media");

const PROJECTS = [
  { id: "lumea",    url: "http://localhost:3000/projects/lumea/index.html",    out: "Lumea.png"   },
  { id: "marfil",   url: "http://localhost:3000/projects/marfil/index.html",   out: "marfil.png"  },
  { id: "smashd",   url: "http://localhost:3000/projects/smashd/index.html",   out: "smashed.png" },
  { id: "pausa",    url: "http://localhost:3000/projects/pausa/index.html",     out: "pausa.png"   },
  { id: "bistro",   url: "http://localhost:3000/projects/bistro/index.html",    out: "bristo.png"  },
  { id: "pizzaman", url: "http://localhost:3000/projects/pizzaman/index.html",  out: "pizzaman.png"},
];

const WIDTH  = 1440;
const HEIGHT = 900;

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const { id, url, out } of PROJECTS) {
    console.log(`[screenshot] ${id} → ${out}`);
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    }
    // Extra wait for animations/fonts
    await new Promise(r => setTimeout(r, 2500));
    const dest = path.join(mediaDir, out);
    await page.screenshot({ path: dest, type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    console.log(`[screenshot] saved → ${dest}`);
    await page.close();
  }

  await browser.close();
  console.log("[screenshot] all done.");
}

main().catch(e => { console.error(e); process.exit(1); });
