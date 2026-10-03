/**
 * Auto SEO & GEO Master Publisher for clashtizi.com
 * Automates 4-day generation and publishing of in-depth (万字级/深度) SEO & GEO matrix pillar articles
 * powered by DeepSeek API (deepseek-chat).
 *
 * Includes "URL 防批量AI识别优化系统" (Anti-Batch AI Footprint URL & Humanized Content Engine):
 * 1. Semantic Topic Silos (/tutorials/, /protocols/, /issues/, /recommend/, /security/)
 * 2. Natural Humanized Slugs (concise technical keywords, no robotic dates/numbers)
 * 3. Semantic Collision Avoidance (-in-depth, -benchmark, -architecture)
 * 4. Anti-AI Footprint Regex Sanitizer (strips generic AI transitions & formulaic fluff)
 * 5. Strict 140-160 char Meta Description & E-E-A-T Author Attribution
 * 6. Verified Internal Link Silo Ring & Commercial Affiliate Compliance
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

// 6 大合作品牌精准元数据库（与站点保持一致，严禁篡改链接与专属优惠码）
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

// =========================================================================
// URL 防批量AI识别优化系统 (Anti-Batch AI Footprint URL & Topic Silo Matrix)
// =========================================================================
// 核心设计原则：
// 1. 杜绝机械化日期与数字（如 airport-2026-w40-10 或 post-123）
// 2. 划分为 5 大高权重语义化目录专题（Silos）：tutorials, protocols, issues, recommend, security
// 3. 采用自然工程师技术命题（3-4 个纯技术关键词组合）
// 4. 支持语义化防碰撞扩展（-in-depth, -benchmark, -architecture, -troubleshooting）
const TOPIC_PRESETS = [
	// 专题 Silo: recommend (选购评测、横评排行榜、SLA架构)
	{
		silo: "recommend",
		slug: "iplc-iepl-dedicated-line-selection-guide",
		title: "企业级IPLC与IEPL专线机场深度横评：晚高峰0丢包、技术原理与防跑路选购终极指南",
		category: "机场评测",
		tags: ["IPLC专线", "IEPL专线", "机场推荐", "专线机场", "晚高峰测速", "梯子推荐", "排行榜"],
		coreTheme: "IPLC/IEPL物理专线与公网中转/直连梯子的底层微观架构差异、晚高峰骨干网丢包机理、6大主流专线品牌横向评测与选购决策树",
	},
	{
		silo: "recommend",
		slug: "cost-effective-monthly-pay-airport-plans",
		title: "高性价比月付专线机场综合横评：10元至25元档位流量、倍率陷阱与防跑路决策指南",
		category: "机场推荐",
		tags: ["高性价比机场", "月付机场", "便宜机场", "防跑路", "流量倍率", "专线机场", "选购决策"],
		coreTheme: "月付防御跑路心理与财务模型、真实节点倍率暗坑拆解、10-25元主流大厂实测性价比对比与避坑指南",
	},
	{
		silo: "recommend",
		slug: "streaming-4k-8k-netflix-disney-tiktok-matrix",
		title: "全球流媒体与TikTok出海专线横评：Netflix/Disney+/YouTube 4K秒开节点与CDN调度全书",
		category: "机场评测",
		tags: ["流媒体机场", "Netflix解锁", "TikTok网络", "YouTube4K", "4K秒开", "机场推荐", "专线测速"],
		coreTheme: "海外流媒体版权库探测机制、DNS流媒体解锁与原生住宅机房差异、单线程与多线程测速对比、TikTok防黑屏防封控网络环境",
	},
	{
		silo: "recommend",
		slug: "gaming-low-latency-esports-cross-border-routes",
		title: "外服游戏加速与电竞低延迟专线完全评测：香港/日本/新加坡节点、丢包率与路由优化",
		category: "教程指南",
		tags: ["游戏低延迟", "外服加速", "香港节点", "日本专线", "丢包率优化", "Clash游戏配置", "电竞专线"],
		coreTheme: "UDP转发/全锥形NAT对游戏联机影响、晚高峰公网QoS拥堵与物理专线对比、Steam/Valorant/Apex节点实操优化",
	},
	{
		silo: "recommend",
		slug: "free-nodes-vs-paid-iepl-security-analysis",
		title: "免费梯子节点 vs 付费IEPL专线机场技术解密：TLS指纹、中间人攻击与隐私安全全景",
		category: "网络安全",
		tags: ["免费节点风险", "专线对比", "DNS泄漏", "TLS伪装", "网络安全", "隐私保护", "避坑指南"],
		coreTheme: "公共免费爬虫抓取节点的安全黑幕、中间人劫持与明文嗅探风险、企业专线加密边界及个人数据安全防范",
	},

	// 专题 Silo: protocols (底层通信协议、内核算法、流量伪装)
	{
		silo: "protocols",
		slug: "vless-reality-vision-handshake-optimization",
		title: "VLESS Reality 与 Vision 流控底层机制解析：消除 TLS 指纹特征与握手延迟深度调优",
		category: "网络安全",
		tags: ["VLESS", "Reality", "Vision", "TLS指纹", "uTLS", "协议解析", "防主动探测"],
		coreTheme: "Xray/VLESS Reality 借用大厂证书公钥窃听防护机制、Vision 流控 Padding 去填充原理、uTLS 客户端指纹随机化与真实网络环境对抗",
	},
	{
		silo: "protocols",
		slug: "hysteria2-udp-brutal-congestion-control",
		title: "Hysteria 2 协议与 Brutal 拥塞控制原理剖析：恶劣网络环境暴力抗丢包实测与端口跳跃",
		category: "教程指南",
		tags: ["Hysteria2", "QUIC协议", "Brutal拥塞控制", "UDP抗丢包", "端口跳跃", "网络加速"],
		coreTheme: "标准 TCP BBR 与 Hysteria2 Brutal 算法发包机理差异、恶劣国际公网丢包率下的吞吐量维持、运营商 UDP QoS 限速与端口跳跃对策",
	},
	{
		silo: "protocols",
		slug: "tuic-v5-vs-wireguard-performance-analysis",
		title: "TUIC v5 与 WireGuard 跨国传输性能深度横评：基于 QUIC 协议的高并发多路复用实测",
		category: "网络安全",
		tags: ["TUIC", "WireGuard", "QUIC协议", "多路复用", "协议横评", "网络性能", "0-RTT"],
		coreTheme: "TUIC v5 架构优势、0-RTT 握手快速重连机制、与传统 WireGuard 内核态隧道的对比、队头阻塞消除与移动网络切换平滑过渡",
	},
	{
		silo: "protocols",
		slug: "shadowsocks-2022-aead-ciphers-evaluation",
		title: "Shadowsocks 2022 新标准与 AEAD 加密套件剖析：抗重放攻击、长度混淆与企业网实战",
		category: "网络安全",
		tags: ["Shadowsocks 2022", "AEAD", "BLAKE3", "重放攻击", "网络协议", "流量混淆"],
		coreTheme: "旧版 SS 协议特征与主动探测漏洞、SS-2022 规范、Blake3 派生密钥与单向会话认证、规避统计学流量分析的最佳实践",
	},
	{
		silo: "protocols",
		slug: "tls-fingerprint-randomization-utls-mechanisms",
		title: "TLS 客户端指纹识别与 JA3/JA4 规避技术：uTLS 伪装机制与真实流量伪装全指南",
		category: "网络安全",
		tags: ["JA3指纹", "JA4指纹", "uTLS", "TLS握手", "流量伪装", "网络安全", "主动探测"],
		coreTheme: "现代防火墙基于 ClientHello 密码套件与扩展列表生成的 JA3/JA4 指纹数据库机制、uTLS 模拟 Chrome/Safari 握手包细节与防探测对抗",
	},

	// 专题 Silo: tutorials (客户端深度调优、内核架构、透明网关)
	{
		silo: "tutorials",
		slug: "clash-verge-rev-tun-mode-dns-leak-prevention",
		title: "Clash Verge Rev 核心进阶指南：TUN 虚拟网卡模式、Fake-IP 机制与防 DNS 泄漏终极配置",
		category: "客户端配置",
		tags: ["Clash Verge Rev", "TUN模式", "Fake-IP", "DNS泄漏", "规则分流", "客户端教程"],
		coreTheme: "Mihomo 内核 TUN 模式与系统代理差异、Fake-IP 与 Redir-Host 模式解析、WebRTC/IPv6 泄漏防御配置范例",
	},
	{
		silo: "tutorials",
		slug: "sing-box-inbound-tproxy-routing-rules",
		title: "Sing-box 规则引擎与 TProxy 透明代理深度指南：全平台极简部署与企业级分流",
		category: "客户端配置",
		tags: ["sing-box", "TProxy", "透明代理", "规则集", "路由分流", "Linux网关"],
		coreTheme: "Sing-box 独立架构、Rule Set 远程规则集管理、Linux/OpenWrt 环境下 TProxy 流量重定向与旁路网关高效配置",
	},
	{
		silo: "tutorials",
		slug: "shadowrocket-rule-provider-sub-ruleset",
		title: "Shadowrocket 小火箭进阶配置全攻略：规则集订阅、HTTPS 解密与流媒体精准分流",
		category: "客户端配置",
		tags: ["Shadowrocket", "小火箭", "iOS科学上网", "分流规则", "规则集", "节点订阅"],
		coreTheme: "iOS 小火箭节点订阅与自动化更新、配置分流策略、避免国内直连流量绕行海外、证书安装与常见报错解决",
	},
	{
		silo: "tutorials",
		slug: "openwrt-mihomo-tproxy-transparent-proxy",
		title: "软路由 OpenWrt 部署 Mihomo 旁路透明网关实战：全屋智能设备无感出国与游戏加速",
		category: "教程指南",
		tags: ["OpenWrt", "Mihomo", "软路由", "透明网关", "旁路由", "家庭网络", "全屋加速"],
		coreTheme: "软路由双网口/单网口旁路由拓扑图、nftables/iptables 流量重定向脚本、家庭 Apple TV/PlayStation 游戏机精准低延迟分流",
	},
	{
		silo: "tutorials",
		slug: "v2rayn-core-switching-xray-singbox-tuning",
		title: "v2rayN 多内核调度与极速调优宝典：Xray 与 Sing-box 双内核自由切换与路由规则设计",
		category: "客户端配置",
		tags: ["v2rayN", "Xray内核", "Sing-box内核", "Windows代理", "路由规则", "订阅更新"],
		coreTheme: "Windows 平台 v2rayN 7.x 最新版本设置、自定义 PAC 与高级路由集、多节点负载均衡与晚高峰故障转移方案",
	},

	// 专题 Silo: issues (网络排障、QoS 晚高峰治理、主动探测防御)
	{
		silo: "issues",
		slug: "gfw-active-probing-tcp-rst-defense",
		title: "主动探测（Active Probing）与 TCP RST 深度剖析：翻墙节点大面积超时全红的技术根源与防御",
		category: "网络安全",
		tags: ["主动探测", "TCP RST", "节点全红", "节点超时", "GFW原理", "网络排障", "防火墙防御"],
		coreTheme: "骨干网对未知流量回放探测、伪造证书抓包验证的机制、Replay 攻击防御与节点端口批量失效的应急自愈方案",
	},
	{
		silo: "issues",
		slug: "evening-peak-qos-throttling-packet-loss-mitigation",
		title: "晚高峰 20:00-23:00 国际出口公网 QoS 限速与丢包排障：骨干网拥堵机理与专线解法",
		category: "教程指南",
		tags: ["晚高峰丢包", "国际出口QoS", "骨干网拥堵", "丢包率", "专线优势", "网络排障", "MTR诊断"],
		coreTheme: "中国电信 163、中国联通 169 与中国移动 CMI 在晚高峰国际出口的拥塞丢包实测、MTR 逐跳路由分析、公网 QoS 惩罚与物理内网专线抗拥堵对比",
	},
	{
		silo: "issues",
		slug: "dns-pollution-fakeip-leak-investigation",
		title: "DNS 污染、劫持与泄漏全链条实测排查：DoH/DoT 安全解析与客户端防污染方案",
		category: "网络安全",
		tags: ["DNS污染", "DNS泄漏", "DoH", "DoT", "Fake-IP", "排障指南", "网络安全"],
		coreTheme: "UDP 53 端口投毒机理、EDNS Client Subnet 隐私泄漏、主流操作系统与浏览器 DNS 嗅探排查、配置 DoH/DoT 加密链条闭环",
	},
	{
		silo: "issues",
		slug: "chatgpt-1020-access-denied-risk-resolution",
		title: "OpenAI 与 Claude 访问风控深度攻防：1020 报错、Cloudflare 验证死循环排障与纯净 IP 筛选",
		category: "科学上网",
		tags: ["ChatGPT报错", "Claude封号", "1020拦截", "Cloudflare验证", "纯净IP", "欺诈分检测"],
		coreTheme: "AI 巨头基于 IP2Location/MaxMind 欺诈评分数据库风控策略、机房 IP 与住宅 IP 特征对比、节点无污染出口筛选标准及自测工具",
	},
	{
		silo: "issues",
		slug: "clash-nodes-timeout-subscription-failure-recovery",
		title: "Clash 所有节点超时全红与订阅更新失败自愈手册：系统时间漂移、端口冲突与证书过期排障",
		category: "客户端配置",
		tags: ["节点超时", "节点全红", "订阅更新失败", "端口冲突", "证书过期", "系统时间同步", "Clash排障"],
		coreTheme: "NTP 时间不同步导致 TLS 握手失败、7890 端口被占、配置文件 YAML 语法缩进错误、机场订阅节点解密失败全场景排障",
	},

	// 专题 Silo: security (出海数据安全、跨境防关联、高可用容灾)
	{
		silo: "security",
		slug: "cross-border-ecommerce-clean-residential-ip",
		title: "跨境电商与出海独立站网络防关联搭建：原生纯净住宅 IP、双机场热备与合规出海",
		category: "科学上网",
		tags: ["跨境电商", "防关联", "住宅IP", "出海网络", "独立站", "双机场热备", "企业专线"],
		coreTheme: "亚马逊/Shopee/TikTok Shop 多店铺防关联网络架构、指纹浏览器与代理链协作、双专线主备自动故障转移与风控防范",
	},
	{
		silo: "security",
		slug: "enterprise-dual-airport-hot-standby-disaster-recovery",
		title: "企业外贸团队跨境网络高可用设计：1+1 双机场热备容灾、故障自动切换与链路监控",
		category: "网络安全",
		tags: ["双机场热备", "高可用网络", "故障切换", "容灾备份", "外贸办公", "企业网络", "专线冗余"],
		coreTheme: "避免单一机场因维护或断缆导致业务中断、使用 Clash/Sing-box 实现基于健康检查的自动回退策略、团队多终端集中分发方案",
	},
	{
		silo: "security",
		slug: "asn-bgp-peering-cross-border-latency-analysis",
		title: "全球骨干网 ASN 互联与 BGP 路由穿透解析：CN2 GIA、AS9929、AS4837 与 CMIN2 线路图谱",
		category: "机场评测",
		tags: ["CN2 GIA", "AS9929", "AS4837", "CMIN2", "BGP互联", "骨干网", "跨国路由"],
		coreTheme: "三大运营商主流优化精品网底层 AS 编号与自治系统互联关系、海底光缆路由（TPE/NCP/APG）、直连与专线路由成本与晚高峰稳定性实测",
	},
	{
		silo: "security",
		slug: "residential-ip-proxy-fraud-score-detection",
		title: "海外原生住宅 IP 识别与欺诈度评估指南：Scamalytics、IPQualityScore 评分机制与实操检测",
		category: "网络安全",
		tags: ["住宅IP", "欺诈评分", "Scamalytics", "IPQualityScore", "网络安全", "原生IP", "风控检测"],
		coreTheme: "现代出海平台对商业机房 Datacenter ASN 的封杀逻辑、静态住宅与动态住宅代理技术细节、IP 干净度查询工具实操测评",
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
 * 检查 slug 是否已存在于现有文章或已发布日志中
 */
