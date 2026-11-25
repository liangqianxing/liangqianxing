import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { palette, versionedAssets } from "./profile-style.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const icons = path.join(root, "assets", "tool-icons");
const output = path.join(root, "assets", "tool-badges");
const outputs = versionedAssets(root);
const tools = [
  ["python", "Python", ["python"]],
  ["pytorch", "PyTorch", ["pytorch"]],
  ["transformers", "Transformers", ["transformers"]],
  ["react-loop", "ReAct", ["react-loop"]],
  ["mcp", "MCP", ["mcp"]],
  ["context", "Context Management", ["context"]],
  ["typescript", "TypeScript", ["typescript"]],
  ["react-vue", "React / Vue", ["react", "vue"]],
  ["nuxt", "Nuxt", ["nuxt"]],
  ["fastapi", "FastAPI", ["fastapi"]],
  ["cplusplus-cuda", "C++ / CUDA", ["cplusplus", "cuda"]],
  ["docker-linux", "Docker / Linux", ["docker", "linux"]],
];
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const shapes = (id) => fs.readFileSync(path.join(icons, `${id}.svg`), "utf8")
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<title[^>]*>[\s\S]*?<\/title>/g, "")
  .replace(/<\/svg>\s*$/, "")
  .trim();

fs.mkdirSync(output, { recursive: true });
for (const [id, label, iconIds] of tools) {
  const labelX = 10 + iconIds.length * 24;
  const width = Math.ceil(labelX + label.length * 7.8 + 12);
  const pictures = iconIds.map((icon, i) => `<g transform="translate(${7 + i * 24} 5) scale(0.6875)" aria-hidden="true">${shapes(icon)}</g>`).join("\n");
  for (const theme of ["light", "dark"]) {
    const dark = theme === "dark";
    const colors = palette(dark);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="32" viewBox="0 0 ${width} 32" fill="none" role="img" aria-labelledby="title">
  <title id="title">${xml(label)}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="${colors.background}"/>
      <stop offset="1" stop-color="${colors.surface}"/>
    </linearGradient>
  </defs>
  <rect x="0.6" y="0.6" width="${width - 1.2}" height="30.8" rx="9" fill="url(#bg)" stroke="${colors.border}" stroke-width="1.1"/>
  ${pictures}
  <text x="${labelX}" y="20.5" font-family="'SFMono-Regular', Consolas, 'Liberation Mono', monospace" font-size="12.8" font-weight="550" fill="${colors.text}">${xml(label)}</text>
</svg>\n`;
    outputs.write(`assets/tool-badges/${id}-${theme}.svg`, svg.replace(/[ \t]+\n/g, "\n"));
  }
}
outputs.finish();
console.log("Generated 12 tool badges in light and dark themes.");
