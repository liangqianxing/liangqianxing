import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const avatar = fs.readFileSync(path.join(assets, "avatar.png")).toString("base64");
const logos = Object.fromEntries(["ecnu", "xju", "meituan", "westlake"].map((id) => [
  id,
  fs.readFileSync(path.join(assets, "logos", `${id}.png`)).toString("base64"),
]));
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";
const mono = "'SFMono-Regular', Consolas, 'Liberation Mono', monospace";

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const palette = (dark) => dark ? {
  background: "#101827",
  tint: "#19223B",
  border: "#2B3A55",
  title: "#EEF3FF",
  text: "#BAC7DD",
  muted: "#98A9C3",
  blue: "#8DB1FF",
  violet: "#BCA6FF",
  cyan: "#77D7E6",
  pink: "#F0ACD1",
} : {
  background: "#FCFDFF",
  tint: "#F1F4FC",
  border: "#DEE5F2",
  title: "#202B46",
  text: "#485975",
  muted: "#657594",
  blue: "#456FC3",
  violet: "#7855BB",
  cyan: "#168295",
  pink: "#AD5088",
};

const text = (content, x, y, size, color, options = {}) => {
  const { weight = 400, spacing = 0, anchor = "start", family = font } = options;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}" fill="${color}">${escapeXml(content)}</text>`;
};

