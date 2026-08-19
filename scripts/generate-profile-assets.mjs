import fs from "node:fs";
import path from "node:path";

const owner = process.env.GITHUB_REPOSITORY_OWNER || "liangqianxing";
const token = process.env.GITHUB_TOKEN || "";
const apiHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "liangqianxing-profile-assets",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const api = async (pathname) => {
  const res = await fetch(`https://api.github.com${pathname}`, { headers: apiHeaders });
  if (!res.ok) {
    throw new Error(`${pathname}: HTTP ${res.status}`);
  }
  return res.json();
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const palette = (dark) =>
  dark
    ? {
        bg0: "#0B1220",
        bg1: "#0F172A",
        card: "rgba(30, 41, 59, 0.55)",
        border: "#1E293B",
        title: "#F8FAFC",
        text: "#CBD5E1",
        dim: "#64748B",
        glow: "0.20",
      }
    : {
        bg0: "#FFFFFF",
        bg1: "#F8FAFC",
        card: "rgba(226, 232, 240, 0.42)",
        border: "#E2E8F0",
        title: "#0F172A",
        text: "#334155",
        dim: "#94A3B8",
        glow: "0.12",
      };

const acc = {
  cyan: "#38BDF8",
  violet: "#A78BFA",
  pink: "#F472B6",
  green: "#34D399",
  amber: "#FBBF24",
};

const langColors = {
  Python: "#3776AB",
  C: "#555555",
  "C++": "#F34B7D",
  CSS: "#663399",
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Vue: "#41B883",
  EJS: "#A91E50",
  HTML: "#E34C26",
  "Jupyter Notebook": "#DA5B0B",
};

const widthOf = (text, size) => {
  let width = 0;
  for (const ch of String(text)) {
    width += ch.charCodeAt(0) > 0xff ? size : size * 0.58;
  }
  return width;
};

const truncateToWidth = (text, maxWidth, size) => {
  let result = "";
  let width = 0;
  for (const ch of String(text)) {
    const cw = ch.charCodeAt(0) > 0xff ? size : size * 0.58;
    if (width + cw > maxWidth) break;
    result += ch;
    width += cw;
  }
  return result;
};

const wrapText = (text, maxWidth, size, maxLines = 2) => {
  const source = String(text).replace(/\s+/g, " ").trim();
  const lines = [];
  let line = "";
  const limit = maxWidth + size;
  for (const ch of source) {
    if (widthOf(line + ch, size) > limit) {
      lines.push(line);
      line = ch;
      if (lines.length === maxLines) break;
    } else {
      line += ch;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (source.length > lines.join("").length) {
      lines[maxLines - 1] = `${truncateToWidth(last, maxWidth - size, size)}…`;
    }
  }
  return lines.slice(0, maxLines);
};

const defs = ({ dark }) => {
  const p = palette(dark);
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg0}"/>
      <stop offset="1" stop-color="${p.bg1}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${acc.cyan}"/>
      <stop offset="0.55" stop-color="${acc.violet}"/>
      <stop offset="1" stop-color="${acc.pink}"/>
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${acc.cyan}" stop-opacity="${dark ? 0.75 : 0.55}"/>
      <stop offset="0.55" stop-color="${acc.violet}" stop-opacity="${dark ? 0.55 : 0.40}"/>
      <stop offset="1" stop-color="${acc.pink}" stop-opacity="${dark ? 0.75 : 0.55}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(0.82 0.08) rotate(125) scale(1.2)">
      <stop offset="0" stop-color="${acc.cyan}" stop-opacity="${p.glow}"/>
      <stop offset="0.5" stop-color="${acc.violet}" stop-opacity="${p.glow * 0.65}"/>
      <stop offset="1" stop-color="${acc.pink}" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
};

const shell = ({ width, height, dark, body }) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
  ${defs({ dark })}
  <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="url(#bg)"/>
  <rect x="1.25" y="1.25" width="${width - 2.5}" height="${height - 2.5}" rx="18.75" fill="none" stroke="url(#border)" stroke-width="1.5"/>
  <ellipse cx="${width * 0.82}" cy="${height * 0.10}" rx="${width * 0.34}" ry="${height * 0.55}" fill="url(#glow)" opacity="${dark ? 0.9 : 0.8}"/>
  ${body}
</svg>`.trim();

const titleBlock = (title, subtitle, dark) => {
  const p = palette(dark);
  return `
  <rect x="20" y="18" width="4" height="26" rx="2" fill="url(#accent)"/>
  <text x="34" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="17" font-weight="700" fill="${p.title}">${escapeXml(title)}</text>
  <text x="34" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" font-weight="500" fill="${p.dim}" letter-spacing="1.2">${escapeXml(subtitle.toUpperCase())}</text>`;
};

