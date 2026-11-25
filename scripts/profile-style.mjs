import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export const palette = (dark) => dark ? {
  background: "#0D1524",
  surface: "#121D30",
  tint: "#162338",
  border: "#263752",
  borderSubtle: "#1D2C44",
  grid: "#2B3F5E",
  title: "#F4F7FC",
  text: "#C6D3E5",
  muted: "#8FA4C2",
  blue: "#7FB0FA",
  violet: "#6ED6D0",
  cyan: "#6ED6D0",
  pink: "#EEBE82",
  amber: "#F2C572",
  glowOpacity: "0.18",
  gridOpacity: "0.22",
} : {
  background: "#FCFDFF",
  surface: "#F6F9FC",
  tint: "#EFF4FA",
  border: "#D5E0EC",
  borderSubtle: "#E4ECF5",
  grid: "#CBD8E8",
  title: "#142238",
  text: "#3B4F69",
  muted: "#607590",
  blue: "#285EA8",
  violet: "#1C747E",
  cyan: "#1C747E",
  pink: "#9A6324",
  amber: "#B07318",
  glowOpacity: "0.11",
  gridOpacity: "0.34",
};

// Content-addressed filenames keep GitHub's image cache in sync with the design.
export const versionedAssets = (root) => {
  const readmePath = path.join(root, "README.md");
  let readme = fs.readFileSync(readmePath, "utf8");
  const obsolete = new Set();
  return {
    write(relativeName, svg) {
      const hash = createHash("sha256").update(svg).digest("hex").slice(0, 10);
      const filename = relativeName.replace(/\.svg$/, `-${hash}.svg`);
      fs.writeFileSync(path.join(root, filename), svg);
      const base = relativeName.replace(/\.svg$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      readme = readme.replace(new RegExp(`${base}(?:-[a-f0-9]{10})?\\.svg`, "g"), (old) => {
        if (old !== filename) obsolete.add(old);
        return filename;
      });
      return filename;
    },
    finish() {
      fs.writeFileSync(readmePath, readme);
      for (const filename of obsolete) {
        if (!readme.includes(filename)) fs.rmSync(path.join(root, filename), { force: true });
      }
    },
  };
};
