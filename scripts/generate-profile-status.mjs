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
  { id: "location", width: 112, title: "北京", color: "blue" },
  { id: "meituan", width: 238, title: "美团", detail: "Agent 算法工程实习生", color: "cyan", logo: logo("meituan") },
  { id: "education", width: 316, title: "华东师范大学 · 软件工程", detail: "已保研录取 · 2027 年入学", color: "violet", logo: logo("ecnu") },
];

for (const theme of ["light", "dark"]) {
  const dark = theme === "dark";
  const colors = palette(dark);
  for (const item of items) {
    const accent = colors[item.color];
    const icon = item.logo
      ? `<rect x="13" y="14" width="34" height="34" rx="10" fill="#FFFFFF" stroke="${colors.borderSubtle}"/><image x="17" y="18" width="26" height="26" href="data:image/png;base64,${item.logo}"/>`
      : `<rect x="13" y="14" width="34" height="34" rx="10" fill="${accent}" fill-opacity="0.1" stroke="${accent}" stroke-opacity="0.22"/><g transform="translate(18 19)" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></g>`;
    const description = item.detail ? `${item.title} · ${item.detail}` : item.title;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${item.width}" height="62" viewBox="0 0 ${item.width} 62" fill="none" role="img" aria-labelledby="title">
  <title id="title">${description}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${item.width}" y2="62" gradientUnits="userSpaceOnUse">
      <stop stop-color="${colors.background}"/>
      <stop offset="1" stop-color="${colors.surface}"/>
    </linearGradient>
  </defs>
  <rect x="0.75" y="0.75" width="${item.width - 1.5}" height="60.5" rx="14" fill="url(#bg)" stroke="${colors.border}" stroke-width="1.2"/>
  <rect x="1" y="16" width="3" height="30" rx="1.5" fill="${accent}" fill-opacity="0.75"/>
  ${icon}
  <text x="57" y="${item.detail ? 26 : 37}" font-family="${font}" font-size="${item.detail ? 15.5 : 16.5}" font-weight="650" fill="${colors.title}">${item.title}</text>
  ${item.detail ? `<text x="57" y="46.5" font-family="${font}" font-size="14" font-weight="500" fill="${colors.text}">${item.detail}</text>` : ""}
</svg>\n`;
    outputs.write(`assets/profile-status-${item.id}-${theme}.svg`, svg.replace(/[ \t]+\n/g, "\n"));
  }
}
outputs.finish();
console.log("Generated profile status badges in light and dark themes.");