const renderStatsCard = ({ stats, dark }) => {
  const width = 420;
  const height = 168;
  const p = palette(dark);
  const items = stats.map(([label, value, color], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 22 + col * 198;
    const y = 70 + row * 52;
    return `
  <rect x="${x}" y="${y - 10}" width="188" height="44" rx="11" fill="${p.card}" stroke="${p.border}" stroke-width="1"/>
  <rect x="${x + 12}" y="${y + 8}" width="6" height="6" rx="3" fill="${color}"/>
  <text x="${x + 24}" y="${y + 15}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10.5" font-weight="600" fill="${p.dim}">${escapeXml(label)}</text>
  <text x="${x + 12}" y="${y + 30}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="750" fill="${p.title}">${formatNumber(value)}</text>`;
  }).join("");

  return shell({
    width,
    height,
    dark,
    body: `${titleBlock("GitHub Stats", "Profile Overview", dark)}${items}`,
  });
};

const renderLanguagesCard = ({ languages, dark }) => {
  const width = 420;
  const height = 168;
  const p = palette(dark);
  const total = languages.reduce((sum, [, bytes]) => sum + bytes, 0) || 1;
  let offset = 20;
  const gap = 3;
  const barWidth = width - 40;

  const segments = languages.map(([language, bytes]) => {
    const w = Math.max(5, (bytes / total) * barWidth - gap);
    const x = Math.min(offset, width - 20 - w);
    offset = x + w + gap;
    return `<rect x="${x.toFixed(1)}" y="62" width="${w.toFixed(1)}" height="12" rx="${Math.min(6, w / 2).toFixed(1)}" fill="${langColors[language] || acc.cyan}"/>`;
  }).join("");

  const legend = languages.map(([language, bytes], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 22 + col * 196;
    const y = 100 + row * 21;
    const percent = ((bytes / total) * 100).toFixed(1);
    return `
  <circle cx="${x + 4}" cy="${y - 4}" r="4" fill="${langColors[language] || acc.cyan}"/>
  <text x="${x + 14}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="${p.text}">${escapeXml(language)}</text>
  <text x="${x + 176}" y="${y}" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="${p.dim}">${percent}%</text>`;
  }).join("");

  return shell({
    width,
    height,
    dark,
    body: `${titleBlock("Top Languages", "Most Used", dark)}${segments}${legend}`,
  });
};

const renderRepoCard = ({ repo, description, dark }) => {
  const width = 420;
  const height = 148;
  const p = palette(dark);
  const primary = repo.language || "Code";
  const langColor = langColors[primary] || acc.cyan;
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const rawLines = Array.isArray(description)
    ? description
    : wrapText(description, width - 40, 12.5, 2);
  const lines = rawLines.slice(0, 2);
  const desc = lines
    .map((line, i) => `<text x="22" y="${68 + i * 17}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12.5" font-weight="450" fill="${p.dim}">${escapeXml(line || "")}</text>`)
    .join("");

  const body = `
  <rect x="16" y="16" width="5" height="24" rx="2.5" fill="url(#accent)"/>
  <text x="29" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="750" fill="${dark ? "#FFFFFF" : "#0F172A"}">${escapeXml(repo.name)}</text>
  <text x="${width - 22}" y="34" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" font-weight="600" fill="${acc.cyan}">↗</text>
  ${desc}
  <circle cx="25" cy="123" r="4.5" fill="${langColor}"/>
  <text x="35" y="127" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="650" fill="${p.text}">${escapeXml(primary)}</text>
  <g transform="translate(${width - 118} 116)">
    <path d="M12 1.5l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 1.5z" fill="${acc.amber}" fill-opacity="0.95"/>
    <text x="29" y="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="${p.text}">${formatNumber(stars)}</text>
  </g>
  <g transform="translate(${width - 62} 116)" fill="none" stroke="${p.text}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="3.5" cy="3.5" r="1.8"/>
    <circle cx="3.5" cy="11.5" r="1.8"/>
    <circle cx="12" cy="4.5" r="1.8"/>
    <path d="M3.5 5.3v4.4c0 1 .8 1.8 1.8 1.8h5.4"/>
    <path d="M12 2.7v1.8"/>
  </g>
  <text x="${width - 20}" y="127" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="${p.text}">${formatNumber(forks)}</text>`;

  return shell({ width, height, dark, body });
};


