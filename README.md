<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/profile-header-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="assets/profile-header-light.svg" />
  <img width="100%" src="assets/profile-header-light.svg" alt="古恩豪 Enhao Gu — AI4Science, LLM Agents and AI Infrastructure" />
</picture>

<p align="center">
  <a href="https://liangqianxing.github.io"><b>个人网站 / Blog</b></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/ResearAI/DeepScientist"><b>DeepScientist</b></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/liangqianxing?tab=repositories"><b>开源项目 / Projects</b></a>
</p>

## 关于我 · About

你好，我是 **古恩豪 / Enhao Gu**。我做科研智能体与全栈开发，也关注 LLM 推理效率和 Agent 基础设施。喜欢从论文与真实任务出发，把系统做出来，再通过实验和使用反馈改进。

- **现在**：在美团实习，参与 AI Coding 工具与开发平台建设。
- **研究**：曾在西湖大学 NLP 实验室参与科研智能体研发，在北京大学 IFlab 参与视频扩散模型推理加速研究。
- **近期关注**：Agent 的规划、记忆与工具调用，以及上下文管理、KV Cache 和推理算子优化。
- **记录**：在 [个人网站](https://liangqianxing.github.io) 整理工程笔记、实验与开源项目。

### 教育与经历

| 学校 / 团队 | 时间 | 经历 |
| :--- | :--- | :--- |
| **华东师范大学** | 2027 - 2030 | 软件工程 · **已保研录取，2027 年入学** |
| **新疆大学** | 2023 - 2027 | 软件工程 · 本科在读；曾于中南大学交换学习 |
| **美团** | 2026.06 - 至今 | 全栈开发实习生 · Agent 任务编排、沙箱执行与工具调用链路 |
| **西湖大学 · NLP 实验室** | 2025.12 - 2026.03 | 访问学生 · DeepScientist、DeepReviewer 2.0、AutoFigure-Edit |
| **北京大学 · IFlab** | 2025.09 - 2025.12 | 科研实习生 · 视频扩散模型推理加速 |

## 科研工作 · Research

以下是我作为共同作者参与的两项工作：

| 工作 | 方向 | 公开成果 |
| :--- | :--- | :--- |
| **[DeepReviewer 2.0](https://arxiv.org/abs/2604.09590)** | 可追踪、可审计的科研评审 Agent；证据锚定与分阶段核验 | arXiv · 2026 |
| **[AutoFigure-Edit](https://aclanthology.org/2026.acl-demo.6/)** | 参考风格引导的可编辑科研插图生成 | ACL 2026 · System Demonstrations |

在科研系统开发中，我参与了 DeepScientist 的 Copilot / Autonomous 工作模式、会话上下文续接、MCP 工具接入，以及 Agent 运行轨迹与交互式终端展示。

## 精选项目 · Selected Projects

<table>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/ResearAI/DeepScientist">DeepScientist ↗</a></h3>
      <p>参与研发的科研智能体平台。围绕研究任务连接规划、代码执行、工具调用与科研产物。</p>
      <p><sub>AI4Science · Agent / Copilot · MCP</sub></p>
      <a href="https://github.com/ResearAI/DeepScientist">源码</a> · <a href="https://deepscientist.cc">网站</a>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/LiuMengxuan04/MiniCode">MiniCode ↗</a></h3>
      <p>参与核心开发的轻量级终端 AI 编程助手。实现 ReAct 循环、工具注册与权限拦截，集成 MCP 和 Skills。</p>
      <p><sub>TypeScript · Agentic Coding · Tool Use</sub></p>
      <a href="https://github.com/LiuMengxuan04/MiniCode">源码</a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/liangqianxing/agentmem">AgentMem ↗</a></h3>
      <p>面向 LLM Agent 推理的内存管理系统：KV Cache 生命周期、分支 CoW、上下文压缩与分层存储。</p>
      <p><sub>Python · KV Cache · Inference Systems</sub></p>
      <a href="https://github.com/liangqianxing/agentmem">源码</a>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/liangqianxing/fast-llm-kernels">Fast LLM Kernels ↗</a></h3>
      <p>围绕 RMSNorm 和 residual-add 融合算子优化推理路径，配套数值验证、基准测试与性能分析。</p>
      <p><sub>C++ / CUDA · PyTorch · Profiling</sub></p>
      <a href="https://github.com/liangqianxing/fast-llm-kernels">源码</a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/liangqianxing/ml-research-plotting-tutorial">ML Figure Lab ↗</a></h3>
      <p>面向机器学习研究者的中文绘图教程。从实验图表到论文架构图，整理可复用的绘图方法。</p>
      <p><sub>Scientific Figures · VitePress · Research Tools</sub></p>
      <a href="https://github.com/liangqianxing/ml-research-plotting-tutorial">源码</a> · <a href="https://liangqianxing.github.io/ml-research-plotting-tutorial/">在线阅读</a>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/liangqianxing/hexo-theme-nova">Hexo Theme Nova ↗</a></h3>
      <p>融合学术主页与博客的 Hexo 主题，支持深浅色模式、文章目录与响应式布局。</p>
      <p><sub>Hexo · Academic Homepage · Web Design</sub></p>
      <a href="https://github.com/liangqianxing/hexo-theme-nova">源码</a>
    </td>
  </tr>
</table>

也在做系统方向的学习项目：[ToyOS](https://github.com/liangqianxing/ToyOS) · 从零实现 RISC-V 小型内核。

## 工具与积累 · Toolkit

| 方向 | 常用工具与方法 |
| :--- | :--- |
| **Agent / AI** | Python、PyTorch、Transformers、PEFT / LoRA、ReAct、MCP、上下文管理 |
| **全栈与系统** | TypeScript、React、Next.js、Vue / Nuxt、FastAPI、PostgreSQL、Docker、Linux |
| **开发与实验** | C++、Git、GitHub Actions、Codex、Claude Code、可复现评测 |

**竞赛**：ACM-ICPC 亚洲区域赛铜牌、全国邀请赛银牌、新疆自治区赛金牌；CCPC 全国邀请赛银牌。

<details>
  <summary><b>GitHub 活动 · 自动更新</b></summary>
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-stats-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-stats-light.svg" />
    <img width="420" src="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-stats-light.svg" alt="自动更新的公开仓库、关注者、Stars 与 Forks 统计" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/top-languages-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/top-languages-light.svg" />
    <img width="420" src="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/top-languages-light.svg" alt="公开原创仓库的代码语言分布" />
  </picture>
  <br /><br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-contribution-grid-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-contribution-grid-snake.svg" />
    <img width="100%" src="https://raw.githubusercontent.com/liangqianxing/liangqianxing/output/github-contribution-grid-snake.svg" alt="GitHub 贡献贪吃蛇动画" />
  </picture>
</details>

---

<p align="center">
  <sub>欢迎交流科研智能体、推理系统与开发者工具。更多笔记与项目见 <a href="https://liangqianxing.github.io">liangqianxing.github.io</a>。</sub>
</p>
