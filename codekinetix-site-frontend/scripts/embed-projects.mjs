/**
 * embed-projects.mjs — builds the studio projects into public/projects/
 * so the Works section can open them INSIDE the portfolio.
 *
 * Next.js projects get a temporary `basePath` + `output: "export"` patch
 * (original next.config.ts is restored afterwards), then their `out/`
 * folder is copied into public/projects/<id>/. Static HTML projects are
 * copied as-is to public/projects/<id>/index.html.
 *
 * Run from the portfolio root:  npm run embed:projects
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const NEXT_PROJECTS = [
  { id: "lumea", dir: "../lumea" },
  { id: "marfil", dir: "../marfil-website" },
  { id: "pizzaman", dir: "../pizza-man-website" },
  { id: "smashd", dir: "../smashd-landing-page" },
];

const HTML_PROJECTS = [
  { id: "pausa", file: "../coffeshop/pausaVF.html" },
  { id: "bistro", file: "../Restaurant/index.html" },
];

const log = (msg) => console.log(`\x1b[35m[embed]\x1b[0m ${msg}`);

/**
 * Next's basePath prefixes _next assets and router paths, but plain
 * string references to public/ assets ("…src="/images/hero.png") are
 * baked into the compiled JS/HTML untouched — they would 404 against
 * the portfolio root. Rewrite every quoted / url() / srcset reference
 * to the embedded location, scoped to names that actually exist in the
 * project's public/ folder so router paths ("/", "/about") are safe.
 */
function rewriteAssetPaths(dir, id, projectDir) {
  const pubDir = join(projectDir, "public");
  if (!existsSync(pubDir)) return;
  const assets = readdirSync(pubDir).filter((n) => !n.startsWith("."));
  if (!assets.length) return;

  const base = `/projects/${id}`;
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rules = assets.flatMap((a) => {
    const e = esc(a);
    return [
      // quoted strings — JS chunks, HTML attributes, RSC payloads ("…src:\"/images/x\"")
      [new RegExp(`(["'\`])/${e}(?=[/"'\`\\\\s,)\\]])`, "g"), `$1${base}/${a}`],
      // unquoted url(/images/…) in CSS / inline styles
      [new RegExp(`(url\\(\\s*)/${e}(?=[/"')\\s])`, "g"), `$1${base}/${a}`],
      // srcset continuation: "…1x, /images/x 2x"
      [new RegExp(`(,\\s*)/${e}(?=/)`, "g"), `$1${base}/${a}`],
    ];
  });

  const exts = new Set([".html", ".css", ".js", ".txt"]);
  let touched = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (exts.has(extname(entry.name))) {
        const before = readFileSync(p, "utf8");
        let text = before;
        for (const [re, rep] of rules) text = text.replace(re, rep);
        if (text !== before) {
          writeFileSync(p, text);
          touched++;
        }
      }
    }
  };
  walk(dir);
  log(`rewrote public-asset paths → ${base}/ in ${touched} file(s)`);
}

function embedNextProject({ id, dir }) {
  const projectDir = resolve(ROOT, dir);
  const configPath = join(projectDir, "next.config.ts");
  if (!existsSync(configPath)) throw new Error(`no next.config.ts in ${dir}`);

  const original = readFileSync(configPath, "utf8");
  const dest = join(ROOT, "public", "projects", id);
  // Park API routes OUTSIDE src/app — any folder left inside app/ becomes
  // a route itself and dynamic handlers break `output: "export"`.
  const apiDir = join(projectDir, "src", "app", "api");
  const apiParked = join(projectDir, ".embed-parked-api");

  // API routes can break `output: "export"` — park them for the build
  const hadApi = existsSync(apiDir);
  if (hadApi) renameSync(apiDir, apiParked);

  let patched = original;
  if (/output:\s*"/.test(patched)) {
    patched = patched.replace(/output:\s*"[^"]*"/, 'output: "export"');
  } else {
    patched = patched.replace(
      /(NextConfig\s*=\s*\{)/,
      '$1\n  output: "export",'
    );
  }
  patched = patched.replace(
    /(NextConfig\s*=\s*\{)/,
    `$1\n  basePath: "/projects/${id}",`
  );

  try {
    log(`patching ${dir}/next.config.ts (basePath: /projects/${id}/)`);
    writeFileSync(configPath, patched, "utf8");

    log(`building ${id}…`);
    // `npx next build` directly — some projects' `npm run build` scripts copy
    // standalone outputs that don't exist under output: "export"
    execSync("npx next build", { cwd: projectDir, stdio: "inherit" });

    const outDir = join(projectDir, "out");
    if (!existsSync(outDir)) throw new Error(`${id}: build produced no out/`);

    rmSync(dest, { recursive: true, force: true });
    cpSync(outDir, dest, { recursive: true });
    rewriteAssetPaths(dest, id, projectDir);
    log(`copied ${id} → public/projects/${id}/`);
  } finally {
    writeFileSync(configPath, original, "utf8");
    if (hadApi) renameSync(apiParked, apiDir);
    log(`restored ${dir}/next.config.ts`);
  }
}

function embedHtmlProject({ id, file }) {
  const src = resolve(ROOT, file);
  if (!existsSync(src)) throw new Error(`missing ${file}`);
  const destDir = join(ROOT, "public", "projects", id);
  rmSync(destDir, { recursive: true, force: true });
  cpSync(src, join(destDir, "index.html"));
  log(`copied ${file} → public/projects/${id}/index.html`);
}

function main() {
  const only = process.argv[2]; // optional: embed a single project by id
  const next = only ? NEXT_PROJECTS.filter((p) => p.id === only) : NEXT_PROJECTS;
  const html = only ? HTML_PROJECTS.filter((p) => p.id === only) : HTML_PROJECTS;

  for (const p of next) embedNextProject(p);
  for (const p of html) embedHtmlProject(p);
  log("done.");
}

main();
