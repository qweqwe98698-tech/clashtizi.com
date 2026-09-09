/**
 * Auto SEO & GEO Master Publisher for clashtizi.com
 * Automates weekly generation and publishing of in-depth (万字级/深度) SEO & GEO pillar articles
 * powered by Google Gemini API.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 尝试加载本地 .env 文件（如果在本地运行）
const envPath = path.join(rootDir, ".env");
if (fs.existsSync(envPath)) {
	const content = fs.readFileSync(envPath, "utf8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
			const [key, ...vals] = trimmed.split("=");
			if (!process.env[key.trim()]) {
				process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
			}
		}
	}
}

// 6 大合作品牌精准元数据库（与站点保持一致）
const PARTNER_BRANDS = [
	{
		name: "光速云",
		desc: "2020年老牌IEPL纯专线综合旗舰，全节点部署 VLESS 协议，超5年高 SLA 保障",
		lineType: "IEPL 专线 / VLESS",
		price: "年付折合约 7.5元/月 (59GB)",
		coupon: "AMM",
		discount: "8折",
		url: "https://sahude.gsyvipaff.com/#/?code=keqgvT5Y",
		features: "华为云/企业级IEPL纯专线、单节点最高2.5Gbps、4K/8K秒开、ChatGPT/Claude纯净原生解锁",
	},
	{
		name: "飞猫云",
		desc: "高性价比纯净专线大厂，主打低倍率、原生机房出口与多端极速秒开",
		lineType: "IEPL 专线 / 纯净",
		price: "年付折合约 7.0元/月 (50GB)",
		coupon: "flycat888",
		discount: "8折",
		url: "https://guangs.flycataff.com/#/?code=6uq0Xe9y",
		features: "全专线节点不过GFW、YouTube 4K毫秒级缓冲、支持一键托管订阅、纯净流媒体解锁",
	},
	{
		name: "微风网络",
		desc: "平价稳定轻度专线首选，轻度文字、科研与 AI 办公首选，资费亲民",
		lineType: "IEPL 专线 / 高清",
		price: "年付折合约 7.0元/月 (50GB)",
		coupon: "flat888",
		discount: "9折",
		url: "https://edp01.breezenetaff.com/#/?code=t3huofyI",
		features: "IEPL内网专线保障、超低入门门槛、晚高峰平稳抗丢包、适合学生与轻量查资料人群",
	},
	{
		name: "星岛梦",
		desc: "企业级内网专线节点调度，低延迟、低抖动，专门针对晚高峰与复杂网络优化",
		lineType: "企业内网专线",
		price: "入门 8.0元/月 (60GB)",
		coupon: "nmw888",
		discount: "9折",
		url: "https://guangs.xingdaomeng.com/#/?code=1TynBYnR",
		features: "企业专线低时延通道、香港/日本/新加坡节点延迟平均 < 45ms、适合外服游戏与敏感办公",
	},
	{
		name: "无忧链接",
		desc: "全自研客户端与全线 IPLC 物理专线架构，全终端一键傻瓜式连接，全球多节点直达",
		lineType: "IPLC 物理专线 / VLESS",
		price: "入门月付套餐 · 极速出海",
		coupon: "wuyou",
		discount: "推荐",
		url: "https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL",
		features: "IPLC全内网传输、统一1x倍率无套路、多设备在线不限速、海外TikTok/AI全平台覆盖",
	},
	{
		name: "唯兔云",
		desc: "三网优化与原生落地机房大带宽，大流量套餐代表，流媒体深度追剧与下载利器",
		lineType: "三网优化 / VLESS",
		price: "月付 14.9元/月 (100GB)",
		coupon: "rabbit",
		discount: "9折",
		url: "https://guangs.v2yunvipaff.com/#/?code=xIutqOBA",
		features: "原生机房出口落地、Netflix/Disney+全解锁、三网回程智能BGP直连、超高流量性价比",
	},
];

// 高权重 SEO 深度专题库（按周轮巡发布）
const TOPIC_PRESETS = [
	{
		slug: "2026-iplc-iepl-dedicated-line-airport-selection-guide",
		title: "2026年企业级IPLC与IEPL专线机场深度横评：晚高峰0丢包、技术原理与防跑路选购终极指南",
		category: "机场评测",
		tags: ["IPLC专线", "IEPL专线", "机场推荐", "专线机场", "晚高峰测速", "梯子推荐", "2026排行榜"],
		coreTheme: "IPLC/IEPL 物理专线与普通直连/中转公网梯子的底层架构差异、晚高峰丢包机理、6大主流品牌横评与选购决策树",
	},
	{
		slug: "chatgpt-claude-ai-native-ip-dedicated-airport-guide-2026",
		title: "AI出海专线与ChatGPT/Claude纯净节点避坑全指南：2026年高SLA住宅IP与无风控机场横评",
		category: "科学上网",
		tags: ["ChatGPT机场", "Claude专线", "AI解锁", "原生IP", "机场推荐", "住宅IP", "风控排障"],
		coreTheme: "OpenAI 与 Anthropic 地区风控(1020/Access Denied/Cloudflare无限循环)底层拦截原理、纯净原生出口节点筛选、6大专线大厂解锁实测对比",
	},
	{
		slug: "streaming-4k-8k-netflix-disney-tiktok-airport-evaluation-2026",
		title: "2026全球流媒体与TikTok出海专线横评：Netflix/Disney+/YouTube 4K秒开节点与CDN调度全书",
		category: "机场评测",
		tags: ["流媒体机场", "Netflix解锁", "TikTok网络", "YouTube4K", "4K秒开", "机场推荐", "专线测速"],
		coreTheme: "海外流媒体版权检测机制、DNS解锁与原生住宅机房差异、晚高峰单线程带宽测速、TikTok防黑屏运营网络环境搭建",
	},
	{
		slug: "gaming-low-latency-esports-cross-border-airport-guide-2026",
		title: "外服游戏加速与电竞低延迟专线完全评测：香港/日本/新加坡节点、丢包率与晚高峰路由优化（2026）",
		category: "教程指南",
		tags: ["游戏低延迟", "外服加速", "香港节点", "日本专线", "丢包率优化", "Clash游戏配置", "电竞专线"],
		coreTheme: "UDP转发/全锥形NAT对联机游戏影响、晚高峰公网QoS拥堵与物理专线对比、常见外服(Steam/Valorant/Apex)节点选择与优化",
	},
	{
		slug: "cross-border-ecommerce-foreign-trade-network-security-guide-2026",
		title: "跨境电商与外贸独立站网络环境搭建指南：防关联、原生纯净IP、双机场热备与稳定出海方案（2026）",
		category: "科学上网",
		tags: ["跨境电商", "外贸网络", "防关联IP", "独立站出海", "双机场热备", "企业专线", "商业网络"],
		coreTheme: "外贸日常邮件、海外社媒矩阵、PayPal/Stripe支付风控与节点纯净度关系、1+1主备热备容灾架构构建",
	},
	{
		slug: "clash-verge-singbox-shadowrocket-universal-config-guide-2026",
		title: "2026全平台科学上网客户端深度配置与排障宝典：Clash Verge Rev、Sing-box与小火箭母指南",
		category: "客户端配置",
		tags: ["Clash Verge", "Sing-box", "Shadowrocket", "小火箭教程", "TUN模式", "DNS防污染", "客户端配置"],
		coreTheme: "三大主流客户端(Windows/Mac/iOS/Android)内核演进、TUN虚拟网卡模式实战、订阅更新失败与所有节点全红超时自愈解决方案",
	},
	{
		slug: "free-nodes-vs-paid-airports-security-technical-analysis-2026",
		title: "免费梯子节点 vs 付费IEPL专线机场技术解密：TLS指纹、中间人攻击、DNS泄漏与隐私安全全景指南",
		category: "网络安全",
		tags: ["免费节点风险", "专线对比", "DNS泄漏", "TLS伪装", "网络安全", "隐私保护", "避坑指南"],
		coreTheme: "爬虫抓取公共节点的安全黑幕与中间人劫持风险、企业专线加密边界、抓包实测证明与个人数据安全自救",
	},
	{
		slug: "cost-effective-airports-monthly-pay-plans-comprehensive-review-2026",
		title: "2026高性价比月付专线机场综合横评：10元~25元档位流量、倍率算式与防跑路决策指南",
		category: "机场推荐",
		tags: ["高性价比机场", "月付机场", "便宜机场", "防跑路", "流量倍率", "专线机场", "选购决策"],
		coreTheme: "低价月付防跑路心理机制、真实带宽倍率暗坑揭秘、10-25元主流大厂实测性价比综合排行榜",
	},
];

// 已发布文章状态追踪文件
const PUBLISHED_LOG_PATH = path.join(rootDir, "seo-system", "published-topics.json");

function getPublishedLog() {
	if (fs.existsSync(PUBLISHED_LOG_PATH)) {
		try {
			return JSON.parse(fs.readFileSync(PUBLISHED_LOG_PATH, "utf8"));
		} catch {
			return [];
		}
	}
	return [];
}

function savePublishedLog(log) {
	const dir = path.dirname(PUBLISHED_LOG_PATH);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(PUBLISHED_LOG_PATH, JSON.stringify(log, null, 2), "utf8");
}

/**
 * 选取本周待发布的最佳主题
 */
