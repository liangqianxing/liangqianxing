import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { palette, versionedAssets } from "./profile-style.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const outputs = versionedAssets(root);
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";
const logo = fs.readFileSync(path.join(assets, "logos", "icpc.svg"), "utf8")
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<title[^>]*>[\s\S]*?<\/title>/, "")
  .replace(/<\/svg>\s*$/, "").trim();
const description = "ACM-ICPC：亚洲区域赛铜牌、全国邀请赛银牌、新疆自治区赛金牌；CCPC：全国邀请赛银牌。";
const awards = [
  { contest: "ACM-ICPC", event: "亚洲区域赛", rank: "铜牌", metal: "bronze" },
  { contest: "ACM-ICPC", event: "全国邀请赛", rank: "银牌", metal: "silver" },
  { contest: "ACM-ICPC", event: "新疆自治区赛", rank: "金牌", metal: "gold" },
  { contest: "CCPC", event: "全国邀请赛", rank: "银牌", metal: "silver" },
];
const metals = {
  bronze: { fill: "#C88D60", light: "#975E31", dark: "#E3AE86" },
  silver: { fill: "#9BADBF", light: "#61748E", dark: "#B8CAE1" },
  gold: { fill: "#E7B844", light: "#946B10", dark: "#F4CA69" },
};
const text = (label, x, y, size, color, weight = 500) => `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}">${label}</text>`;
const medal = (x, y, metal, colors) => `<g transform="translate(${x} ${y})" aria-hidden="true">
  <path d="M5 1h9l9 18-9 5Z" fill="${colors.blue}"/>
  <path d="M19 1h9L19 24l-9-5Z" fill="${colors.ribbon}"/>
  <circle cx="16.5" cy="27" r="13" fill="${metal.fill}"/>
  <circle cx="16.5" cy="27" r="9.5" stroke="#FFFFFF" stroke-opacity="0.6"/>
  <path d="m16.5 21 1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#FFFFFF" fill-opacity="0.85"/>
</g>`;

const render = (theme, mobile) => {
  const dark = theme === "dark";
  const colors = { ...palette(dark), ribbon: dark ? "#527AAE" : "#9FBEED" };
  const width = mobile ? 440 : 880;
  const height = mobile ? 400 : 188;
  const blocks = awards.map((award, index) => {
    const x = mobile ? 20 : 20 + index * 214;
    const y = mobile ? (index < 3 ? 70 + index * 66 : 324) : 70;
    const blockWidth = mobile ? 400 : 196;
    const blockHeight = mobile ? 56 : 98;
    const metal = metals[award.metal];
    const body = mobile
      ? `${medal(x + 14, y + 8, metal, colors)}
        ${text(award.event, x + 64, y + 35, 18, colors.text, 600)}
        <rect x="${x + blockWidth - 82}" y="${y + 14}" width="66" height="28" rx="14" fill="${metal.fill}" fill-opacity="0.13"/>
        ${text(award.rank, x + blockWidth - 66, y + 34, 17, metal[theme], 650)}`
      : `${medal(x + 14, y + 26, metal, colors)}
        ${text(award.event, x + 62, y + 39, 16, colors.text, 600)}
        ${text(award.rank, x + 62, y + 69, 22, metal[theme], 700)}`;
    return `<g role="group" aria-label="${award.contest} ${award.event}${award.rank}">
      <rect x="${x}" y="${y}" width="${blockWidth}" height="${blockHeight}" rx="13" fill="${colors.tint}"/>
      ${body}
    </g>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-labelledby="title description">
  <title id="title">竞赛荣誉</title>
  <desc id="description">${description}</desc>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="20" fill="${colors.background}" stroke="${colors.border}"/>
  <svg x="20" y="14" width="64" height="38" viewBox="76 88 930 544" aria-hidden="true">${logo}</svg>
  ${text("ACM-ICPC", 96, 43, 22, colors.title, 700)}
  ${text("CCPC", mobile ? 20 : 662, mobile ? 308 : 43, 22, colors.title, 700)}
  ${mobile ? `<path d="M20 278h400" stroke="${colors.border}"/>` : `<path d="M653 24v140" stroke="${colors.border}"/>`}
  ${blocks}
</svg>\n`.replace(/[ \t]+\n/g, "\n");
};

for (const theme of ["light", "dark"]) {
  for (const mobile of [false, true]) {
    const suffix = `${mobile ? "mobile-" : ""}${theme}`;
    const svg = render(theme, mobile);
    outputs.write(`assets/competition-honors-${suffix}.svg`, svg);
  }
}
outputs.finish();
console.log("Generated competition honors for desktop/mobile and light/dark themes.");
