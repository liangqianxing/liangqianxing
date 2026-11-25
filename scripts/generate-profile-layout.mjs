import fs from "node:fs";
import path from "node:path";
import { palette, versionedAssets } from "./profile-style.mjs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "assets");
const artwork = Object.fromEntries(["light", "dark"].map((theme) => [theme, fs.readFileSync(path.join(assets, `profile-art-${theme}.webp`)).toString("base64")]));
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

const text = (content, x, y, size, color, options = {}) => {
  const { weight = 400, spacing = 0, anchor = "start", family = font } = options;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}" fill="${color}">${escapeXml(content)}</text>`;
};

const shell = ({ width, height, theme, title, description = title, body, definitions = "", spaceBelow = 0, grid = false }) => {
  const dark = theme === "dark";
  const colors = palette(dark);
  const gridPattern = grid ? `
    <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="0.9" fill="${colors.grid}" opacity="${colors.gridOpacity}"/>
    </pattern>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + spaceBelow}" viewBox="0 0 ${width} ${height + spaceBelow}" fill="none" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${colors.background}"/>
      <stop offset="1" stop-color="${colors.surface}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${colors.blue}"/>
      <stop offset="0.55" stop-color="${colors.violet}"/>
      <stop offset="1" stop-color="${colors.cyan}"/>
    </linearGradient>
    <clipPath id="shell-clip"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18"/></clipPath>
    ${gridPattern}
    ${definitions}
  </defs>
  <g clip-path="url(#shell-clip)">
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#background)"/>
    ${grid ? `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#dot-grid)"/>` : ""}
    ${body}
  </g>
  <rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 1.5}" rx="18" stroke="${colors.border}" stroke-width="1.2"/>
  <path d="M20 1.35h${width - 40}" stroke="${dark ? "#FFFFFF" : "#FFFFFF"}" stroke-opacity="${dark ? "0.08" : "0.7"}" stroke-width="1"/>
