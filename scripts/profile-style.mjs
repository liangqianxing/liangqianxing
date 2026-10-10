import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export const palette = (dark) => dark ? {
  background: "#121C2B", tint: "#172437", border: "#304056",
  title: "#F0F4FA", text: "#C1CDDD", muted: "#A5B4C8",
  blue: "#9FBEED", violet: "#9ED4D2", cyan: "#9ED4D2", pink: "#E6BA83",
} : {
  background: "#FBFCFD", tint: "#F0F4F8", border: "#D8E1EB",
  title: "#1B2C44", text: "#40536B", muted: "#55687F",
  blue: "#325F99", violet: "#276C75", cyan: "#276C75", pink: "#875C28",
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
