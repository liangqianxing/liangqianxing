import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const icons = path.join(root, "assets", "tool-icons");
const output = path.join(root, "assets", "tool-badges");
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
  const labelX = 8 + iconIds.length * 24;
  const width = Math.ceil(labelX + label.length * 7.8 + 10);
  const pictures = iconIds.map((icon, i) => `<g transform="translate(${6 + i * 24} 4) scale(0.6875)" aria-hidden="true">${shapes(icon)}</g>`).join("\n");
  for (const theme of ["light", "dark"]) {
    const dark = theme === "dark";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="30" viewBox="0 0 ${width} 30" fill="none" role="img" aria-labelledby="title">
  <title id="title">${xml(label)}</title>
  <rect x="0.5" y="0.5" width="${width - 1}" height="29" rx="8" fill="${dark ? "#19223B" : "#F1F4FC"}" stroke="${dark ? "#2B3A55" : "#DEE5F2"}"/>
  ${pictures}
  <text x="${labelX}" y="19.5" font-family="'SFMono-Regular', Consolas, 'Liberation Mono', monospace" font-size="13" font-weight="500" fill="${dark ? "#BAC7DD" : "#485975"}">${xml(label)}</text>
</svg>\n`;
    fs.writeFileSync(path.join(output, `${id}-${theme}.svg`), svg.replace(/[ \t]+\n/g, "\n"));
  }
}
console.log("Generated 12 tool badges in light and dark themes.");