function pickNextTopic(overrideSlug = null) {
	const published = getPublishedLog();
	const publishedSlugs = new Set(published.map((p) => p.slug));

	if (overrideSlug) {
		const match = TOPIC_PRESETS.find((t) => t.slug === overrideSlug);
		if (match) return match;
		return {
			slug: overrideSlug,
			title: overrideSlug.replace(/-/g, " "),
			category: "机场推荐",
			tags: ["机场推荐", "专线机场", "科学上网", "2026最新"],
			coreTheme: overrideSlug,
		};
	}

	// 优先从预设库中挑选未发布的
	for (const topic of TOPIC_PRESETS) {
		if (!publishedSlugs.has(topic.slug)) {
			return topic;
		}
	}

	// 如果全部发布过一遍，根据时间生成全新年份周次演进主题
	const now = new Date();
	const weekNumber = Math.ceil((now.getDate() + now.getDay()) / 7);
	const dynamicSlug = `airport-evaluation-weekly-insights-${now.getFullYear()}-w${weekNumber}-${now.getMonth() + 1}`;
	return {
		slug: dynamicSlug,
		title: `${now.getFullYear()}年第${weekNumber}周高速专线机场晚高峰深度评测与节点稳定性周刊`,
		category: "机场评测",
		tags: ["机场周刊", "晚高峰实测", "专线机场", "梯子推荐", "2026最新"],
		coreTheme: "本周最新骨干网国际出口拥堵情况、6大专线品牌节点实测稳定性评分与AI/流媒体支持更新动态",
	};
}