const shell = ({ width, height, theme, title, description = title, body, definitions = "" }) => {
  const colors = palette(theme === "dark");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse"><stop stop-color="${colors.background}"/><stop offset="1" stop-color="${colors.tint}"/></linearGradient>
    <linearGradient id="accent"><stop stop-color="${colors.blue}"/><stop offset="0.55" stop-color="${colors.violet}"/><stop offset="1" stop-color="${colors.cyan}"/></linearGradient>
    ${definitions}
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="22" fill="url(#background)" stroke="${colors.border}"/>
  ${body}
</svg>\n`.replace(/[ \t]+\n/g, "\n");
};

const chip = (label, x, y, width, color, size = 12) => `<rect x="${x}" y="${y}" width="${width}" height="29" rx="14.5" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-opacity="0.18"/>${text(label, x + width / 2, y + 19, size, color, { weight: 600, anchor: "middle" })}`;

const header = ({ theme, mobile }) => {
  const colors = palette(theme === "dark");
  const width = mobile ? 440 : 880;
  const height = mobile ? 266 : 288;
  const avatarSize = mobile ? 96 : 148;
  const avatarX = mobile ? 317 : 661;
  const avatarY = mobile ? 39 : 60;
  const centerX = avatarX + avatarSize / 2;
  const centerY = avatarY + avatarSize / 2;
  const margin = mobile ? 24 : 40;
  const badgeY = mobile ? 194 : 214;
  const illustration = `
    <circle cx="${centerX}" cy="${centerY}" r="${avatarSize * 0.63}" fill="${colors.violet}" fill-opacity="0.05"/>
    <circle cx="${centerX}" cy="${centerY}" r="${avatarSize * 0.64}" stroke="${colors.violet}" stroke-opacity="0.25" stroke-dasharray="3 7"/>
    <circle cx="${centerX}" cy="${centerY}" r="${avatarSize * 0.53}" fill="${colors.background}"/>
    <image x="${avatarX}" y="${avatarY}" width="${avatarSize}" height="${avatarSize}" href="data:image/png;base64,${avatar}"/>
    ${mobile ? "" : `
      <path d="M610 93h32M811 165h31M709 37v16" stroke="${colors.border}" stroke-width="1.5"/>
      <circle cx="608" cy="93" r="4" fill="${colors.cyan}"/>
      <circle cx="845" cy="165" r="4" fill="${colors.violet}"/>
      <circle cx="709" cy="34" r="4" fill="${colors.pink}"/>
      <rect x="624" y="231" width="222" height="28" rx="9" fill="${colors.background}" stroke="${colors.border}"/>
      ${text("plan  →  act  →  verify", 735, 250, 11.5, colors.muted, { anchor: "middle", family: mono })}
    `}`;
  const body = `
    <path d="M24 1h${width - 48}" stroke="url(#accent)" stroke-width="2" stroke-opacity="0.7"/>
    ${text("LIANGQIANXING / DEV & RESEARCH", margin, mobile ? 32 : 43, mobile ? 10.5 : 11, colors.muted, { weight: 600, spacing: mobile ? 0.7 : 1.5, family: mono })}
    ${text("Enhao Gu", margin - 2, mobile ? 91 : 115, mobile ? 41 : 60, colors.title, { weight: 750, spacing: -2 })}
    ${text("古恩豪", margin, mobile ? 125 : 151, mobile ? 17 : 20, colors.text, { weight: 600, spacing: 2 })}
    ${text("科研智能体、推理系统、开发者工具。", margin, mobile ? 172 : 185, mobile ? 14 : 15, colors.text)}
    ${chip("AI4Science", margin, badgeY, mobile ? 105 : 112, colors.blue)}
    ${chip("LLM Agents", margin + (mobile ? 115 : 124), badgeY, mobile ? 112 : 120, colors.violet)}
    ${chip("AI Infra", margin + (mobile ? 237 : 256), badgeY, 86, colors.cyan)}
    ${illustration}`;
  return shell({ width, height, theme, title: "古恩豪 · Enhao Gu", description: "AI4Science, LLM Agents and AI Infrastructure. Research agents, inference systems and developer tools.", body });
};

const glyphs = {
  document: '<path d="M13 8h19l9 9v27H13zM32 8v10h9M20 25h14M20 32h14M20 39h8"/>',
  figure: '<rect x="9" y="10" width="35" height="32" rx="5"/><path d="m14 35 10-11 7 7 5-5 8 9"/><circle cx="34" cy="19" r="3"/>',
  nodes: '<rect x="20" y="20" width="14" height="14" rx="4"/><circle cx="10" cy="10" r="4"/><circle cx="44" cy="10" r="4"/><circle cx="10" cy="44" r="4"/><circle cx="44" cy="44" r="4"/><path d="m13 13 8 8m12 0 8-8M13 41l8-8m12 0 8 8"/>',
  terminal: '<rect x="7" y="10" width="42" height="33" rx="7"/><path d="m17 21 6 6-6 6m12 0h10"/>',
  memory: '<rect x="15" y="15" width="24" height="24" rx="6"/><rect x="22" y="22" width="10" height="10" rx="2"/><path d="M21 8v7m12-7v7m-12 24v7m12-7v7M8 21h7M8 33h7m24-12h7m-7 12h7"/>',
  kernel: '<path d="m15 15-9 12 9 12m24-24 9 12-9 12M32 10 22 44"/>',
};

const icon = (kind, color, width) => `<g transform="translate(${width - 88} 24)" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.65">${glyphs[kind]}</g>`;

const research = [
  {
    id: "deepreviewer",
    name: "DeepReviewer 2.0",
    label: "COAUTHOR / ARXIV 2026",
    color: "blue",
    icon: "document",
    lines: ["可追踪、可审计的科研评审 Agent", "证据锚定 · 分阶段核验"],
    footer: "Scientific review agents",
  },
  {
    id: "autofigure",
    name: "AutoFigure-Edit",
    label: "COAUTHOR / ACL 2026 SYSTEM DEMO",
    color: "violet",
    icon: "figure",
    lines: ["参考风格引导的科研插图生成", "可编辑图形 · 科研表达"],
    footer: "Editable scientific illustrations",
  },
];

const projects = [
  {
    id: "deepscientist",
    name: "DeepScientist",
    label: "RESEARCH AGENT / CONTRIBUTOR",
    color: "blue",
    icon: "nodes",
    lines: ["科研智能体平台 · Copilot / Autonomous", "MCP 工具接入与 Agent 运行轨迹"],
    footer: "AI4Science · Agent Systems",
  },
  {
    id: "minicode",
    name: "MiniCode",
    label: "CODING AGENT / CORE CONTRIBUTOR",
    color: "violet",
    icon: "terminal",
    lines: ["轻量级终端 AI 编程助手", "ReAct · 工具权限 · MCP / Skills"],
    footer: "TypeScript · Agentic Coding",
  },
  {
    id: "agentmem",
    name: "AgentMem",
    label: "MEMORY / PERSONAL PROJECT",
    color: "cyan",
    icon: "memory",
    lines: ["面向 LLM Agent 的推理内存管理", "KV Cache · CoW 分支 · 上下文压缩"],
    footer: "Python · Inference Systems",
  },
  {
    id: "kernels",
    name: "Fast LLM Kernels",
    label: "INFERENCE / PERSONAL PROJECT",
    color: "pink",
    icon: "kernel",
    lines: ["RMSNorm 与 residual-add 融合算子", "数值验证、基准测试与性能分析"],
    footer: "CUDA · PyTorch · Profiling",
  },
  {
    id: "figurelab",
    name: "ML Figure Lab",
    label: "RESEARCH TOOLS / SCIENTIFIC FIGURES",
    color: "blue",
    icon: "figure",
    lines: ["面向机器学习研究者的中文绘图教程", "实验图表、论文架构图与可复用绘图方法"],
    footer: "Scientific Figures · VitePress",
  },
  {
    id: "nova",
    name: "Hexo Theme Nova",
    label: "ACADEMIC HOMEPAGE / BLOG",
    color: "violet",
    icon: "document",
    lines: ["融合学术主页与博客的 Hexo 主题", "深浅色模式、文章目录与响应式布局"],
    footer: "Hexo · Academic Homepage · Web Design",
  },
];

const card = ({ item, theme, mobile }) => {
  const colors = palette(theme === "dark");
  const width = mobile ? 360 : 440;
  const accent = colors[item.color];
  const body = `
    ${text(item.label, 24, 33, 10.5, accent, { weight: 600, spacing: 0.5, family: mono })}
    ${text(item.name, 23, 72, mobile ? 22 : 24, colors.title, { weight: 700, spacing: -0.4 })}
    ${icon(item.icon, accent, width)}
    ${item.lines.map((line, index) => text(line, 24, 105 + index * 23, 14, colors.text)).join("\n")}
    <path d="M24 151h${width - 48}" stroke="${colors.border}"/>
    <circle cx="28" cy="173" r="3" fill="${accent}"/>
    ${text(item.footer, 40, 177, 11.5, colors.muted, { weight: 500 })}
    ${text("↗", width - 25, 179, 20, accent, { anchor: "end" })}`;
  return shell({ width, height: 198, theme, title: item.name, description: `${item.label}. ${item.lines.join("。")}`, body });
};

const experiences = [
  {
    school: "华东师范大学",
    logo: "ecnu",
    date: "2027 - 2030",
    color: "violet",
    detail: "软件工程 · 已保研录取（2027 年入学）",
    mobile: ["软件工程 · 已保研录取", "2027 年入学 · 硕士阶段"],
  },
  {
    school: "新疆大学",
    logo: "xju",
    date: "2023 - 2027",
    color: "blue",
    detail: "软件工程 · 本科在读 · 曾于中南大学交换学习",
    mobile: ["软件工程 · 本科在读", "曾于中南大学交换学习"],
  },
  {
    school: "美团",
    logo: "meituan",
    date: "2026.06 - PRESENT",
    color: "cyan",
    detail: "开发实习生 · Agent 任务编排、沙箱与工具调用",
    mobile: ["开发实习生", "Agent 任务编排、沙箱与工具调用"],
  },
  {
    school: "西湖大学",
    logo: "westlake",
    date: "2025.12 - 2026.03",
    color: "violet",
    detail: "NLP 实验室访问学生 · 科研智能体研发",
    mobile: ["NLP 实验室访问学生", "科研智能体研发"],
  },
];

const journey = ({ theme, mobile }) => {
  const colors = palette(theme === "dark");
  const width = mobile ? 440 : 880;
  const rowHeight = mobile ? 84 : 64;
  const height = experiences.length * rowHeight + 20;
  const body = experiences.map((experience, index) => {
    const baseline = (mobile ? 34 : 40) + index * rowHeight;
    const titleX = mobile ? 78 : 84;
    const logoX = mobile ? 20 : 24;
    const logoY = baseline - 20;
    return `
      <rect x="${logoX}" y="${logoY}" width="42" height="42" rx="11" fill="#FFFFFF" stroke="${colors.border}"/>
      <image x="${logoX + 5}" y="${logoY + 5}" width="32" height="32" href="data:image/png;base64,${logos[experience.logo]}" aria-hidden="true"/>
      ${text(experience.school, titleX, baseline, mobile ? 18 : 19, colors.title, { weight: 650 })}
      ${text(experience.date, width - 24, baseline - 1, mobile ? 11 : 12, colors.muted, { family: mono, anchor: "end" })}
      ${mobile ? experience.mobile.map((line, lineIndex) => text(line, titleX, baseline + 23 + lineIndex * 19, 13, colors.text)).join("\n") : text(experience.detail, titleX, baseline + 24, 14, colors.text)}
      ${index < experiences.length - 1 ? `<path d="M${titleX} ${baseline + (mobile ? 57 : 42)}h${width - titleX - 24}" stroke="${colors.border}"/>` : ""}`;
  }).join("\n");
  return shell({ width, height, theme, title: "教育与经历", description: experiences.map((experience) => `${experience.school}：${experience.detail}，${experience.date}`).join("；"), body });
};

const journeyImages = new Map();
for (const theme of ["light", "dark"]) {
  for (const mobile of [false, true]) {
    const suffix = `${mobile ? "mobile-" : ""}${theme}`;
    fs.writeFileSync(path.join(assets, `profile-header-${suffix}.svg`), header({ theme, mobile }));
    const journeySvg = journey({ theme, mobile });
    const version = createHash("sha256").update(journeySvg).digest("hex").slice(0, 10);
    const journeyFile = `journey-${suffix}-${version}.svg`;
    fs.writeFileSync(path.join(assets, journeyFile), journeySvg);
    journeyImages.set(suffix, journeyFile);
    for (const item of research) {
      fs.writeFileSync(path.join(assets, `research-${item.id}-${suffix}.svg`), card({ item, theme, mobile }));
    }
    for (const item of projects) {
      fs.writeFileSync(path.join(assets, `project-${item.id}-${suffix}.svg`), card({ item, theme, mobile }));
    }
  }
}

const readmePath = path.join(root, "README.md");
const readme = fs.readFileSync(readmePath, "utf8");
fs.writeFileSync(readmePath, readme.replace(
  /assets\/journey-((?:mobile-)?(?:light|dark))(?:-[a-f0-9]{10})?\.svg/g,
  (_, suffix) => `assets/${journeyImages.get(suffix)}`,
));
const activeJourneyFiles = new Set(journeyImages.values());
for (const filename of fs.readdirSync(assets)) {
  if (/^journey-(?:mobile-)?(?:light|dark)(?:-[a-f0-9]{10})?\.svg$/.test(filename) && !activeJourneyFiles.has(filename)) {
    fs.unlinkSync(path.join(assets, filename));
  }
}

console.log(`Generated profile layout: 4 headers, 4 timelines, ${(research.length + projects.length) * 4} research/project cards.`);