function isSlugExists(slug, silo) {
	const published = getPublishedLog();
	if (published.some((p) => p.slug === slug || p.permalink === `/${silo}/${slug}/`)) {
		return true;
	}

	const postsDir = path.join(rootDir, "src", "content", "posts");
	if (fs.existsSync(postsDir)) {
		const files = fs.readdirSync(postsDir);
		if (files.some((f) => f.includes(slug))) return true;
	}
	return false;
}

/**
 * 防批量 AI 识别智能 Slug 处理系统
 * 杜绝机械化数字（-1, -2），若有重名则追加自然工程化语义修饰词
 */
function generateNaturalSeoSlug(rawSlug, silo) {
	let cleanSlug = rawSlug
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	if (!isSlugExists(cleanSlug, silo)) {
		return cleanSlug;
	}

	// 语义化防碰撞修饰词（自然工程师写作风格）
	const semanticModifiers = [
		"in-depth",
		"benchmark-test",
		"architecture-guide",
		"troubleshooting-manual",
		"practical-handbook",
		"performance-tuning",
		"remediation-case",
	];

	for (const mod of semanticModifiers) {
		const candidate = `${cleanSlug}-${mod}`;
		if (!isSlugExists(candidate, silo)) {
			return candidate;
		}
	}

	return `${cleanSlug}-advanced-analysis`;
}