const renderTagDots = (x, y, tags, dark, size = 10) => {
  const p = palette(dark);
  let cursor = x;
  return tags.map(([label, color]) => {
    const text = `<circle cx="${cursor + 3}" cy="${y - 3.5}" r="3" fill="${color}"/><text x="${cursor + 10}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="${size}" font-weight="600" fill="${p.text}">${escapeXml(label)}</text>`;
    cursor += 10 + widthOf(label, size) + 14;
    return text;
  }).join("");
};

const products = [
  {
    id: "deepscientist",
    name: "DeepScientist",
    icon: "🔬",
    accent: acc.green,
    url: "https://deepscientist.cc",
    description: [
      "AI 驱动的科研管理平台，",
      "覆盖文献、想法与实验的一站式管理。",
    ],
    tags: [
      ["科研工作流", acc.pink],
      ["知识管理", acc.violet],
      ["AI 辅助", acc.green],
    ],
  },
  {
    id: "nova-blog",
    name: "Nova Blog",
    icon: "📝",
    accent: acc.cyan,
    url: "https://liangqianxing.github.io",
    description: [
      "个人工程博客，记录 LLM、Agent、",
      "AI Infra 与后端系统的思考与实践。",
    ],
    tags: [
      ["Nuxt 4", acc.green],
      ["TypeScript", acc.cyan],
      ["GitHub Pages", acc.violet],
    ],
  },
  {
    id: "ml-plotting",
    name: "ML 科研绘图教程",
    icon: "📊",
    accent: acc.pink,
    url: "https://github.com/liangqianxing/ml-research-plotting-tutorial",
    description: [
      "面向机器学习研究者的中文绘图教程，",
      "从论文配图规范到可复用模板。",
    ],
    tags: [
      ["Matplotlib", acc.amber],
      ["Python", acc.cyan],
      ["中文教程", acc.pink],
    ],
  },
];

const renderProductCard = ({ product, dark }) => {
  const width = 270;
  const height = 158;
  const p = palette(dark);
  const iconColor = product.accent;
  const desc = product.description.map((line, i) =>
    `<text x="18" y="${70 + i * 17}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11.5" font-weight="450" fill="${p.dim}">${escapeXml(line)}</text>`,
  ).join("");

  const body = `
  <rect x="16" y="16" width="36" height="36" rx="12" fill="${iconColor}" fill-opacity="0.14" stroke="${iconColor}" stroke-opacity="0.45"/>
  <text x="34" y="41" text-anchor="middle" font-size="18">${product.icon}</text>
  <text x="60" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15.5" font-weight="750" fill="${p.title}">${escapeXml(product.name)}</text>
  <text x="${width - 18}" y="35" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${iconColor}">↗</text>
  ${desc}
  ${renderTagDots(18, 126, product.tags, dark, 9.5)}`;

  return shell({ width, height, dark, body });
};

const experiences = [
  {
    id: "meituan",
    date: "2026.05 — 至今",
    role: "美团 · 全栈开发实习生",
    accent: acc.cyan,
    description: "横跨前端、后端与内部工具的产品工程化",
    tags: [["实习中", acc.pink], ["全栈", acc.cyan]],
  },
  {
    id: "westlake",
    date: "2025.12 — 2026.03",
    role: "西湖大学 · NLP 实验室访问学生",
    accent: acc.violet,
    description: "科研工作流、NLP 系统与 AI 辅助知识工作",
    tags: [["NLP 实验室", acc.violet], ["研究工具", acc.green]],
  },
];

const renderExperienceCard = ({ experience, dark }) => {
  const width = 820;
  const height = 112;
  const p = palette(dark);
  const dateWidth = widthOf(experience.date, 12) + 24;

  const body = `
  <rect x="20" y="20" width="${dateWidth}" height="30" rx="15" fill="${experience.accent}" fill-opacity="0.14" stroke="${experience.accent}" stroke-opacity="0.45"/>
  <text x="${20 + dateWidth / 2}" y="40" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="700" fill="${experience.accent}">${escapeXml(experience.date)}</text>
  <text x="${40 + dateWidth}" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15.5" font-weight="750" fill="${p.title}">${escapeXml(experience.role)}</text>
  <text x="${width - 18}" y="40" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="600" fill="${experience.accent}">↗</text>
  <text x="${40 + dateWidth}" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="450" fill="${p.dim}">${escapeXml(experience.description)}</text>
  ${renderTagDots(40 + dateWidth, 92, experience.tags, dark, 10.5)}`;

  return shell({ width, height, dark, body });
};

