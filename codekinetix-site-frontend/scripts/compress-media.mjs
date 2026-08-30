import ffmpegPath from "ffmpeg-static";
import { execSync } from "node:child_process";
import { readdirSync, statSync, renameSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = join(ROOT, "..", "public", "media");

const files = readdirSync(MEDIA_DIR).filter((f) => f.endsWith(".mov") || f.endsWith(".mp4"));

console.log(`Found ${files.length} video files in ${MEDIA_DIR}`);
console.log(`Using ffmpeg binary at: ${ffmpegPath}`);

for (const file of files) {
  const filePath = join(MEDIA_DIR, file);
  const sizeBefore = statSync(filePath).size;
  const tempPath = join(MEDIA_DIR, `temp_${file}`);

  console.log(`\nCompressing ${file} (${(sizeBefore / (1024 * 1024)).toFixed(2)} MB)...`);

  try {
    // Compress with H.264, CRF 24, faststart (web optimized)
    const cmd = `"${ffmpegPath}" -y -i "${filePath}" -vcodec libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart -an "${tempPath}"`;
    execSync(cmd, { stdio: "inherit" });

    const sizeAfter = statSync(tempPath).size;
    console.log(`✓ Compressed: ${(sizeAfter / (1024 * 1024)).toFixed(2)} MB (saved ${(((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1)}%)`);

    // Replace original file with compressed file
    unlinkSync(filePath);
    renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Failed to compress ${file}:`, err);
    if (statSync(tempPath).size) unlinkSync(tempPath);
  }
}

console.log("\nAll media optimization complete!");