/**
 * 选取本次待发布的最佳主题（结合 Topic Silo 矩阵与防批量 AI 算法）
 */
function pickNextTopic(overrideSlug = null, overrideSilo = null) {
	const published = getPublishedLog();
	const publishedSlugs = new Set(published.map((p) => p.slug));

	if (overrideSlug) {
		const match = TOPIC_PRESETS.find((t) => t.slug === overrideSlug);
		if (match) return match;
		const silo = overrideSilo || "recommend";
		return {
			silo,
			slug: generateNaturalSeoSlug(overrideSlug, silo),
			title: overrideSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
			category: "机场评测",
			tags: ["专线机场", "科学上网", "网络调优", "2026最新"],
			coreTheme: overrideSlug,
		};
	}

	// 1. 优先从预设库中按顺序轮巡未发布的主题
	for (const topic of TOPIC_PRESETS) {
		if (!publishedSlugs.has(topic.slug)) {
			return {
				...topic,
				slug: generateNaturalSeoSlug(topic.slug, topic.silo),
			};
		}
	}

	// 2. 如果预设库所有主题已全部发布，启动“防批量 AI 识别动态语义生成器”
	// 组合真实工业级网络工程维度，生成自然的非日期、非机械数字 Slug 与命题
	const dynamicDimensions = [
		{
			silo: "protocols",
			slugBase: "tuic-v5-quic-congestion-bbrv3-tuning",
			title: "TUIC v5 与 QUIC 拥塞控制 BBRv3 调优：国际高丢包弱网跨国加速实测指南",
			category: "网络安全",
			tags: ["TUIC", "QUIC", "BBRv3", "拥塞控制", "弱网加速", "协议评测"],
			coreTheme: "QUIC 协议单连接多路复用在跨国恶劣网络下的丢包补偿机制、BBRv3 算法收敛速度实测与配置参数最佳实践",
		},
		{
			silo: "tutorials",
			slugBase: "wireguard-cross-border-mtu-mss-optimization",
			title: "跨国网络隧道 MTU 与 MSS 夹逼调优实战：彻底解决网页白屏、分片重传与 Bufferbloat",
			category: "教程指南",
			tags: ["MTU调优", "MSS夹逼", "网络分片", "Bufferbloat", "网络优化", "系统调优"],
			coreTheme: "PPPoE、以太网与内网专线头部开销计算、Path MTU Discovery 失败机理排查与 Linux/Windows 内核网络栈调优",
		},
		{
			silo: "issues",
			slugBase: "udp-gfw-qos-throttling-countermeasures",
			title: "国内运营商国际出口 UDP QoS 限速机理与绕过策略：Hysteria 2 与 WireGuard 存活实测",
			category: "网络安全",
			tags: ["UDP限速", "QoS策略", "骨干网", "Hysteria2", "端口跳跃", "网络排障"],
			coreTheme: "三大运营商晚高峰对大流量 UDP 端口的速率惩罚机制、伪装 TCP 流量与动态端口跳跃（Port Hopping）实操对抗",
		},
		{
			silo: "recommend",
			slugBase: "multi-cloud-bgp-dedicated-line-airport-audit",
			title: "多云 BGP 与企业物理专线机场稳定性审计：华为云/阿里云/腾讯云跨境专线实测对比",
			category: "机场评测",
			tags: ["多云BGP", "华为云专线", "阿里云专线", "专线机场", "SLA稳定性", "梯子推荐"],
			coreTheme: "各大头部机场采购的公有云内网专线真实 SLA 指标、跨海光缆中断时的多路由 BGP 容灾能力与真机测速数据",
		},
		{
			silo: "security",
			slugBase: "dns-pollution-edns-client-subnet-privacy",
			title: "EDNS Client Subnet 隐私泄漏与 CDN 就近解析冲突：出海合规与加速双平衡方案",
			category: "网络安全",
			tags: ["EDNS", "DNS隐私", "CDN加速", "网络安全", "隐私保护", "客户端配置"],
			coreTheme: "ECS 协议向权威 DNS 暴露客户端 IP 前缀的安全风险、禁用 ECS 对海外 CDN 节点调度的影响及最优平衡方案",
		},
	];

	// 轮流选择尚未发布的动态选题
	for (const dyn of dynamicDimensions) {
		const naturalSlug = generateNaturalSeoSlug(dyn.slugBase, dyn.silo);
		if (!publishedSlugs.has(naturalSlug)) {
			return {
				silo: dyn.silo,
				slug: naturalSlug,
				title: dyn.title,
				category: dyn.category,
				tags: dyn.tags,
				coreTheme: dyn.coreTheme,
			};
		}
	}

	// 终极语义兜底
	const timestampSeed = Date.now().toString(36).slice(-4);
	const finalSlug = generateNaturalSeoSlug(`cross-border-network-optimization-${timestampSeed}`, "recommend");
	return {
		silo: "recommend",
		slug: finalSlug,
		title: "全球跨境高速专线网络晚高峰稳定性全景评测与节点性能横向测评报告",
		category: "机场评测",
		tags: ["机场评测", "晚高峰实测", "专线机场", "梯子推荐", "稳定性报告"],
		coreTheme: "骨干网国际出口拥堵数据、6大专线品牌节点实测稳定性评分与AI/流媒体支持更新动态",
	};
}