const skillGroups = [
  {
    icon: "🐍",
    title: "语言",
    accent: acc.cyan,
    lines: ["Python · C++", "TypeScript · JavaScript"],
  },
  {
    icon: "🎨",
    title: "前端",
    accent: acc.pink,
    lines: ["React · Vue", "Nuxt · UI 工程化"],
  },
  {
    icon: "⚙️",
    title: "后端 & AI",
    accent: acc.green,
    lines: ["Node.js · FastAPI", "PyTorch · LLM 推理"],
  },
  {
    icon: "🔧",
    title: "工程化",
    accent: acc.violet,
    lines: ["Docker · Linux", "Git · GitHub Actions"],
  },
];

const renderSkillsCard = ({ dark }) => {
  const width = 820;
  const height = 122;
  const p = palette(dark);
  const columns = skillGroups.map((group, index) => {
    const x = 22 + index * 199;
    const lines = group.lines.map((line, i) =>
      `<text x="${x + 6}" y="${74 + i * 20}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="500" fill="${p.dim}">${escapeXml(line)}</text>`,
    ).join("");
    return `
  <text x="${x + 6}" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" font-weight="750" fill="${p.title}">${group.icon} ${escapeXml(group.title)}</text>
  <rect x="${x + 8}" y="50" width="32" height="3" rx="1.5" fill="${group.accent}"/>
  ${lines}
  ${index < skillGroups.length - 1 ? `<line x1="${x + 190}" y1="24" x2="${x + 190}" y2="${height - 24}" stroke="${p.border}" stroke-width="1"/>` : ""}`;
  }).join("");

  return shell({ width, height, dark, body: columns });
};

const descriptions = {
  "hexo-theme-nova": [
    "现代 Hexo 主题：学术主页 + 博客一体化，",
    "支持暗色模式、目录与响应式布局。",
  ],
  agentmem: [
    "面向 LLM Agent 推理的内存管理系统：KV Cache",
    "生命周期、分支 CoW、上下文压缩与三级分层存储。",
  ],
  "fast-llm-kernels": [
    "高性能 PyTorch CUDA 算子：RMSNorm 与",
    "fused residual-add + RMSNorm 实现。",
  ],
  ToyOS: ["ECNU OSLab 2025：从 0 到 1 的 RISC-V 小型内核实现。"],
};

const targetRepos = ["hexo-theme-nova", "agentmem", "fast-llm-kernels", "ToyOS"];

const main = async () => {
  const dist = path.join(process.cwd(), "dist");
  fs.mkdirSync(dist, { recursive: true });

  const [user, repos] = await Promise.all([
    api(`/users/${owner}`),
    api(`/users/${owner}/repos?type=owner&sort=updated&per_page=100`),
  ]);

  const sourceRepos = repos.filter((repo) => !repo.fork && !repo.archived && !repo.private);
  const totalStars = sourceRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = sourceRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languageBytes = {};
  for (const repo of sourceRepos) {
    try {
      const langs = await api(`/repos/${owner}/${repo.name}/languages`);
      for (const [language, bytes] of Object.entries(langs)) {
        languageBytes[language] = (languageBytes[language] || 0) + bytes;
      }
    } catch (error) {
      console.warn(`Could not read languages for ${repo.name}: ${error.message}`);
    }
  }

  const languages = Object.entries(languageBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const stats = [
    ["Public Repos", user.public_repos, acc.cyan],
    ["Followers", user.followers, acc.violet],
    ["Stars Earned", totalStars, acc.amber],
    ["Forks", totalForks, acc.green],
  ];

  for (const dark of [true, false]) {
    const suffix = dark ? "dark" : "light";
    fs.writeFileSync(
      path.join(dist, `github-stats-${suffix}.svg`),
      renderStatsCard({ stats, dark }),
    );
    fs.writeFileSync(
      path.join(dist, `top-languages-${suffix}.svg`),
      renderLanguagesCard({ languages, dark }),
    );
    for (const name of targetRepos) {
      const repo = repos.find((item) => item.name === name);
      if (!repo) continue;
      fs.writeFileSync(
        path.join(dist, `repo-${name.toLowerCase()}-${suffix}.svg`),
        renderRepoCard({ repo, description: descriptions[name] || repo.description || name, dark }),
      );
    }
    for (const product of products) {
      fs.writeFileSync(
        path.join(dist, `product-${product.id}-${suffix}.svg`),
        renderProductCard({ product, dark }),
      );
    }
    for (const experience of experiences) {
      fs.writeFileSync(
        path.join(dist, `experience-${experience.id}-${suffix}.svg`),
        renderExperienceCard({ experience, dark }),
      );
    }
    fs.writeFileSync(
      path.join(dist, `skills-card-${suffix}.svg`),
      renderSkillsCard({ dark }),
    );
  }

  fs.writeFileSync(
    path.join(dist, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString() }, null, 2),
  );
  console.log("Generated profile assets in dist/");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
