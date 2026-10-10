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

const shell = ({ width, height, theme, title, description = title, body, definitions = "", spaceBelow = 0 }) => {
  const colors = palette(theme === "dark");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + spaceBelow}" viewBox="0 0 ${width} ${height + spaceBelow}" fill="none" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse"><stop stop-color="${colors.background}"/><stop offset="1" stop-color="${colors.tint}"/></linearGradient>
    <linearGradient id="accent"><stop stop-color="${colors.blue}"/><stop offset="0.55" stop-color="${colors.violet}"/><stop offset="1" stop-color="${colors.cyan}"/></linearGradient>
    ${definitions}
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="${colors.background}" stroke="${colors.border}"/>
  ${body}
</svg>\n`.replace(/[ \t]+\n/g, "\n");
};

const chip = (label, x, y, width, color, size = 12) => `<rect x="${x}" y="${y}" width="${width}" height="29" rx="14.5" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-opacity="0.18"/>${text(label, x + width / 2, y + 19, size, color, { weight: 600, anchor: "middle" })}`;

const header = ({ theme, mobile }) => {
  const colors = palette(theme === "dark");
  const width = mobile ? 440 : 880;
  const height = mobile ? 280 : 306;
  const margin = mobile ? 24 : 40;
  const imageX = mobile ? 255 : 440;
  const imageY = mobile ? 38 : 8;
  const imageWidth = mobile ? 180 : 432;
  const imageHeight = mobile ? 174 : 290;
  const body = `
    <g clip-path="url(#header-clip)">
      <rect width="${width}" height="${height}" fill="${theme === "dark" ? "#121C2B" : "#F7F6F3"}"/>
      <image x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${artwork[theme]}" mask="url(#art-fade)"/>
      <path d="M${margin} ${mobile ? 40 : 46}h20" stroke="${colors.cyan}" stroke-width="3" stroke-linecap="round"/>
      ${text("LIANGQIANXING / DEV & RESEARCH", margin + 30, mobile ? 44 : 50, mobile ? 10.5 : 11, colors.muted, { weight: 600, spacing: mobile ? 0.4 : 0.8, family: mono })}
      ${text("Enhao Gu", margin - 2, mobile ? 108 : 129, mobile ? 43 : 62, colors.title, { weight: 750, spacing: -2 })}
      ${text("古恩豪", margin, mobile ? 143 : 166, mobile ? 18 : 20, colors.text, { weight: 600, spacing: 2 })}
      ${text("科研智能体、推理系统、开发者工具。", margin, 205, 16, colors.text)}
      ${chip("AI4Science", margin, mobile ? 226 : 236, 108, colors.blue, 12.5)}
      ${chip("LLM Agents", margin + 118, mobile ? 226 : 236, 114, colors.violet, 12.5)}
      ${chip("AI Infra", margin + 242, mobile ? 226 : 236, 88, colors.blue, 12.5)}
    </g>`;
  const definitions = `
    <clipPath id="header-clip"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18"/></clipPath>
    <linearGradient id="art-opacity"><stop stop-color="#000000"/><stop offset="${mobile ? "0.2" : "0.12"}" stop-color="#FFFFFF"/><stop offset="0.88" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
    <linearGradient id="art-vertical" x2="0" y2="1"><stop stop-color="#000000"/><stop offset="0.09" stop-color="#FFFFFF"/><stop offset="0.86" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
    <mask id="vertical-fade"><rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" fill="url(#art-vertical)"/></mask>
    <mask id="art-fade"><rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" fill="url(#art-opacity)" mask="url(#vertical-fade)"/></mask>`;
  return shell({ width, height, theme, title: "古恩豪 · Enhao Gu", description: "AI4Science, LLM Agents and AI Infrastructure. Research agents, inference systems and developer tools.", body, definitions });
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
  const height = mobile ? 222 : 210;
  const accent = colors[item.color];
  const labelY = mobile ? 70 : 38;
  const titleY = mobile ? 41 : 78;
  const lineY = mobile ? 111 : 117;
  const ruleY = mobile ? 172 : 160;
  const footerY = mobile ? 199 : 186;
  const body = `
    <path d="M24 1h${width - 48}" stroke="${accent}" stroke-width="2" stroke-opacity="0.55"/>
    ${text(item.label, 24, labelY, mobile ? 11.5 : 10.8, accent, { weight: 600, spacing: 0.1, family: mono })}
    ${text(item.name, 23, titleY, mobile ? 24 : 27, colors.title, { weight: 700, spacing: -0.5 })}
    ${mobile ? "" : icon(item.icon, accent, width)}
    ${item.lines.map((line, index) => text(line, 24, lineY + index * (mobile ? 27 : 24), mobile ? 16 : 15.5, colors.text)).join("\n")}
    <path d="M24 ${ruleY}h${width - 48}" stroke="${colors.border}"/>
    <circle cx="28" cy="${footerY - 4}" r="3" fill="${accent}"/>
    ${text(item.footer, 40, footerY, mobile ? 12.5 : 12, colors.muted, { weight: 500 })}
    ${text("↗", width - 24, footerY + 2, 20, accent, { anchor: "end" })}`;
  return shell({ width, height, theme, title: item.name, description: `${item.label}. ${item.lines.join("。")}`, body, spaceBelow: mobile ? 10 : 0 });
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
  const rowHeight = mobile ? 94 : 72;
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
      ${text(experience.date, width - 24, baseline - 1, mobile ? 12 : 12.5, colors.muted, { family: mono, anchor: "end" })}
      ${mobile ? experience.mobile.map((line, lineIndex) => text(line, titleX, baseline + 25 + lineIndex * 21, 15.5, colors.text)).join("\n") : text(experience.detail, titleX, baseline + 25, 15, colors.text)}
      ${index < experiences.length - 1 ? `<path d="M${titleX} ${baseline + (mobile ? 64 : 47)}h${width - titleX - 24}" stroke="${colors.border}"/>` : ""}`;
  }).join("\n");
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