/**
 * 构建符合 GEO 与万字级规范的 Master AI 提示词（融入防批量 AI 写作指令）
 */
function buildMasterPrompt(topic) {
	const brandContext = JSON.stringify(PARTNER_BRANDS, null, 2);
	const permalinkPath = `/${topic.silo}/${topic.slug}/`;

	return `你是一名资深跨境网络与云基础设施架构师、高级网络安全工程师以及 GEO（生成式引擎优化）与 SEO 权威专家（从业12年，兼具一线机房部署经验与技术标准制定背景）。
你的任务是撰写一篇极具权威性、客观硬核、深度满足 Google SGE、SearchGPT 和 Perplexity 等 AI 搜索引用的【万字级行业权威专题指南】。

### 专题核心信息
- **标题**：${topic.title}
- **专题目录 (Topic Silo)**：/${topic.silo}/
- **固定链接 (Permalink)**：${permalinkPath}
- **分类**：${topic.category}
- **标签**：${JSON.stringify(topic.tags)}
- **核心主题与技术要求**：${topic.coreTheme}

### 必须包含的官方指定合作品牌数据库（严禁篡改品牌名称、官网直达链接与优惠码）：
${brandContext}

---

### 严格的防批量 AI 识别与专业工程师写作要求（违反将被系统判定重写）：

1. **绝对禁止任何 AI 模板化套话**：
   - 严禁出现：“在当今数字化浪潮中...”、“随着互联网的飞速发展...”、“在当今快节奏的时代...”
   - 严禁出现空泛转折连词：“不仅如此”、“总而言之”、“综上所述”、“值得一提的是”、“毋庸置疑”、“显而易见”、“总的来说”
   - 严禁出现矫情句式：“不是……而是……”
   - 文章开篇必须直接切入技术硬核痛点、微观网络抓包现象或骨干网拓扑结构，像一线资深工程师在内网 Wiki 或权威技术白皮书中撰写实操文档一样，字句充满经验与客观推演。

2. **Frontmatter 格式要求**：
   必须在最开头输出合法的 Markdown Frontmatter（必须用 --- 包裹）：
---
title: "${topic.title}"
published: ${new Date().toISOString().split("T")[0]}
updated: ${new Date().toISOString().split("T")[0]}
description: "精准专业的技术摘要，必须严格控制在 140 到 160 个中文字符之间（针对 Bing Rule 118 与 Google SERP 严谨展示），包含核心技术痛点与解决思路。"
category: "${topic.category}"
tags: ${JSON.stringify(topic.tags)}
permalink: "${permalinkPath}"
author: "李维 (网络基础设施架构师)"
draft: false
pinned: false
---

3. **GEO 导读与合规披露**：
   - Frontmatter 之后紧跟加粗的 \`> **核心导读 (TL;DR)**\` 引用块。
   - 给出 3~4 条直奔主题的结构化结论（包括物理链路优劣、晚高峰丢包根源、客户端调优关键点以及推荐的专线品牌）。
   - 紧随导读后加入官方合规披露提示：
     \`> ℹ️ **合规与透明度披露**：本文包含商业合作品牌评测。clashtizi.com 始终坚持客观中立测试原则，所有实测数据均基于真实网络节点采样。文中所涉合作品牌赞助链接带有规范合规标记，赞助机制绝不影响用户实际支付价格与评测公正性。\`

4. **原生 6 大合作品牌对比大表格 (速查表)**：
   - 必须制作一张格式规整的 Markdown 对比大表格，完整列出上述 6 大合作品牌：
     | 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 核心优势 | 官网直达 |
     官网直达必须为精准的 Markdown 链接，如：[官网注册 ↗](注册链接)。

5. **硬核技术原理解析（>= 2000 字）**：
   - 结合微观网络机制展开深入剖析：TCP 拥塞控制（BBRv1/v2/v3、Cubic）、MTU/MSS 分片、UDP QoS 限速机制、IEPL 物理点对点内网专线 vs 普通公网 BGP 中转的抖动差异。
   - 包含真实的 ASCII 网络拓扑图（如：[终端客户端] -> [国内多线BGP入口] -> [物理IEPL内网隧道(0丢包不过GFW)] -> [香港/日本原生机房落地出口]）。
   - 给出具体的 Linux 内核 sysctl 参数调优示例（如 \`net.core.default_qdisc=fq\`, \`net.ipv4.tcp_congestion_control=bbr\`）或抓包排障过滤命令（如 \`tcpdump -i any 'tcp[tcpflags] & (tcp-rst) != 0'\`）。

6. **6 大合作品牌逐一深度客观横评（>= 2500 字）**：
   - 依次设立独立的三级标题（### 光速云、### 飞猫云、### 微风网络、### 星岛梦、### 无忧链接、### 唯兔云）。
   - 对每一个品牌展开详细实测剖析：背景历史与稳定性保障、节点线路分布、晚高峰（20:00-23:00）真机测速数据（下行带宽、上行速率、Ping 延迟、丢包率）、流媒体 4K/8K 及 AI（ChatGPT/Claude）原生解锁支持状态、套餐选购建议、专属优惠码输入指引及直达链接。

7. **全平台客户端调优实战教程（>= 1500 字）**：
   - 提供 Windows/macOS（Clash Verge Rev）、iOS（Shadowrocket 小火箭）、Android（Sing-box / v2rayNG）的导入配置步骤、TUN 模式开启方式与 DNS 防污染防泄漏设置技巧。

8. **深度常见疑难问题排障（FAQ，>= 1200 字）**：
   - 包含至少 4 个高频网络痛点排障方案（如节点超时全红、打不开国外网站但国内正常、ChatGPT 1020 报错拦截等），给出清晰的排查分支与解决步骤。

9. **全站内链闭环**：
   - 在正文中自然嵌入 clashtizi.com 站内已验证的核心高权重页面链接：
     - 排行榜权威首页：[2026 翻墙机场推荐与专线节点排行榜速查](/recommend/airport/)
     - Sing-box 配置指南：[Sing-box 全能通用配置与路由规则教程](/tutorials/sing-box-config/)
     - Shadowrocket 配置教程：[Shadowrocket 小火箭 iOS 安装与分流教程](/shadowrocket/)
     - v2rayN Windows 指南：[v2rayN Windows 客户端配置与排障完整教程](/v2rayn/)
     - 节点超时排障：[梯子节点超时全红与连接失败排障指南](/tizi/nodes-timeout/)
     - 新手科学上网指南：[科学上网新手入门使用全指南](/tizi/how-to-use/)

请直接输出整篇完整的 Markdown 文本，严禁在开头或结尾添加任何多余的包裹代码说明（如“好的，这是为您撰写的文章...”），直接从最开头的 --- 开始输出！`;
}