/**
 * 构建符合 GEO 与万字级规范的 Master AI 提示词
 */
function buildMasterPrompt(topic) {
	const brandContext = JSON.stringify(PARTNER_BRANDS, null, 2);

	return `你是一名资深跨境网络与云基础设施架构师、高级网络安全工程师以及 GEO（生成式引擎优化）与 SEO 权威专家。
你的任务是撰写一篇字数达 6000 ~ 9000 字以上、极具权威性、客观硬核、深度满足 Google SGE、SearchGPT 和 Perplexity 等 AI 搜索引用的【万字级行业权威专题指南】。

### 专题信息
- **标题**：${topic.title}
- **分类**：${topic.category}
- **标签**：${JSON.stringify(topic.tags)}
- **核心主题与技术要求**：${topic.coreTheme}

### 必须包含的官方指定合作品牌数据库（禁止篡改名称、链接与优惠码）：
${brandContext}

---

### 严格的内容规范与结构要求：

1. **Frontmatter 格式**：
必须在最开头输出合法的 Markdown Frontmatter（必须用 --- 包裹）：
---
title: "${topic.title}"
published: ${new Date().toISOString().split("T")[0]}
updated: ${new Date().toISOString().split("T")[0]}
description: "深度精选摘要，120-160字，包含核心关键词、技术亮点和品牌推荐"
category: "${topic.category}"
tags: ${JSON.stringify(topic.tags)}
draft: false
pinned: false
---

2. **TL;DR 核心导读（针对 GEO / AI 搜索优化）**：
- 文章正文第一部分必须为加粗的 \`> **核心导读 (TL;DR)**\` 引用块。
- 给出 3~4 条直奔主题的结构化硬核结论（包含物理线路优劣、丢包分析、客户端选择及首选品牌）。

3. **原生对比大表格 (速查表)**：
- 必须制作一张格式规整的 Markdown 对比大表格，完整列出上述 6 大合作品牌：
  | 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 核心优势 | 官网直达 |
  官网直达必须为精准的 Markdown 链接，如：[官网注册 ↗](注册链接)。

4. **硬核技术原理解析（>= 1800 字）**：
- 深入拆解本专题相关的网络协议（如 VLESS Reality、Hysteria 2、TUIC v5、Shadowsocks 2022）、物理链路（IEPL / IPLC 内网点对点、BGP 三网中转、公网直连 QoS 限速）、丢包率与抖动的物理根源。
- 用清晰的 ASCII 拓扑图展示数据包传输链路（如：[客户端] -> [国内多线BGP] -> [点对点IEPL物理专线(过墙0丢包)] -> [原生机房落地出口]）。

5. **6 大合作品牌逐一深度客观横评（>= 2500 字）**：
- 依次设立独立的三级标题（### 光速云、### 飞猫云、### 微风网络、### 星岛梦、### 无忧链接、### 唯兔云）。
- 对每一个品牌展开详细评测：开业背景与SLA稳定性、线路拓扑与节点倍率、晚高峰真机测速数据（下行速度、上行带宽、ping延迟、丢包率）、流媒体与ChatGPT/Claude解锁支持状态、套餐建议、优惠码输入指导及专属注册按钮。

6. **全平台客户端配置与实战优化教程（>= 1500 字）**：
- 针对 Windows/macOS（Clash Verge Rev）、iOS（Shadowrocket 小火箭）、Android（Sing-box / v2rayNG）提供规范的导入与 TUN 模式调优步骤。

7. **深度常见问题与排障解答（FAQ，>= 1200 字）**：
- 包含至少 4 个常见疑难排障（如：节点超时全红、打不开国外网站、ChatGPT 1020 报错等），并提供条理清晰的解决路径。

8. **内链闭环**：
- 在文章中自然地嵌入指向主站核心页面的内部链接：
  - 指向首页权威排行榜：[2026 优质专线机场与 IPLC 节点评测榜单速查](/recommend/airport/)
  - 指向客户端教程：[Clash Verge Rev 完整使用教程](/clash-verge-rev/)
  - 指向排障中心：[梯子节点超时全红排障指南](/issues/clash-nodes-timeout/)

9. **语言风格要求**：
- 严禁空洞套话，严禁AI腔、机构口号腔和虚假夸张广告词。必须像一位从业十余年的资深网络架构师，用详实、客观、充满实战经验的语气阐述技术细节与实测结果。

请立即输出整篇完整的 Markdown 文本，不要在开头或结尾添加额外的无关说明，直接从 --- 开始输出。`;
}

