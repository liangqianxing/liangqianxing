import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { palette, versionedAssets } from "./profile-style.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const outputs = versionedAssets(root);
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";
const logo = (id) => fs.readFileSync(path.join(assets, "logos", `${id}.png`)).toString("base64");
const items = [
  { id: "location", width: 108, title: "北京", color: "blue" },
  { id: "meituan", width: 172, title: "美团", detail: "开发实习生", color: "cyan", logo: logo("meituan") },
  { id: "education", width: 308, title: "华东师范大学 · 软件工程", detail: "已保研录取 · 2027 年入学", color: "violet", logo: logo("ecnu") },
];

for (const theme of ["light", "dark"]) {
  const dark = theme === "dark";
  const colors = palette(dark);
  for (const item of items) {
    const accent = colors[item.color];
    const icon = item.logo
      ? `<rect x="12" y="14" width="32" height="32" rx="9" fill="#FFFFFF"/><image x="15" y="17" width="26" height="26" href="data:image/png;base64,${item.logo}"/>`
      : `<g transform="translate(15 18)" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></g>`;
    const description = item.detail ? `${item.title} · ${item.detail}` : item.title;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${item.width}" height="60" viewBox="0 0 ${item.width} 60" fill="none" role="img" aria-labelledby="title">
  <title id="title">${description}</title>
  <rect x="0.5" y="0.5" width="${item.width - 1}" height="59" rx="13" fill="${colors.background}" stroke="${colors.border}"/>
  ${icon}
  <text x="54" y="${item.detail ? 25 : 36}" font-family="${font}" font-size="${item.detail ? 16 : 17}" font-weight="650" fill="${colors.title}">${item.title}</text>
  ${item.detail ? `<text x="54" y="46" font-family="${font}" font-size="15" font-weight="500" fill="${colors.text}">${item.detail}</text>` : ""}
</svg>\n`;
    outputs.write(`assets/profile-status-${item.id}-${theme}.svg`, svg.replace(/[ \t]+\n/g, "\n"));
  }
}
outputs.finish();
console.log("Generated profile status badges in light and dark themes.");