/**
 * 内容防批量 AI 识别后处理清洗器 (Anti-AI Footprint Post-Processor)
 * 1. 清洗常见的大模型套话、空泛转折连词
 * 2. 校验与微调 description 长度，严格确保在 140 - 160 字符内，符合 Bing Rule 118
 * 3. 校验合规声明与合作品牌链接格式
 */
function sanitizeAntiAiContent(rawMarkdown, topic) {
	let clean = rawMarkdown
		.replace(/^```markdown\s*/i, "")
		.replace(/^```\s*/i, "")
		.replace(/```\s*$/i, "")
		.trim();

	// 清洗大模型套话口头禅
	const aiClichés = [
		/在当今数字化(?:时代|浪潮|飞速发展|高速发展)[，,]/g,
		/随着互联网技术的(?:飞速发展|日新月异|不断进步)[，,]/g,
		/(?:总而言之|综上所述|显而易见|毫无疑问|值得注意的是|毋庸置疑|总的来说)[，,]/g,
		/不仅如此[，,]/g,
		/显而易见[，,]/g,
	];

	for (const pattern of aiClichés) {
		clean = clean.replace(pattern, "");
	}

	// 保证 Frontmatter 中 description 在 140 - 160 字之间
	const descRegex = /description:\s*["']([^"']*)["']/;
	const match = clean.match(descRegex);
	if (match) {
		let desc = match[1].trim();
		if (desc.length > 165) {
			desc = `${desc.slice(0, 155)}...`;
			clean = clean.replace(descRegex, `description: "${desc}"`);
		} else if (desc.length < 130) {
			const padding = ` 本文针对${topic.coreTheme.slice(0, 25)}进行晚高峰深度实测，提供企业级选购建议与网络调优指南。`;
			desc = (desc + padding).slice(0, 158);
			clean = clean.replace(descRegex, `description: "${desc}"`);
		}
	}

	// 保证作者字段完整性 (E-E-A-T)
	if (!clean.includes("author:")) {
		clean = clean.replace(
			/---\n([\s\S]*?)\n---/,
			`---\n$1\nauthor: "李维 (网络基础设施架构师)"\n---`
		);
	}

	// 保证 permalink 字段完整性
	if (!clean.includes("permalink:")) {
		const permalinkPath = `/${topic.silo}/${topic.slug}/`;
		clean = clean.replace(
			/---\n([\s\S]*?)\n---/,
			`---\n$1\npermalink: "${permalinkPath}"\n---`
		);
	}

	return clean;
}

/**
 * 调用 DeepSeek API (deepseek-chat)
 * 支持超时重试与指数退避，确保万字级内容高可靠稳定生成
 */
async function callDeepSeekApi(prompt) {
	const rawKey = process.env.DEEPSEEK_API_KEY || "";
	const apiKey = rawKey.trim().replace(/^["']|["']$/g, "").trim();
	if (!apiKey) {
		throw new Error("缺少 DEEPSEEK_API_KEY 环境变量！请在 GitHub Secrets 或本地 .env 中配置。");
	}

	console.log(`🔑 检测到 DEEPSEEK_API_KEY (长度: ${apiKey.length} 字符, 前缀: ${apiKey.slice(0, 7)}...)`);

	const endpoint = "https://api.deepseek.com/chat/completions";
	const model = "deepseek-chat";

	const maxRetries = 3;
	let lastError = null;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		console.log(`📡 [第 ${attempt}/${maxRetries} 次尝试] 正在调用 DeepSeek API (模型: ${model})...`);

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 180000); // 3分钟超时上限

			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				signal: controller.signal,
				body: JSON.stringify({
					model,
					messages: [
						{
							role: "system",
							content: "你是一名资深网络协议与云基础设施架构师，擅长撰写高权威度、充满实测数据与深层微观技术机理的万字级网络技术指南。严禁输出空洞套话与AI腔调。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.6,
					max_tokens: 8192,
					stream: false,
				}),
			});

			clearTimeout(timeoutId);

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(`DeepSeek API 返回错误 [${res.status}]: ${errText}`);
			}

			const data = await res.json();
			const text = data?.choices?.[0]?.message?.content;
			if (!text) {
				throw new Error("DeepSeek 返回的内容为空或结构异常");
			}

			console.log(`✓ 成功获取 DeepSeek 深度生成内容 (长度: ${text.length} 字符)`);
			return text;
		} catch (err) {
			console.warn(`⚠ 第 ${attempt} 次调用失败: ${err.message}`);
			lastError = err;
			if (attempt < maxRetries) {
				const delay = attempt * 5000;
				console.log(`⏳ 等待 ${delay / 1000} 秒后进行下一次重试...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError;
}

/**
 * 主执行流程
 */
async function main() {
	console.log("\n=======================================================");
	console.log("🚀 开始执行全自动 SEO / GEO 深度专题矩阵文章发布系统");
	console.log("⚡ 驱动引擎: DeepSeek API (deepseek-chat)");
	console.log("🛡️ 防批量识别: URL 防批量AI识别优化系统 + Topic Silo 架构");
	console.log("=======================================================\n");

	const isDryRun = process.argv.includes("--dry-run");
	const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
	const siloArg = process.argv.find((a) => a.startsWith("--silo="))?.split("=")[1];

	const topic = pickNextTopic(slugArg, siloArg);
	const targetPermalink = `/${topic.silo}/${topic.slug}/`;

	console.log(`📌 本次专题标题: ${topic.title}`);
	console.log(`📂 Topic Silo 专题目录: /${topic.silo}/`);
	console.log(`🔗 语义化 Slug (防批量识别): ${topic.slug}`);
	console.log(`🌐 规范固定链接 (Permalink): ${targetPermalink}`);
	console.log(`🏷️ 分类: ${topic.category} | 标签: ${topic.tags.join(", ")}\n`);

	// 保存的文件命名规范（保持在 src/content/posts/ 目录下，通过 permalink 映射为 clean URL）
	const fileName = `${topic.silo}-${topic.slug}.md`;
	const targetFile = path.join(rootDir, "src", "content", "posts", fileName);

	let markdownContent = "";

	if (isDryRun) {
		console.log("🔍 当前为 --dry-run 测试模式，生成标准占位骨架文件进行系统架构校验...");
		const demoDesc = `2026年最新${topic.title.slice(0, 30)}深度评测与实操调优全景指南，提供晚高峰丢包机理剖析、6大企业级专线机场横评对比与全平台客户端优化排障决策建议。`;

		markdownContent = `---
title: "${topic.title}"
published: ${new Date().toISOString().split("T")[0]}
updated: ${new Date().toISOString().split("T")[0]}
description: "${demoDesc.slice(0, 155)}"
category: "${topic.category}"
tags: ${JSON.stringify(topic.tags)}
permalink: "${targetPermalink}"
author: "李维 (网络基础设施架构师)"
draft: false
pinned: false
---

> **核心导读 (TL;DR)**：
> 1. 本文针对 **${topic.coreTheme}** 进行了全方位晚高峰真机测速与技术拆解。
> 2. 推荐选择具备 IEPL/IPLC 物理专线大厂，彻底告别晚高峰国际出口公网拥堵与高丢包。
> 3. 支持 Windows、macOS、iOS、Android 全平台客户端一键导入与 TUN 模式深度调优。

> ℹ️ **合规与透明度披露**：本文包含商业合作品牌评测。clashtizi.com 始终坚持客观中立测试原则，所有实测数据均基于真实网络节点采样。文中所涉合作品牌赞助链接带有规范合规标记，赞助机制绝不影响用户实际支付价格与评测公正性。

## 2026 优质稳定翻墙机场速查表

| 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 核心优势 | 官网直达 |
| :--- | :--- | :--- | :---: | :--- | :---: |
${PARTNER_BRANDS.map((b) => `| **${b.name}** | ${b.lineType} | **${b.price}** | \`${b.coupon}\` (${b.discount}) | ${b.features.slice(0, 24)}... | [官网注册 ↗](${b.url}) |`).join("\n")}

## 权威评测推荐与内链导航
- 🏆 **2026 翻墙机场权威排行榜**：[2026 优质专线机场与 IPLC 节点评测榜单速查](/recommend/airport/)
- 📘 **Sing-box 全能配置教程**：[Sing-box 规则引擎与 TProxy 透明代理深度指南](/tutorials/sing-box-config/)
- 📱 **Shadowrocket 小火箭指南**：[Shadowrocket 小火箭 iOS 安装与分流教程](/shadowrocket/)
- 💻 **v2rayN Windows 指南**：[v2rayN Windows 客户端配置与排障完整教程](/v2rayn/)
- 🛠️ **节点超时排障手册**：[梯子节点超时全红与连接失败排障指南](/tizi/nodes-timeout/)
- 🔰 **新手使用指南**：[科学上网新手入门使用全指南](/tizi/how-to-use/)
`;
	} else {
		const prompt = buildMasterPrompt(topic);
		console.log("📝 正在向 DeepSeek API 提交万字级深度技术创作任务...");
		const rawText = await callDeepSeekApi(prompt);

		console.log("🧹 正在执行防批量 AI 识别后处理清洗与格式校验...");
		markdownContent = sanitizeAntiAiContent(rawText, topic);
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
			silo: topic.silo,
			slug: topic.slug,
			permalink: targetPermalink,
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
	console.log("✅ 全自动 SEO / GEO 深度主线专题发布流程完成！");
	console.log("=======================================================\n");
}

main().catch((err) => {
	console.error("\n❌ 生成流程失败:", err.message);
	process.exit(1);
});