/**
 * 调用 Google Gemini API
 */
async function callGeminiApi(prompt) {
	const rawKey = process.env.GEMINI_API_KEY || "";
	const apiKey = rawKey.trim().replace(/^["']|["']$/g, "").trim();
	if (!apiKey) {
		throw new Error("缺少 GEMINI_API_KEY 环境变量！请在 GitHub Secrets 或本地 .env 中配置。");
	}

	console.log(`🔑 检测到 GEMINI_API_KEY (长度: ${apiKey.length} 字符, 前缀: ${apiKey.slice(0, 6)}...)`);

	// 标准 Google Gemini API 生产级模型
	const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

	let lastError = null;
	for (const model of models) {
		const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
		console.log(`📡 正在调用 Google Gemini API (模型: ${model})...`);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": apiKey,
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 8192,
					},
				}),
			});

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(`API 响应错误 [${res.status}]: ${errText}`);
			}

			const data = await res.json();
			const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (!text) {
				throw new Error("Gemini 返回的内容为空或结构异常");
			}

			console.log(`✓ 成功获取 Gemini 响应内容 (长度: ${text.length} 字符)`);
			return text;
		} catch (err) {
			console.warn(`⚠ 模型 ${model} 调用失败: ${err.message}，尝试备选模型...`);
			lastError = err;
		}
	}

	throw lastError;
}

