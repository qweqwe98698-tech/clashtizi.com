<div align="center">

# 🚀 Clash梯子网 (clashtizi.com)

**2026 现代化跨境网络加速、高速稳定机场推荐与代理技术知识门户**

[![Astro](https://img.shields.io/badge/Astro-5.x%20%7C%20SSR%20%26%20SSG-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pagefind](https://img.shields.io/badge/Search-Pagefind-059669)](https://pagefind.app/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

[🌐 访问官网 (Live Site)](https://clashtizi.com/) • [📊 机场评测排行榜](/recommend/airport/) • [🛠️ Clash Verge 教程](/tutorials/clash-verge-setup/) • [⚡ Sing-box 指南](/tutorials/sing-box-config/)

</div>

---

## 📖 项目简介 (Overview)

**Clash梯子网 (clashtizi.com)** 是一个专注于科学上网、网络代理技术评测、IPLC/IEPL 专线机场实测分析与疑难排障的专业技术门户。

本项目基于现代化的 **[Astro](https://astro.build)** 静态站点生成引擎与 **[Tailwind CSS](https://tailwindcss.com)** 打造，具备极致的首屏加载速度、完备的 **SEO + GEO / AEO** 语义化架构，以及全设备端自适应的优雅交互体验。

---

## ✨ 核心特色与专栏矩阵 (Features & Pillars)

### 📊 1. 2026 高速稳定机场推荐与评测排行榜 (`/recommend/airport/`)
- **17 家主流知名品牌横评**：涵盖光速云、飞猫云、微风网络、星岛梦、U1S1、极连云等。
- **真实数据与实测截图**：每家机场均附带晚高峰 4K/8K YouTube 跑分测速图及流媒体/ChatGPT 原生住宅 IP 解锁测试图。
- **直观六维对比表**：月付起步价、专线类型（IPLC/IEPL）、月流量、节点覆盖、优惠码及官网直达。

### 🛠️ 2. Clash Verge Rev 核心客户端全生命周期指南 (`/tutorials/clash-verge-setup/`)
- 覆盖 Windows、macOS (Apple Silicon/Intel)、Linux 全平台安装向导。
- 深入拆解订阅导入、节点选择、Rule 规则分流、System Proxy 系统代理与 TUN 虚拟网卡底层原理。
- 附带 6 张结构化对比表与 20 个高频问答 (FAQ)。

### 🌐 3. Sing-box 跨平台全协议实操手册 (`/tutorials/sing-box-config/`)
- 下一代通用代理核心深度解析，清晰区分 Core 内核与 GUI 前端生态。
- **Hysteria 2、TUIC v5、VLESS Reality** 前沿抗封锁协议技术差异硬核对比。
- 覆盖 Windows、macOS、Android、iOS 与 Linux 守护进程配置。

### 🔧 4. 网络故障与 AI 工具疑难排障专题
- **[Clash 节点超时/全红/无法连接排查](/issues/clash-nodes-timeout/)**：5 步快速定位系统时间偏差（TLS 握手）、订阅过期、端口冲突与 DNS 脏缓存。
- **[ChatGPT 无法登录 / Access Denied 1020 修复](/issues/chatgpt-access-denied/)**：系统性解决 Cloudflare WAF 人机验证风控、原生住宅 IP 选型与分流规则调优。

---

## 🛠️ 技术栈选型 (Tech Stack)

| 领域 | 选型与技术方案 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | **Astro 5.x** | 内容驱动型超快静态站点生成，极低 JS 运行时体积 |
| **样式体系** | **Tailwind CSS + CSS Modules** | 响应式设计，完美适配 375px 移动端到 4K 超宽屏 |
| **动效与过渡**| **Swup.js** | 丝滑的单页应用 (SPA) 级页面无缝过渡 |
| **站内检索** | **Pagefind** | 纯静态、离线分词的高性能站内全文搜索引擎 |
| **矢量图标** | **Iconify / Astro Icon** | 按需加载数万款矢量 Material Symbols 图标 |
| **结构化数据**| **JSON-LD Schema** | 自动化生成 Article、BreadcrumbList、FAQPage 结构化标记 |

---

## 📂 目录结构 (Directory Structure)

```text
clashtizi.com/
├── public/                     # 静态公共资源
│   ├── assets/                 # 网站 Logo、横幅与图标
│   └── images/airports/        # 17 家机场真实测速图与解锁测试图
├── src/
│   ├── components/             # Astro / Svelte UI 组件
│   │   ├── atoms/              # 基础原子组件（图片、打字机动效等）
│   │   ├── features/           # 业务功能组件（TOC 目录、文章列表等）
│   │   └── widgets/            # 侧边栏小部件（个人卡片、标签云、公告栏）
│   ├── config/                 # 站点核心配置
│   │   ├── siteConfig.ts       # 网站标题、Slogan、图标、主题配置
│   │   ├── navBarConfig.ts     # 导航栏菜单链接配置
│   │   └── sidebarConfig.ts    # 侧边栏组件与响应式断点配置
│   ├── content/                # Markdown 内容集合
│   │   ├── posts/              # 核心博客与教程文章
│   │   └── spec/               # 关于我们等独立页面
│   ├── layouts/                # 页面母版布局 (MainGridLayout)
│   ├── pages/                  # 动态路由与静态页面
│   └── utils/                  # 辅助函数库 (TOCManager, DateUtils)
├── astro.config.mjs            # Astro 配置文件
├── package.json                # 项目依赖清单
└── README.md                   # 项目自述文件
```

---

## 🚀 本地开发与快速上手 (Getting Started)

### 前置环境准备
- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (推荐) 或 `npm` / `yarn`

### 1. 克隆代码仓库
```bash
git clone https://github.com/qweqwe98698-tech/clashtizi.com.git
cd clashtizi.com
```

### 2. 安装项目依赖
```bash
pnpm install
```

### 3. 启动本地开发服务器
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可实时预览。

### 4. 生产环境构建与测试
```bash
# 静态编译并生成 Pagefind 索引
pnpm build

# 本地预览编译后的生产产物
pnpm preview
```

---

## ☁️ 部署指南 (Deployment)

本项目为纯静态现代 Web 架构，支持一键部署到任意现代静态托管平台：

### 方案 A：Cloudflare Pages (强烈推荐)
1. 登录 Cloudflare Dashboard $\rightarrow$ **Workers 和 Pages** $\rightarrow$ **创建应用程序** $\rightarrow$ **Pages**。
2. 连接 GitHub 仓库 `qweqwe98698-tech/clashtizi.com`。
3. 构建配置：
   - **框架预设**：`Astro`
   - **构建命令**：`pnpm build`
   - **构建输出目录**：`dist`
4. 点击“保存并部署”，绑定自定义域名 `clashtizi.com` 即可享受全球 Anycast CDN 秒级加速。

### 方案 B：Vercel / Netlify
- 导入仓库后系统会自动检测 Astro 框架，使用默认参数即可一秒完成上线。

---

## 📄 免责声明 (Disclaimer)

1. 本网站发布的所有评测内容、测速图表、教程与技术解析仅供网络技术学习、学术科研与跨境电商出海参考交流。
2. 请严格遵守您所在国家和地区的相关法律法规，切勿将代理技术用于任何非法用途。

---

<div align="center">

**Clash梯子网 © 2026 All Rights Reserved.**  
Made with ❤️ by the ClashTizi Team

</div>