</svg>\n`.replace(/[ \t]+\n/g, "\n");
};

const chip = (label, x, y, width, color, size = 12) => `
  <rect x="${x}" y="${y}" width="${width}" height="30" rx="15" fill="${color}" fill-opacity="0.09" stroke="${color}" stroke-opacity="0.24" stroke-width="1"/>
  <circle cx="${x + 13}" cy="${y + 15}" r="2.6" fill="${color}"/>
  ${text(label, x + 23, y + 19.5, size, color, { weight: 600 })}`;

const header = ({ theme, mobile }) => {
  const dark = theme === "dark";
  const colors = palette(dark);
  const width = mobile ? 440 : 880;
  const height = mobile ? 290 : 316;
  const margin = mobile ? 24 : 42;
  const imageX = mobile ? 250 : 444;
  const imageY = mobile ? 36 : 8;
  const imageWidth = mobile ? 186 : 428;
  const imageHeight = mobile ? 182 : 300;
  const chipY = mobile ? 236 : 244;
  const body = `
    <rect width="${width}" height="${height}" fill="${dark ? "#0D1524" : "#F8F9FB"}"/>
    <rect width="${width}" height="${height}" fill="url(#dot-grid)"/>
    <ellipse cx="${mobile ? 90 : 170}" cy="${mobile ? 60 : 80}" rx="${mobile ? 180 : 280}" ry="${mobile ? 120 : 170}" fill="url(#hero-glow)"/>
    <image x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${artwork[theme]}" mask="url(#art-fade)"/>
    <rect x="${margin}" y="${mobile ? 32 : 38}" width="24" height="3.5" rx="1.75" fill="url(#accent)"/>
    ${text("LIANGQIANXING / DEV & RESEARCH", margin + 34, mobile ? 38 : 44, mobile ? 10.5 : 11, colors.muted, { weight: 600, spacing: mobile ? 0.5 : 1.1, family: mono })}
    ${text("Enhao Gu", margin - 2, mobile ? 104 : 126, mobile ? 44 : 62, colors.title, { weight: 800, spacing: -2.2 })}
    ${text("古恩豪", margin, mobile ? 140 : 164, mobile ? 18 : 21, colors.text, { weight: 600, spacing: 2.5 })}
    <path d="M${margin} ${mobile ? 158 : 182}h${mobile ? 140 : 210}" stroke="${colors.border}" stroke-opacity="0.7"/>
    ${text("科研智能体 · 推理系统 · 开发者工具", margin, mobile ? 186 : 210, mobile ? 14.5 : 16, colors.text, { weight: 500 })}
    ${chip("AI4Science", margin, chipY, 114, colors.blue, 12.2)}
    ${chip("LLM Agents", margin + 122, chipY, 118, colors.violet, 12.2)}
    ${chip("AI Infra", margin + 248, chipY, 96, colors.blue, 12.2)}`;
  const definitions = `
    <radialGradient id="hero-glow" cx="0.5" cy="0.5" r="0.5">
      <stop stop-color="${colors.blue}" stop-opacity="${colors.glowOpacity}"/>
      <stop offset="1" stop-color="${colors.blue}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="art-opacity">
      <stop stop-color="#000000"/>
      <stop offset="${mobile ? "0.22" : "0.15"}" stop-color="#FFFFFF"/>
      <stop offset="0.88" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="art-vertical" x2="0" y2="1">
      <stop stop-color="#000000"/>
      <stop offset="0.09" stop-color="#FFFFFF"/>
      <stop offset="0.86" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#000000"/>
    </linearGradient>
    <mask id="vertical-fade"><rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" fill="url(#art-vertical)"/></mask>
    <mask id="art-fade"><rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" fill="url(#art-opacity)" mask="url(#vertical-fade)"/></mask>`;
  return shell({ width, height, theme, title: "古恩豪 · Enhao Gu", description: "AI4Science, LLM Agents and AI Infrastructure. Research agents, inference systems and developer tools.", body, definitions, grid: true });
};

const glyphs = {
  document: '<path d="M13 8h19l9 9v27H13zM32 8v10h9M20 25h14M20 32h14M20 39h8"/>',
  figure: '<rect x="9" y="10" width="35" height="32" rx="5"/><path d="m14 35 10-11 7 7 5-5 8 9"/><circle cx="34" cy="19" r="3"/>',
  nodes: '<rect x="20" y="20" width="14" height="14" rx="4"/><circle cx="10" cy="10" r="4"/><circle cx="44" cy="10" r="4"/><circle cx="10" cy="44" r="4"/><circle cx="44" cy="44" r="4"/><path d="m13 13 8 8m12 0 8-8M13 41l8-8m12 0 8 8"/>',
  terminal: '<rect x="7" y="10" width="42" height="33" rx="7"/><path d="m17 21 6 6-6 6m12 0h10"/>',
  memory: '<rect x="15" y="15" width="24" height="24" rx="6"/><rect x="22" y="22" width="10" height="10" rx="2"/><path d="M21 8v7m12-7v7m-12 24v7m12-7v7M8 21h7M8 33h7m24-12h7m-7 12h7"/>',
  kernel: '<path d="m15 15-9 12 9 12m24-24 9 12-9 12M32 10 22 44"/>',
};

const iconBadge = (kind, color, width) => `
  <rect x="${width - 78}" y="22" width="52" height="52" rx="14" fill="${color}" fill-opacity="0.09" stroke="${color}" stroke-opacity="0.2"/>
  <g transform="translate(${width - 70} 30) scale(0.66)" stroke="${color}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">${glyphs[kind]}</g>`;

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
  const dark = theme === "dark";
  const colors = palette(dark);
  const width = mobile ? 360 : 440;
  const height = mobile ? 224 : 214;
  const accent = colors[item.color];
  const labelY = mobile ? 72 : 38;
  const titleY = mobile ? 42 : 78;
  const lineY = mobile ? 112 : 118;
  const ruleY = mobile ? 172 : 162;
  const footerY = mobile ? 199 : 189;
  const definitions = `
    <radialGradient id="card-glow" cx="0.88" cy="0.14" r="0.58">
      <stop stop-color="${accent}" stop-opacity="${dark ? "0.16" : "0.09"}"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="top-bar" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="0.7" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>`;
  const body = `
    <rect width="${width}" height="${height}" fill="url(#card-glow)"/>
    <rect x="24" y="0" width="${width - 48}" height="3" rx="1.5" fill="url(#top-bar)"/>
    ${text(item.label, 24, labelY, mobile ? 11 : 10.5, accent, { weight: 650, spacing: 0.4, family: mono })}
    ${text(item.name, 23, titleY, mobile ? 24 : 26.5, colors.title, { weight: 750, spacing: -0.6 })}
    ${mobile ? "" : iconBadge(item.icon, accent, width)}
    ${item.lines.map((line, index) => text(line, 24, lineY + index * (mobile ? 26 : 24), mobile ? 15.5 : 15, colors.text, { weight: 450 })).join("\n")}
    <path d="M24 ${ruleY}h${width - 48}" stroke="${colors.borderSubtle}"/>
    <circle cx="29" cy="${footerY - 4}" r="3.2" fill="${accent}"/>
    ${text(item.footer, 41, footerY, mobile ? 12.5 : 12, colors.muted, { weight: 550 })}
    <rect x="${width - 52}" y="${footerY - 17}" width="28" height="24" rx="8" fill="${accent}" fill-opacity="0.1"/>
    ${text("↗", width - 38, footerY, 15, accent, { anchor: "middle", weight: 700 })}`;
  return shell({ width, height, theme, title: item.name, description: `${item.label}. ${item.lines.join("。")}`, body, definitions, spaceBelow: mobile ? 10 : 0 });
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
    detail: "Agent 算法工程实习生 · 海外酒旅业务研发平台",
    mobile: ["Agent 算法工程实习生", "海外酒旅业务研发平台"],
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
  const dark = theme === "dark";
  const colors = palette(dark);
  const width = mobile ? 440 : 880;
  const rowHeight = mobile ? 96 : 74;
  const height = experiences.length * rowHeight + 24;
  const railX = mobile ? 41 : 45;
  const firstY = (mobile ? 36 : 42) + 2;
  const lastY = firstY + (experiences.length - 1) * rowHeight;
  const rail = `<path d="M${railX} ${firstY}V${lastY}" stroke="${colors.border}" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  const body = `
    ${rail}
    ${experiences.map((experience, index) => {
      const baseline = (mobile ? 36 : 42) + index * rowHeight;
      const titleX = mobile ? 80 : 86;
      const logoX = mobile ? 20 : 24;
      const logoY = baseline - 20;
      const accent = colors[experience.color];
      const badgeW = mobile ? 128 : 154;
      const badgeX = width - 24 - badgeW;
      return `
        <rect x="${logoX}" y="${logoY}" width="42" height="42" rx="12" fill="#FFFFFF" stroke="${colors.border}" stroke-width="1.2"/>
        <image x="${logoX + 5}" y="${logoY + 5}" width="32" height="32" href="data:image/png;base64,${logos[experience.logo]}" aria-hidden="true"/>
        <circle cx="${logoX + 41}" cy="${logoY + 4}" r="3.5" fill="${accent}" stroke="${colors.background}" stroke-width="1.5"/>
        ${text(experience.school, titleX, baseline, mobile ? 18 : 19, colors.title, { weight: 700 })}
        <rect x="${badgeX}" y="${baseline - 15}" width="${badgeW}" height="22" rx="11" fill="${colors.tint}" stroke="${colors.borderSubtle}"/>
        ${text(experience.date, badgeX + badgeW / 2, baseline - 0.5, mobile ? 10.5 : 11.5, colors.muted, { family: mono, anchor: "middle", weight: 550 })}
        ${mobile ? experience.mobile.map((line, lineIndex) => text(line, titleX, baseline + 25 + lineIndex * 21, 15, colors.text)).join("\n") : text(experience.detail, titleX, baseline + 25, 14.8, colors.text)}
        ${index < experiences.length - 1 ? `<path d="M${titleX} ${baseline + (mobile ? 66 : 48)}h${width - titleX - 24}" stroke="${colors.borderSubtle}"/>` : ""}`;
    }).join("\n")}`;
  return shell({ width, height, theme, title: "教育与经历", description: experiences.map((experience) => `${experience.school}：${experience.detail}，${experience.date}`).join("；"), body });
};

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const visibleProjects = projects.filter((item) => readme.includes(`assets/project-${item.id}-`));
const outputs = versionedAssets(root);
for (const theme of ["light", "dark"]) {
  for (const mobile of [false, true]) {
    const suffix = `${mobile ? "mobile-" : ""}${theme}`;
    outputs.write(`assets/profile-header-${suffix}.svg`, header({ theme, mobile }));
    outputs.write(`assets/journey-${suffix}.svg`, journey({ theme, mobile }));
    for (const item of research) {
      outputs.write(`assets/research-${item.id}-${suffix}.svg`, card({ item, theme, mobile }));
    }
    for (const item of visibleProjects) {
      outputs.write(`assets/project-${item.id}-${suffix}.svg`, card({ item, theme, mobile }));
    }
  }
}
outputs.finish();
console.log(`Generated profile layout: 4 headers, 4 timelines, ${(research.length + visibleProjects.length) * 4} existing research/project cards.`);