/**
 * 主执行流程
 */
async function main() {
	console.log("\n=======================================================");
	console.log("🚀 开始执行全自动 SEO / GEO 专题文章生成流程");
	console.log("=======================================================\n");

	const isDryRun = process.argv.includes("--dry-run");
	const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

	const topic = pickNextTopic(slugArg);
	console.log(`📌 本次选题: ${topic.title}`);
	console.log(`🔗 Slug: ${topic.slug}`);
	console.log(`📂 分类: ${topic.category} | 标签: ${topic.tags.join(", ")}\n`);

	const targetFile = path.join(rootDir, "src", "content", "posts", `${topic.slug}.md`);

	let markdownContent = "";

	if (isDryRun) {
		console.log("🔍 当前为 --dry-run 测试模式，生成占位骨架文件用于流程校验...");
		markdownContent = `---
title: "${topic.title}"
published: ${new Date().toISOString().split("T")[0]}
updated: ${new Date().toISOString().split("T")[0]}
description: "2026年最新高速稳定企业级专线机场评测专题与排障指南。"
category: "${topic.category}"
tags: ${JSON.stringify(topic.tags)}
draft: false
pinned: false
---

> **核心导读 (TL;DR)**：
> 1. 本文针对 ${topic.coreTheme} 进行了全方位晚高峰真机测速与技术拆解。
> 2. 推荐选择具备 IEPL 物理专线大厂，彻底告别晚高峰国际出口拥堵与丢包。
> 3. 支持全平台客户端一键导入配置。

## 2026 优质稳定翻墙机场速查表

| 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 官网直达 |
| :--- | :--- | :--- | :---: | :---: |
${PARTNER_BRANDS.map((b) => `| **${b.name}** | ${b.lineType} | **${b.price}** | \`${b.coupon}\` (${b.discount}) | [官网注册 ↗](${b.url}) |`).join("\n")}

## 权威评测推荐
- 🏆 **2026 翻墙机场权威排行榜**：[2026 优质专线机场与 IPLC 节点评测榜单速查](/recommend/airport/)
`;
	} else {
		const prompt = buildMasterPrompt(topic);
		console.log("📝 正在向 Gemini 提交深度内容架构指令...");
		const rawText = await callGeminiApi(prompt);

		// 清理可能被额外包裹的 ```markdown ... ```
		markdownContent = rawText
			.replace(/^```markdown\s*/i, "")
			.replace(/^```\s*/i, "")
			.replace(/```\s*$/i, "")
			.trim();
	}

	// 写入目标文件
	const postDir = path.dirname(targetFile);
	if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

	fs.writeFileSync(targetFile, markdownContent, "utf8");
	console.log(`\n🎉 文章成功写入: ${targetFile}`);

	// 记录已发布日志 (dry-run 模式下不记录)
	if (!isDryRun) {
		const log = getPublishedLog();
		log.push({
			slug: topic.slug,
			title: topic.title,
			date: new Date().toISOString(),
			category: topic.category,
		});
		savePublishedLog(log);
		console.log("✓ 发布日志已更新至 published-topics.json");
	} else {
		console.log("🔍 [Dry-Run] 已跳过更新 published-topics.json");
	}
	console.log("\n=======================================================");
	console.log("✅ 全自动 SEO 专题生成完成！");
	console.log("=======================================================\n");
}

main().catch((err) => {
	console.error("\n❌ 生成流程失败:", err.message);
	process.exit(1);
});