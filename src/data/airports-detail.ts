export interface AirportPackage {
	name: string;
	cycle: string;
	price: string;
	traffic: string;
	trafficCycle: string;
}

export interface AirportBenchmarkRow {
	region: string;
	latencyMs: number;
	downloadMbps: number;
}

export type ServiceStatus = "supported" | "conditional" | "untested";

export interface AirportServiceCheck {
	name: string;
	status: ServiceStatus;
	note: string;
}

export interface AirportDetailRecord {
	slug: string;
	accentColor: string;
	seoTitle: string;
	seoDescription: string;
	h1: string;
	overviewConclusion: string;
	backgroundNote: string;
	packagesNote: string;
	packages: AirportPackage[];
	benchmarkLabel?: string;
	benchmarks?: AirportBenchmarkRow[];
	aiServices: AirportServiceCheck[];
	streamingServices: AirportServiceCheck[];
	topologySummary: string;
	suitableFor: string[];
	notSuitableFor: string[];
	risksAndLimits: string[];
	peerComparison: string;
	faqs: { q: string; a: string }[];
	relatedGuides: { title: string; url: string }[];
}

export const airportDetailsMap: Record<string, AirportDetailRecord> = {
	guangsuyun: {
		slug: "guangsuyun",
		accentColor: "#f59e0b",
		seoTitle: "光速云机场 2026 深度评测：IEPL双专线、99元年付/147永久套餐与三网实测图",
		seoDescription:
			"光速云机场客观评测：2020年老牌运营，采用华为云/企业级IEPL纯专线与内网双架构，附2026-08-11及08-19电信/联通/移动6张测速与解锁实测图、99元年付至147永久套餐明细与ChatGPT使用提示。",
		h1: "光速云机场 2026 深度评测：IEPL + 企业内网双专线架构与三网实测分析",
		overviewConclusion:
			"光速云（guangsu）自 2020 年稳定运营至今，是本站 42 家机场收录中实测证据最完整的老牌专线机场（共 6 张跨运营商测速与解锁截图）。其特点是兼顾 99 元/年轻量门槛与 147 元 247GB 永久不过期套餐，适合同时追求稳定专线、多端订阅导入与长周期性价比的用户；但需注意部分 AI 平台需手动切换香港或新加坡特定节点，且特殊一次性商品不支持退款。",
		backgroundNote:
			"品牌资料显示光速云部署了 IEPL 纯专线与企业级内网双线路架构，全节点支持 VLESS 协议，覆盖香港×20、台湾×5、日本×10、新加坡×10、美国×10、马来西亚×2 及英、法、德、土耳其、泰国、巴西等 11+ 国家地区机房，同时支持自研客户端与 Clash Verge Rev / Shadowrocket 等第三方订阅导入。",
		packagesNote: "以下套餐信息整理自品牌公开资料，实际活动折扣（优惠码 AMM 享半年9折/年付8折）以下单结算页面为准。",
		packages: [
			{ name: "光速云·轻量版", cycle: "年付", price: "¥99", traffic: "69GB", trafficCycle: "每月" },
			{ name: "光速云·致敬斯诺克147永久", cycle: "一次性付费", price: "¥147", traffic: "247GB", trafficCycle: "永久不过期" },
			{ name: "光速云·极速版", cycle: "月付", price: "¥25", traffic: "168GB", trafficCycle: "每月" },
			{ name: "光速云·流光版", cycle: "月付", price: "¥34", traffic: "268GB", trafficCycle: "每月" },
			{ name: "光速云·量子版", cycle: "月付", price: "¥68", traffic: "568GB", trafficCycle: "每月" },
			{ name: "光速云·无界版", cycle: "月付", price: "¥138", traffic: "900GB", trafficCycle: "每月" },
			{ name: "光速云·企业定制版", cycle: "月付", price: "¥680", traffic: "500GB", trafficCycle: "每月独享" },
		],
		benchmarkLabel: "2026-10-19 原文基准标注（非晚高峰参考）+ 2026-08-19 三网 2G/9G 实测附图",
		benchmarks: [
			{ region: "香港 IEPL", latencyMs: 22, downloadMbps: 529 },
			{ region: "台湾节点", latencyMs: 41, downloadMbps: 114 },
			{ region: "新加坡节点", latencyMs: 46, downloadMbps: 387 },
			{ region: "日本东京", latencyMs: 57, downloadMbps: 135 },
			{ region: "美国洛杉矶", latencyMs: 143, downloadMbps: 18 },
		],
		aiServices: [
			{ name: "ChatGPT / OpenAI", status: "conditional", note: "部分地区需切换特定节点，08-19 实测香港/新加坡全绿" },
			{ name: "Claude", status: "supported", note: "品牌资料与实测支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点国家而定" },
		],
		streamingServices: [
			{ name: "Netflix", status: "supported", note: "原生与非自制剧多区解锁" },
			{ name: "Disney+", status: "supported", note: "2026-08-19 电信/联通实测全绿" },
			{ name: "YouTube 4K/8K", status: "supported", note: "多区节点实测高吞吐" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注可用" },
		],
		topologySummary: "国内 BGP 多线入口 → IEPL 物理专线 + 企业内网双冗余传输 → 11+ 海外原生机房落地（FullCone NAT 支持）",
		suitableFor: [
			"希望优先选择 2020 年起长期运营、具备三网真实截图核验的主力用户",
			"需要 99 元/年入门或 147 元 247GB 永久不限时流量包作为低频主/备通道的用户",
			"习惯使用 Clash Verge Rev、Sing-box 或 iOS 小火箭自行配置规则分流的进阶用户",
		],
		notSuitableFor: [
			"对退款政策有无条件试用期待的用户（注意特殊永久/年付商品不支持退款）",
			"希望不手动切换节点即可保证任意地区 100% 稳定访问 Gemini/ChatGPT 的用户",
		],
		risksAndLimits: [
			"2026-08-11 测速截图反映单日测试节点环境，2026-08-19 三网图分别来自长沙电信@2G、广西移动@2G、河北联通@2G与珠海联通@9G，实际速率随用户本地晚高峰拥堵波动。",
			"美国节点在 10-19 基准中为 18Mbps，欧美大流量下载建议改用新加坡或日本节点。",
		],
		peerComparison:
			"对比星岛梦（同为 2020 年老牌），光速云在 99 元/年档给到 69GB/月（略多于星岛梦 96 元 60GB/月），且具备电信/移动/联通三网专项解锁实测截图；若偏爱纯月付灵活性，亦可与 20 元档暮光加速或二猫云交叉对比。",
		faqs: [
			{
				q: "光速云 147 元永久套餐是什么意思？适合什么人？",
				a: "光速云·致敬斯诺克 147 永久套餐为 147 元一次性付费、内含 247GB 不限时不过期流量（不限设备数）。最适合作为断网备用通道，或每月流量消耗少于 20GB 的轻度资料检索用户，注意一次性商品购买前请先小额验证。",
			},
			{
				q: "光速云支持 Clash Verge Rev 和 Shadowrocket 小火箭吗？",
				a: "支持。光速云既提供免配置自研客户端，也在用户后台提供通用订阅链接，可直接一键导入 Clash Verge Rev、Shadowrocket、v2rayN 与 Sing-box。",
			},
		],
		relatedGuides: [
			{ title: "2026 42 家机场排行榜总纲", url: "/recommend/airport/" },
			{ title: "不限时流量包机场选购分析", url: "/recommend/pay-as-you-go-airport-guide/" },
			{ title: "Clash Verge Rev 电脑端从零配置", url: "/clash-verge-rev/" },
		],
	},
	muguang: {
		slug: "muguang",
		accentColor: "#06b6d4",
		seoTitle: "暮光加速 2026 深度评测：BGP 智能调度、多设备在线与 109元年付测速解析",
		seoDescription:
			"暮光加速（muguang）机场全面评测：2023年运营至今，主打 BGP 智能动态调度与全平台多设备同时在线，附珠海联通实测截图、120GB-1500GB套餐及不限时流量包对比。",
		h1: "暮光加速（muguang）评测：BGP 智能调度与多设备专线实测",
		overviewConclusion:
			"暮光加速（muguang）于 2023 年上线，主打 BGP 智能调度与全平台（Windows / macOS / iOS / Android / Linux）多设备同时在线，香港实测 26ms / 509Mbps、新加坡 43ms / 419Mbps，适合家庭多端或小型跨境协作团队作为常规主力。",
		backgroundNote:
			"品牌资料显示暮光加速采用 BGP 智能动态调度与专线级出口架构，官方宣称提供 7×24 小时真人客服支持，流量档位从 70GB/月年付到 1500GB/月商用覆盖全面。",
		packagesNote: "基础月付 20 元起，另有三档不限时流量包及定制节点。优惠码 muguang5555。",
		packages: [
			{ name: "暮光·年付轻量版", cycle: "年付", price: "¥109", traffic: "70GB", trafficCycle: "每月" },
			{ name: "暮光·基础版", cycle: "月付", price: "¥20", traffic: "120GB", trafficCycle: "每月" },
			{ name: "暮光·标准版", cycle: "月付", price: "¥40", traffic: "240GB", trafficCycle: "每月" },
			{ name: "暮光·旗舰版", cycle: "月付", price: "¥100", traffic: "700GB", trafficCycle: "每月" },
			{ name: "暮光·至尊版", cycle: "月付", price: "¥180", traffic: "1500GB", trafficCycle: "每月" },
			{ name: "暮光·不限时轻量包", cycle: "一次性付费", price: "¥219", traffic: "150GB", trafficCycle: "一次性" },
			{ name: "暮光·不限时标准包", cycle: "一次性付费", price: "¥529", traffic: "400GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文基准标注（非晚高峰参考）",
		benchmarks: [
			{ region: "香港专线", latencyMs: 26, downloadMbps: 509 },
			{ region: "台湾节点", latencyMs: 40, downloadMbps: 107 },
			{ region: "新加坡节点", latencyMs: 43, downloadMbps: 419 },
			{ region: "日本节点", latencyMs: 53, downloadMbps: 150 },
			{ region: "美国节点", latencyMs: 160, downloadMbps: 19 },
		],
		aiServices: [
			{ name: "ChatGPT", status: "supported", note: "品牌资料标注支持" },
			{ name: "Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视具体节点出口地区而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "主流亚太节点可用" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "用户全平台设备 → BGP 智能动态选路入口 → 专线跨境通道 → 港/台/日/新/美节点",
		suitableFor: [
			"拥有手机、电脑、平板等多台设备需同时在线的个人或小团队",
			"偏好 20 元/月 120GB 起步、希望近端亚太延迟低于 50ms 的日常主力用户",
		],
		notSuitableFor: [
			"极致追求 5~6 元/月极低年付门槛的纯预算敏感型用户",
			"主要重度下载美国大文件且对美区单节点带宽要求极高的人群（美区基准约 19Mbps）",
		],
		risksAndLimits: [
			"早期品牌归档中曾无公开固定折扣码，当前可使用站点收录优惠码 muguang5555 并以下单页实际减免为准。",
		],
		peerComparison:
			"同在 20 元/月区间，暮光加速（¥20/120GB）与 U1S1（¥20/120GB）资费相同，与二猫云（¥20/130GB）接近，优势在于不限时档位更丰富且明文主打多设备在线。",
		faqs: [
			{
				q: "暮光加速的 BGP 智能调度有什么实际作用？",
				a: "BGP 多线接入会根据电信、联通、移动不同地区用户的网络路径动态选取相对最优入口，减少单线中转晚高峰拥堵导致的延迟飙升与断流。",
			},
		],
		relatedGuides: [
			{ title: "20 元内月付高性价比机场横评", url: "/recommend/budget-airport-guide/" },
			{ title: "稳定长期机场挑选避坑标准", url: "/recommend/stable-airport-guide/" },
		],
	},
	feimaoyun: {
		slug: "feimaoyun",
		accentColor: "#3b82f6",
		seoTitle: "飞猫云机场 2026 评测：84元年付 IEPL 专线与零门槛专属客户端实测",
		seoDescription:
			"飞猫云（feimao）2026客观评测：2023年上线，年付84元（约7元/月50GB）搭配专属免配置客户端，含2026-08-11 08:52 CST节点测速实测图、优缺点及适用人群分析。",
		h1: "飞猫云（feimao）2026 评测：7 元档轻量 IEPL 专线与新手免配置体验",
		overviewConclusion:
			"飞猫云（feimao）自 2023 年运营以来主打“新手省事不折腾”，年付学生版低至 84 元/年（折合约 7 元/月含 50GB），提供下载登录即用的专属客户端（同时兼顾订阅支持），适合不愿配置复杂第三方规则的新手与轻量备用用户。",
		backgroundNote:
			"飞猫云面向入门与轻量日常人群设计，节点覆盖亚太及欧美热门地区，保留 2026-08-11 批次实测图（MAI-TEST-BOT 2.0.0-dev，Shadowsocks 显示）。",
		packagesNote: "优惠码 flycat888 可享 8 折，另提供 1000GB 不限时大流量包。",
		packages: [
			{ name: "飞猫·学生版", cycle: "年付", price: "¥84", traffic: "50GB", trafficCycle: "每月" },
			{ name: "飞猫·星耀版", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
			{ name: "飞猫·星环版", cycle: "月付", price: "¥45", traffic: "300GB", trafficCycle: "每月" },
			{ name: "飞猫·银河版", cycle: "月付", price: "¥85", traffic: "600GB", trafficCycle: "每月" },
			{ name: "飞猫·宇宙版", cycle: "月付", price: "¥150", traffic: "1000GB", trafficCycle: "每月" },
			{ name: "飞猫·不限时套餐", cycle: "一次性付费", price: "¥680", traffic: "1000GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 08:52 CST 单日测速图",
		benchmarks: [
			{ region: "香港节点", latencyMs: 21, downloadMbps: 526 },
			{ region: "台湾节点", latencyMs: 41, downloadMbps: 116 },
			{ region: "新加坡节点", latencyMs: 45, downloadMbps: 413 },
			{ region: "日本节点", latencyMs: 54, downloadMbps: 138 },
			{ region: "美国节点", latencyMs: 178, downloadMbps: 14 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注支持" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "飞猫专属客户端 / 订阅接入 → 企业 IEPL 专线传输 → 亚太/欧美常用出口",
		suitableFor: [
			"首次接触梯子工具、不希望学习 Clash/Shadowrocket 订阅转换的纯新手",
			"寻找年付 84 元以内高可用轻量主用或备用线路的学生群体",
		],
		notSuitableFor: [
			"需要极致顶级 IPLC 晚高峰重度 8K 下载且预算充裕的重度影音用户",
		],
		risksAndLimits: [
			"2026-08-11 测速时间点为 08:52 (CST) 早间时段，仅代表测速快照，不直接证明晚高峰全天候表现；学生版每月 50GB 流量适合轻度使用，重度观影易耗尽。",
		],
		peerComparison:
			"同为年付约 7 元/月代表，飞猫云强在专属客户端易用性，而微风网络（¥137年付 100GB/月）更偏向 VLESS 协议与 7×24 客服口碑。",
		faqs: [
			{
				q: "飞猫云学生版每月 50GB 够用吗？",
				a: "如果主要用于 Google 搜索、ChatGPT 提问、GitHub 代码拉取和日常 1080p 视频，每月 50GB 绰绰有余；若经常刷 4K YouTube 或 Netflix 追剧，建议选星耀版 150GB/月起。",
			},
		],
		relatedGuides: [
			{ title: "平价与低价机场利弊完整解析", url: "/recommend/cheap-airport/" },
			{ title: "Windows / Mac 小白上手教程", url: "/clash-verge-rev/" },
		],
	},
	weifeng: {
		slug: "weifeng",
		accentColor: "#10b981",
		seoTitle: "微风网络 2026 评测：7元档 IEPL + VLESS 入门性价比与 7×24 客服实测",
		seoDescription:
			"微风网络（weifeng）2026评测：2023年运营至今，采用IEPL专线与VLESS协议，提供年付小包及信风/长风不限时流量包，附实测节点测速图与9折优惠码 flat888。",
		h1: "微风网络（weifeng）评测：平价稳定 IEPL + VLESS 入门机场代表",
		overviewConclusion:
			"微风网络（weifeng）自 2023 年起运营，以 IEPL 专线结合 VLESS 协议立足入门市场。其“年付小包”折合 7 元/月起，“清风”年付 137 元享 100GB/月，配合 7×24 小时人工及夜间 AI 客服响应，非常适合学生党、外贸轻办公与平价专线入门人群。",
		backgroundNote:
			"微风网络定位清晰，节点覆盖香港、新加坡、日本、美国多地原生 IP，既提供低门槛周期套餐，也配置了信风 270GB 与长风 570GB 两档不过期流量包。",
		packagesNote: "季付及以上使用优惠码 flat888 可享 9 折。",
		packages: [
			{ name: "微风·清风 (Breeze)", cycle: "年付", price: "¥137", traffic: "100GB", trafficCycle: "每月" },
			{ name: "微风·乘风 (Riding)", cycle: "月付", price: "¥27", traffic: "200GB", trafficCycle: "每月" },
			{ name: "微风·破风 (Breaking)", cycle: "月付", price: "¥57", traffic: "500GB", trafficCycle: "每月" },
			{ name: "微风·御风 (Mastery)", cycle: "月付", price: "¥127", traffic: "1200GB", trafficCycle: "每月" },
			{ name: "微风·信风不限时", cycle: "一次性付费", price: "¥200", traffic: "270GB", trafficCycle: "一次性" },
			{ name: "微风·长风不限时", cycle: "一次性付费", price: "¥370", traffic: "570GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 实测测速附图",
		benchmarks: [
			{ region: "香港 IEPL", latencyMs: 25, downloadMbps: 546 },
			{ region: "台湾节点", latencyMs: 40, downloadMbps: 115 },
			{ region: "新加坡节点", latencyMs: 43, downloadMbps: 384 },
			{ region: "日本节点", latencyMs: 54, downloadMbps: 131 },
			{ region: "美国节点", latencyMs: 167, downloadMbps: 17 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注解锁" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注解锁" },
		],
		topologySummary: "全平台订阅导入 → VLESS 加密传输 → IEPL 物理专线 → 原生 IP 落地",
		suitableFor: [
			"需要稳定查询外文文献、使用 ChatGPT、发外贸邮件的日常轻中度用户",
			"看重平价区间内售后客服可联系性、希望少走弯路的新手用户",
		],
		notSuitableFor: [
			"单月需消耗 500GB 以上视频流量的超重度 4K 用户（可考虑高流月付或暮光）",
		],
		risksAndLimits: [
			"低门槛小包月流量有限，若长期高频开 4K 串流易提前耗尽；测速图反映对应测试环境表现，建议先用短周期体验。",
		],
		peerComparison:
			"微风网络、FlyingBird 与 Firefly 存在同系关联参考。微风胜在入门总花费低（约 11.4 元/月即得 100GB/月清风年付 + flat888 9折）且售后响应及时。",
		faqs: [
			{
				q: "微风网络的优惠码 flat888 在所有套餐都能用吗？",
				a: "根据品牌清单资料，优惠码 flat888 适用于季付及以上周期套餐享 9 折；小额年付特价活动是否叠加建议在结算页确认。",
			},
		],
		relatedGuides: [
			{ title: "平价 IEPL 机场 vs 低价直连机场避坑", url: "/recommend/cheap-airport/" },
			{ title: "v2rayN Windows VLESS 配置实战", url: "/v2rayn/" },
		],
	},
	dalaoyun: {
		slug: "dalaoyun",
		accentColor: "#14b8a6",
		seoTitle: "大佬云机场 2026 评测：5.6 元档 IEPL + VLESS 极限平价方案客观分析",
		seoDescription:
			"大佬云（dalaoyun）客观评测：2024年成立，年付折合约5.6元/月含60GB流量、IEPL专线结合VLESS协议，支持自研客户端与第三方订阅及季付7折优惠码 dly888。",
		h1: "大佬云（dalaoyun）评测：5.6 元/月档 IEPL + VLESS 极低预算方案",
		overviewConclusion:
			"大佬云（dalaoyun）自 2024 年起运营，定位“极限平价专线”，年付口径低至约 5.6 元/月含 60GB/月流量，采用 IEPL 专线与 VLESS 协议，支持自研客户端及第三方 Clash / Shadowrocket 订阅导入。需明确提示：当前归档属品牌资料核验阶段（`dataStatus: vendor`），暂未收录独立测速图，建议小额实测验证。",
		backgroundNote:
			"大佬云与闪电鼠、云界线、榴莲云、环球梯同属 5.6 元/月档平价 IEPL 产品线，整体规格高度相近，支持季付及以上 7 折活动。",
		packagesNote: "当前完整官网多档位价格表待补充，已知核心为年付约 5.6 元/月（60GB/月），优惠码 dly888（季付及以上 7 折）。",
		packages: [
			{ name: "入门年付档（资料记录）", cycle: "年付", price: "约 ¥5.6/月", traffic: "60GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Gemini", status: "untested", note: "品牌资料未独立披露逐项实测" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / TikTok", status: "untested", note: "缺乏统一实测解锁矩阵，建议月/季付实测" },
		],
		topologySummary: "自研或 Clash/小火箭客户端 → VLESS 协议 → IEPL 专线传输（依据品牌资料整理）",
		suitableFor: [
			"预算极度敏感、每月需要 ≤ 60GB 轻量查阅学术资料或作为备胎节点的用户",
			"偏好明确 VLESS 协议而非协议不透明低价盘的理性用户",
		],
		notSuitableFor: [
			"对晚高峰 4K 流畅度、流媒体全绿解锁及长期运维透明度要求高的主力重度用户",
		],
		risksAndLimits: [
			"当前所有规格均源自品牌方披露（dataStatus: vendor），无本站实测测速截图与解锁图支持，不应视为高性能保证。",
			"与闪电鼠等 5.6 元档品牌规格高度重合，无明显独有差异化技术背书。",
		],
		peerComparison:
			"与同门 5.6 元档（闪电鼠、云界线、榴莲云、环球梯）对比：大佬云明确标注了 VLESS 协议（优于未标协议的榴莲云）且注册链接格式标准（优于少 `#/` 的云界线和环球梯）。",
		faqs: [
			{
				q: "为什么 5.6 元/月的 IEPL 机场需要提示“待核实”？",
				a: "因为物理专线存在刚性带宽成本，低单价产品在晚高峰容易出现带宽复用竞争，加上当前缺乏独立第三方测速截图，本站严格将其标为 vendor 数据状态并建议避免一次性大额囤积。",
			},
		],
		relatedGuides: [
			{ title: "5-10 元平价机场防跑路与成本真相", url: "/recommend/cheap-airport/" },
			{ title: "月付 vs 年付防跑路风险决策指南", url: "/recommend/monthly-vs-yearly-guide/" },
		],
	},
	xingdaomeng: {
		slug: "xingdaomeng",
		accentColor: "#8b5cf6",
		seoTitle: "星岛梦机场 2026 评测：2020老牌 IEPL、96元年付与永久不限时包实测",
		seoDescription:
			"星岛梦（xingdaomeng）深度评测：2020年老牌运营，采用Trojan+IEPL专线，1倍流量不限设备数，附2026-08-11 01:48 CST节点测速截图、96元年付及100G-1T永久流量包明细。",
		h1: "星岛梦（xingdaomeng）2026 评测：2020 老牌运营 IEPL 与不限时流量组合",
		overviewConclusion:
			"星岛梦（xingdaomeng）自 2020 年运营至今，凭借 1 倍流量计费、不限设备连接数以及横跨港/台/日/美/新/韩/东南亚的广泛落地布局，成为家庭共享与永久按量包人群的热门选品。配合新人 9 折优惠码 `nmw888`，性价比与长期信誉均居前列。",
		backgroundNote:
			"星岛梦采用 IEPL 专线与 Trojan 协议，全线不限速不限设备，拥有海外技术团队与多人客服团队支持，并保留了 2026-08-11 批次节点测速实测截图。",
		packagesNote: "新人优惠码 nmw888 可享 9 折，兼顾年付小包（96元/年）、月付主力与三大不限时包。",
		packages: [
			{ name: "星岛梦·贴心小包", cycle: "年付", price: "¥96", traffic: "60GB", trafficCycle: "每月" },
			{ name: "星岛梦·超量150G", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
			{ name: "星岛梦·进阶300G", cycle: "月付", price: "¥50", traffic: "300GB", trafficCycle: "每月" },
			{ name: "星岛梦·闪光500G", cycle: "月付", price: "¥70", traffic: "500GB", trafficCycle: "每月" },
			{ name: "星岛梦·旗舰1T版", cycle: "月付", price: "¥130", traffic: "1000GB", trafficCycle: "每月" },
			{ name: "星岛梦·永久不限时100", cycle: "一次性付费", price: "¥100", traffic: "100GB", trafficCycle: "一次性" },
			{ name: "星岛梦·永久不限时300", cycle: "一次性付费", price: "¥300", traffic: "300GB", trafficCycle: "一次性" },
			{ name: "星岛梦·永久不限时1TB", cycle: "一次性付费", price: "¥600", traffic: "1000GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 01:48 CST 测速附图",
		benchmarks: [
			{ region: "香港专线", latencyMs: 27, downloadMbps: 504 },
			{ region: "台湾节点", latencyMs: 41, downloadMbps: 103 },
			{ region: "新加坡节点", latencyMs: 44, downloadMbps: 411 },
			{ region: "日本节点", latencyMs: 57, downloadMbps: 136 },
			{ region: "美国节点", latencyMs: 177, downloadMbps: 18 },
		],
		aiServices: [
			{ name: "ChatGPT", status: "supported", note: "品牌资料标注支持" },
			{ name: "Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地地区而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "支持 YouTube Premium 与主流流媒体" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "含 TikTok 跨区支持记录" },
		],
		topologySummary: "不限设备多端接入 → Trojan 伪装传输 → IEPL 企业专线 → 港/台/日/美/新/韩及东南亚落地",
		suitableFor: [
			"看重 2020 年起长期运营资质、排斥新开快闪盘的稳健派用户",
			"需要给家中电视、电脑、手机多端共同接入，且偏好永久按量包备用的群体",
		],
		notSuitableFor: [
			"单月只需 15 元档且不需要永久流量包、对 VLESS 协议有强迫偏好的用户",
		],
		risksAndLimits: [
			"2026-08-11 批次截图测得时间为凌晨 01:48 (CST)，非晚高峰拥堵时段；购买长周期前仍建议结合自身地区宽带实测。",
		],
		peerComparison:
			"与光速云同属 2020 老牌运营：星岛梦采用 Trojan 协议且韩国/东南亚等泛亚太覆盖突出，96元/年小包及 100-600元不限时体系齐全；光速云则在三网实测图完整度与 147永久 247GB 单价（0.59元/GB）上更具冲击力。",
		faqs: [
			{
				q: "星岛梦的永久不限时流量包性价比高吗？",
				a: "以 600 元/1TB（1000GB）不限时包计，折合每 GB 约 0.60 元且永不过期，对于大流量需求不固定、一年跨几个月才密集用一次的用户非常划算。",
			},
		],
		relatedGuides: [
			{ title: "不限时按量计费机场完整评测", url: "/recommend/pay-as-you-go-airport-guide/" },
			{ title: "老牌稳定机场挑选指南", url: "/recommend/stable-airport-guide/" },
		],
	},
	yinxingren: {
		slug: "yinxingren",
		accentColor: "#6366f1",
		seoTitle: "隐形人机场 2026 评测：企业级 IPLC 专线与专属客户端限制全面解析",
		seoDescription:
			"隐形人（yinxingren）客观评测：2024年运营，企业级IPLC直连与60+节点，品牌资料称提供1小时故障修复承诺，注意不支持Clash/小火箭第三方订阅，附白银纪元至钻石穹顶套餐明细。",
		h1: "隐形人（yinxingren）评测：企业级 IPLC 直连与全平台专属客户端解析",
		overviewConclusion:
			"隐形人（yinxingren）成立于 2024 年，品牌资料展示其主打企业级 IPLC 专线直连与 60+ 节点布局，全平台采用自研专属客户端一键连接。选购前最关键的边界是：隐形人不提供 Clash 或 Shadowrocket 第三方订阅链接，且当前档案暂无独立实测测速图（`dataStatus: vendor`）。",
		backgroundNote:
			"官方定价从星耀风暴 109 元/年（80GB/月）及白银纪元 24 元/月（144GB/月）起步，兼顾高净值定制需求。品牌资料声明支持 1 小时故障响应（属 vendor 声明）。",
		packagesNote: "优惠码 yxr888（历史折扣码 moon80 享 8 折）。",
		packages: [
			{ name: "星耀风暴 365天不熄", cycle: "年付", price: "¥109", traffic: "80GB", trafficCycle: "每月" },
			{ name: "隐形人 白银纪元", cycle: "月付", price: "¥24", traffic: "144GB", trafficCycle: "每月" },
			{ name: "隐形人 黄金序列", cycle: "月付", price: "¥48", traffic: "360GB", trafficCycle: "每月" },
			{ name: "隐形人 铂金至臻", cycle: "月付", price: "¥105", traffic: "750GB", trafficCycle: "每月" },
			{ name: "隐形人 钻石穹顶", cycle: "月付", price: "¥185", traffic: "1.6TB", trafficCycle: "每月" },
			{ name: "一次性小流量包", cycle: "一次性付费", price: "¥229", traffic: "160GB", trafficCycle: "一次性" },
			{ name: "一次性精英流量包", cycle: "一次性付费", price: "¥1199", traffic: "1.0TB", trafficCycle: "一次性" },
		],
		aiServices: [
			{ name: "ChatGPT", status: "supported", note: "品牌资料标注可用（vendor）" },
			{ name: "Claude / Gemini", status: "conditional", note: "品牌资料未统一给出全节点确定说法" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注支持 4K/8K" },
			{ name: "HBO Max / Spotify", status: "supported", note: "品牌资料标注可用" },
			{ name: "TikTok", status: "conditional", note: "视节点而定，无明确全节点保障" },
		],
		topologySummary: "官方自研全平台专属客户端 → 企业级 IPLC 专线直连 → 港/日/美/新/台节点",
		suitableFor: [
			"不希望动手折腾 Clash YAML / 订阅链接，只想下载官方 App 登录直接连的新手或商务人士",
			"看重星耀风暴 109 元年付（每月 80GB）高流量单价且无第三方客户端刚需的用户",
		],
		notSuitableFor: [
			"需要在 OpenWrt 软路由（OpenClash/PassWall）、小火箭或 Clash Verge Rev 中自定义分流规则的技术玩家",
			"坚持下单前必须查看独立第三方测速截图的保守型买家",
		],
		risksAndLimits: [
			"当前未提供可核实的独立节点测速截图，10-19 文档速度栏亦为空值；所谓的“1小时修复承诺”及“秒开8K”均标注为 brand-claimed (`vendor`)。",
			"不支持第三方订阅导出意味着换客户端生态的自由度受限。",
		],
		peerComparison:
			"对比同样主打专属客户端一键上手的梯子云，梯子云同时开放通用订阅导出（兼顾新手与进阶），而隐形人彻底锁定专属客户端体系，购买前务必确认设备生态兼容性。",
		faqs: [
			{
				q: "隐形人可以用苹果小火箭（Shadowrocket）或 Clash Verge 导入吗？",
				a: "不行。根据品牌资料原文说明，隐形人仅支持其官方自带专属客户端下载登录使用，不提供第三方订阅链接。",
			},
		],
		relatedGuides: [
			{ title: "IPLC 与 IEPL 纯专线机场原理与挑选", url: "/recommend/airport-lines/" },
			{ title: "第三方代理客户端兼容完整对比", url: "/tizi/airport-vs-tizi/" },
		],
	},
	ermaoyun: {
		slug: "ermaoyun",
		accentColor: "#f97316",
		seoTitle: "二猫云机场 2026 评测：20元 130GB IEPL + VLESS 4K 流媒体优化实测",
		seoDescription:
			"二猫云（ermao）2026客观评测：2023年运营，主打长期稳定不做低价跑路盘，VLESS+IEPL架构不限设备连接数，附2026-08-11 10:45 CST测速实测图与白猫至黑猫全套餐对比。",
		h1: "二猫云（ermao）2026 评测：20 元档 IEPL + VLESS 长期主力与 4K 优化解析",
		overviewConclusion:
			"二猫云（ermao）自 2023 年运营，采用 IEPL 专线与 VLESS 协议，以 20 元/月含 130GB 起步、不限设备连接数，明确避开超低价走量路线，重点调优 YouTube 4K、Netflix 与日常跨境稳定使用。但需留意节点布局缺少独立新加坡重心站时的地区替代情况。",
		backgroundNote:
			"由海外技术团队主理并配备独家定制客户端，支持月付、长周期订阅及 99 元 100GB 不限时尝鲜包，保留 2026-08-11 实测测速截图。",
		packagesNote: "优惠码 ermao5555，白猫月付 ¥20 含 130GB 在同价位（多数为 100-120GB）中流量更足。",
		packages: [
			{ name: "二猫年付小包", cycle: "年付", price: "¥89", traffic: "60GB", trafficCycle: "每月" },
			{ name: "二猫云·不限时套餐", cycle: "一次性付费", price: "¥99", traffic: "100GB", trafficCycle: "一次性" },
			{ name: "二猫云·白猫套餐", cycle: "月付", price: "¥20", traffic: "130GB", trafficCycle: "每月" },
			{ name: "二猫云·橘猫畅玩版", cycle: "月付", price: "¥40", traffic: "230GB", trafficCycle: "每月" },
			{ name: "二猫云·牛奶猫尊享版", cycle: "月付", price: "¥80", traffic: "430GB", trafficCycle: "每月" },
			{ name: "二猫云·黑猫重度用户版", cycle: "月付", price: "¥160", traffic: "850GB", trafficCycle: "每月" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 10:45 CST 测速附图",
		benchmarks: [
			{ region: "香港节点", latencyMs: 22, downloadMbps: 481 },
			{ region: "台湾节点", latencyMs: 41, downloadMbps: 118 },
			{ region: "新加坡节点", latencyMs: 46, downloadMbps: 407 },
			{ region: "日本节点", latencyMs: 53, downloadMbps: 143 },
			{ region: "美国节点", latencyMs: 134, downloadMbps: 17 },
		],
		aiServices: [
			{ name: "ChatGPT", status: "supported", note: "品牌资料标注支持" },
			{ name: "Claude / Gemini", status: "conditional", note: "品牌资料标注视节点而定，建议月付先试" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "针对 4K 高码率点播调优" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "不限设备多端 → VLESS 加密传输 → 全线 IEPL 专线 → 港/台/日/新/美枢纽",
		suitableFor: [
			"预算 20 元/月左右、看重 130GB 充足月流量用于 4K 追剧与日用查资料的个人或家庭",
			"排斥低价超售小作坊、希望选择多年付稳定方案的用户",
		],
		notSuitableFor: [
			"强烈依赖 Claude 与 Gemini 且不愿自行实测筛选节点的高频重度 AI 开发者",
		],
		risksAndLimits: [
			"资料曾提醒二猫云早期海外节点主力偏重港/日/美而新加坡站偏少（10-19 测速表含新加坡测试项），重度狮城出口用户需以当期节点列表为准；08-11 截图测于上午 10:45 (CST)。",
		],
		peerComparison:
			"对比 20 元档暮光加速（120GB）和 U1S1（120GB），二猫云以 ¥20/130GB 及 ¥89/60G 年付小包更具流量优势，且有 2023 年以来的运行历史积累。",
		faqs: [
			{
				q: "二猫云 99 元不限时和 89 元年付小包怎么选？",
				a: "若您是断断续续偶尔翻墙查资料、一年总流量不超过 100GB，选 ¥99 永久不限时不用担心月底清零；若每天都固定小用量访问外网，¥89/年每月给 60GB（全年累计可用高达 720GB）划算得多。",
			},
		],
		relatedGuides: [
			{ title: "10-15-20 元月付机场梯度横评", url: "/recommend/budget-airport-guide/" },
			{ title: "Netflix & 4K 流媒体机场指南", url: "/recommend/netflix-airport/" },
		],
	},
	wuyoulianjie: {
		slug: "wuyoulianjie",
		accentColor: "#6366f1",
		seoTitle: "无忧链接 2026 深度评测：50/50 节点晚高峰 FullCone 测速与御三家全绿解锁图",
		seoDescription:
			"无忧链接（wuyou）实测深度评测：2025年上线，79元年付（约6.5元/月）不限速不限设备，附2026-07-18 21:40晚高峰珠海联通9G 50节点测速图及YouTube/Netflix/Disney+全绿解锁图。",
		h1: "无忧链接（wuyou）评测：79 元年付门槛与晚高峰 FullCone 御三家全绿实测",
		overviewConclusion:
			"无忧链接（wuyou）于 2025 年上线，定位于轻度日常用户与跨境电商 TikTok 运营，年付 MINI 档低至 79 元/年（约 6.58 元/月），全线无倍率、不限速且不限设备数。它是全站极少数同时留存 2026-07-18 21:40 晚高峰 50/50 节点 FullCone 测速图与 21:47 御三家流媒体全绿解锁截图的轻量高性价比选手。",
		backgroundNote:
			"2026 年 10 月起兼顾官方专属客户端免折腾登录与通用订阅支持，配套 7×24 小时在线及夜间 AI 客服值守，同时提供 100GB/300GB 不限时流量包。",
		packagesNote: "优惠码 wuyou666。注意 MINI 链接每月流量为 40GB，仅建议轻度及社媒运营备用。",
		packages: [
			{ name: "MINI链接", cycle: "年付", price: "¥79", traffic: "40GB", trafficCycle: "每月" },
			{ name: "舒心链接", cycle: "月付", price: "¥19", traffic: "100GB", trafficCycle: "每月" },
			{ name: "省心链接", cycle: "月付", price: "¥33", traffic: "200GB", trafficCycle: "每月" },
			{ name: "随心链接", cycle: "月付", price: "¥77", traffic: "500GB", trafficCycle: "每月" },
			{ name: "忘忧链接", cycle: "月付", price: "¥117", traffic: "1000GB", trafficCycle: "每月" },
			{ name: "100G永久不限时", cycle: "一次性付费", price: "¥108", traffic: "100GB", trafficCycle: "一次性" },
			{ name: "300G永久不限时", cycle: "一次性付费", price: "¥298", traffic: "300GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-07-18 21:40 CST 晚高峰实测图（50/50 节点） + 10-19 非晚高峰基准",
		benchmarks: [
			{ region: "香港节点", latencyMs: 23, downloadMbps: 531 },
			{ region: "台湾节点", latencyMs: 41, downloadMbps: 107 },
			{ region: "新加坡节点", latencyMs: 42, downloadMbps: 418 },
			{ region: "日本节点", latencyMs: 55, downloadMbps: 147 },
			{ region: "美国节点", latencyMs: 145, downloadMbps: 17 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点而定" },
		],
		streamingServices: [
			{ name: "YouTube / Netflix / Disney+", status: "supported", note: "2026-07-18 21:47 CST 实测全绿通过" },
			{ name: "TikTok 跨区直连", status: "supported", note: "面向跨境电商与直播场景重点支持" },
			{ name: "HBO Max / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "免转换通用订阅 / 专属客户端 → 无倍率专线中转 → FullCone NAT 支持落地",
		suitableFor: [
			"跨境电商 TikTok 运营、游戏联机需要 FullCone NAT 或御三家原生流媒体用户",
			"寻找 79 元/年轻量备用梯子或 19 元 100GB 高性价比月付套餐的用户",
		],
		notSuitableFor: [
			"每天看大量 4K 视频却只购买 40GB/月 MINI 年付包的用户（流量会迅速见底）",
		],
		risksAndLimits: [
			"品牌于 2025 年上线，长期跨年抗压口碑仍需随时间继续观察；MINI 档 40GB 流量仅满足文字检索与轻度短视频浏览。",
		],
		peerComparison:
			"在 6~8 元/月极限门槛段，无忧链接是极少见公开了晚高峰 50/50 全绿节点测速+流媒体御三家双图实测的品牌，透明度与 FullCone 游戏兼容性优于多数同价小厂。",
		faqs: [
			{
				q: "无忧链接实测图中的 FullCone NAT 有什么意义？",
				a: "FullCone（完全圆锥型）NAT 代表节点的 UDP 端口映射通透性更好，在 Switch、PS5、Steam 联机或部分实时语音场景下能显著提升 NAT 类型并降低丢包。",
			},
		],
		relatedGuides: [
			{ title: "TikTok 跨境运营原生节点推荐", url: "/recommend/tiktok-airport/" },
			{ title: "御三家流媒体与 Netflix 解锁实测专题", url: "/recommend/streaming-airport/" },
		],
	},
	weituyun: {
		slug: "weituyun",
		accentColor: "#ec4899",
		seoTitle: "唯兔云机场 2026 评测：79.9元年付 IPLC、三网负载均衡与永久套餐实测",
		seoDescription:
			"唯兔云（weitu）2026评测：2023年运营，IPLC专线+60+全球节点，支持ChatGPT/Claude及Netflix全系解锁，附2026-08-11 13:55 CST实测截图、79.9元年付/14.9元月付与9折码 weitu666。",
		h1: "唯兔云（weitu）评测：60+ 节点 IPLC 专线与 14.9 元高性价比兼顾方案",
		overviewConclusion:
			"唯兔云（weitu）自 2023 年运营至今，主打 IPLC 专线、Trojan/VLESS 多协议自适应与三网入口负载均衡，1 倍流量不限速、不限设备同时在线。限时/普通月付 ¥14.9~¥19.9 档（100~150GB）在同级别 IPLC 机场中性价比突出。",
		backgroundNote:
			"唯兔云配备海外技术团队与多人客服体系，涵盖年付 79.9 元限量、年付 120 元加强专线及三档不限时流量包，保留 2026-08-11 13:55 CST 测速实测图。",
		packagesNote: "优惠码 weitu666 可享 9 折；14.9 元 100GB 月付一般作为限时/促销档出现。",
		packages: [
			{ name: "年付版限量款", cycle: "年付", price: "¥79.90", traffic: "45GB", trafficCycle: "每月" },
			{ name: "年付加强专线", cycle: "年付", price: "¥120", traffic: "75GB", trafficCycle: "每月" },
			{ name: "节假日限时 14.9元档", cycle: "月付", price: "¥14.90", traffic: "100GB", trafficCycle: "每月" },
			{ name: "唯兔云·普通版", cycle: "月付", price: "¥19.90", traffic: "150GB", trafficCycle: "每月" },
			{ name: "唯兔云·进阶版", cycle: "月付", price: "¥29.90", traffic: "200GB", trafficCycle: "每月" },
			{ name: "唯兔云·专业版", cycle: "月付", price: "¥59.90", traffic: "500GB", trafficCycle: "每月" },
			{ name: "唯兔云·永久不限时", cycle: "一次性付费", price: "¥100", traffic: "100GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 13:55 CST 测速附图",
		benchmarks: [
			{ region: "香港专线", latencyMs: 27, downloadMbps: 500 },
			{ region: "台湾节点", latencyMs: 37, downloadMbps: 100 },
			{ region: "新加坡节点", latencyMs: 44, downloadMbps: 414 },
			{ region: "日本节点", latencyMs: 56, downloadMbps: 147 },
			{ region: "美国节点", latencyMs: 179, downloadMbps: 17 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube Premium", status: "supported", note: "品牌资料标注解锁" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注解锁" },
		],
		topologySummary: "不限设备通用订阅 → 三网智能入口负载均衡 → IPLC 专线 → 60+ 全球节点",
		suitableFor: [
			"预算控制在 15~20 元/月、同时希望获得 100~150GB 大流量与不限设备共享的家庭/团队",
			"既看重 ChatGPT/Claude 日常稳定性，又希望周末流畅看 Netflix 的均衡用户",
		],
		notSuitableFor: [
			"预算卡在 5~6 元/月极端低门槛或对美国单线超大吞吐有刚需的用户",
		],
		risksAndLimits: [
			"14.9 元档标明为“节假日限时开启”，日常常规月付价格多为 19.9 元（150GB），下单前请核对实时官网面板价格。",
		],
		peerComparison:
			"相比二猫云（20元 130GB）和宇宙云（14.9元 100GB），唯兔云在常规 19.9 元档提供 150GB 流量及 79.9 元限量年付、100-340 元不限时梯度，弹性最高。",
		faqs: [
			{
				q: "唯兔云限制同时在线设备数量吗？",
				a: "根据品牌清单资料，唯兔云明确实行 1 倍流量计算，且不限制同时连接设备数。",
			},
		],
		relatedGuides: [
			{ title: "2026 性价比月付机场推荐方案", url: "/recommend/cost-effective-monthly-pay-airport-plans/" },
			{ title: "10-15-20 元预算档精细对比", url: "/recommend/budget-airport-guide/" },
		],
	},
	firefly: {
		slug: "firefly",
		accentColor: "#eab308",
		seoTitle: "Firefly 萤火虫机场 2026 评测：全专线 IPLC + VLESS 原生 IP 与抗封锁直连",
		seoDescription:
			"Firefly 萤火虫深度评测：采用全专线 IPLC + VLESS 架构与抗封锁官方直连域名，不限速不限设备，附 96元年付/Lite/Nova/不限时全系套餐及 2026-10-19 基准测试对比。",
		h1: "Firefly（萤火虫）评测：全专线 IPLC + VLESS 与抗封锁官方直连体验",
		overviewConclusion:
			"Firefly（萤火虫）采用全专线 IPLC 结合 VLESS 原生 IP 架构，品牌资料记录其具备抗封锁免翻墙直连官网特性，全节点不限速不限设备，2026 年 10 月起主推官方专属客户端下载登录即用（不提供第三方订阅链接）。在 2026-10-19 非晚高峰基准中美区达到 30Mbps（同批里居前）。",
		backgroundNote:
			"资料显示 Firefly 与微风、飞鸟及一云梯存在同系关联，由经验成熟的技术团队配合 7×24 小时与夜间 AI 客服维护，套餐跨越 96 元年付、4 档月付至 100 元不限时包。",
		packagesNote: "优惠码 firefly 享新用户 8 折（注意年付版不适用）。当前档案未另附图示截图 (`dataStatus: vendor`)。",
		packages: [
			{ name: "Firefly 年付版", cycle: "年付", price: "¥96", traffic: "60GB", trafficCycle: "每月" },
			{ name: "Firefly Lite", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
			{ name: "Firefly Plus", cycle: "月付", price: "¥45", traffic: "300GB", trafficCycle: "每月" },
			{ name: "Firefly Blaze", cycle: "月付", price: "¥85", traffic: "600GB", trafficCycle: "每月" },
			{ name: "Firefly Nova", cycle: "月付", price: "¥150", traffic: "1000GB", trafficCycle: "每月" },
			{ name: "Firefly 不限时", cycle: "一次性付费", price: "¥100", traffic: "100GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准参考（`dataStatus: vendor`）",
		benchmarks: [
			{ region: "香港专线", latencyMs: 27, downloadMbps: 547 },
			{ region: "台湾节点", latencyMs: 39, downloadMbps: 135 },
			{ region: "新加坡节点", latencyMs: 42, downloadMbps: 445 },
			{ region: "日本节点", latencyMs: 57, downloadMbps: 147 },
			{ region: "美国节点", latencyMs: 143, downloadMbps: 30 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Meta AI", status: "supported", note: "品牌资料标注原生 IP 支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点国家而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注原生 IP 稳定解锁" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "官方专属客户端（免配订阅） → VLESS 加密传输 → 全专线 IPLC → 原生 IP 出口",
		suitableFor: [
			"需要抗封锁直连访问官网、无需折腾第三方 Clash 配置且不限设备分享的用户",
			"每天晚间频繁使用 ChatGPT 与跨区追剧的 IPLC 中高阶稳定性追求者",
		],
		notSuitableFor: [
			"必须在 Clash Verge Rev / 小火箭 / 软路由中导入第三方订阅链接的玩家",
		],
		risksAndLimits: [
			"不提供第三方订阅链接（自 2026-10 起仅通过官方专属客户端登录使用），多系统老旧设备或路由器代理场景需绕行。",
			"未纳入 2026-08-11 截图测速包内，10-19 基准数据标明为非晚高峰参考。",
		],
		peerComparison:
			"相比同门“一云梯/飞鸟”系（如 15元月付的 FlyingBird），Firefly 月付起步更高（Lite ¥25/150GB），但新增了 96 元年付小包、100元不限时流量包以及抗封锁一键专属客户端。",
		faqs: [
			{
				q: "Firefly 和“萤火虫”是同一家机场吗？",
				a: "是的，品牌清单中 Firefly 与萤火虫指向相同的 VLESS + IPLC 体系与推广域名（vip02.fireflyaff.com），优惠码同为 `firefly`。",
			},
		],
		relatedGuides: [
			{ title: "专属客户端机场 vs 第三方订阅软件区别", url: "/tizi/airport-vs-tizi/" },
			{ title: "ChatGPT AI 专用原生 IP 机场推荐", url: "/recommend/chatgpt-airport/" },
		],
	},
	yuzhouyun: {
		slug: "yuzhouyun",
		accentColor: "#6366f1",
		seoTitle: "宇宙云机场 2026 评测：21:04 CST 晚高峰 VLESS 实测图与 96元年付分析",
		seoDescription:
			"宇宙云（yuzhou）客观评测：具备 2026-08-11 21:04 CST 晚高峰时段 VLESS 实测测速截图，早期资料显示 60+ 节点与三网优化、96 元/年起及优惠码 YUZHOU553，完整核实边界详析。",
		h1: "宇宙云（yuzhou）评测：晚高峰 VLESS 实测快照与现时资料完整度分析",
		overviewConclusion:
			"宇宙云（yuzhou）保留了极有价值的 **2026-08-11 21:04:24 CST 黄金晚高峰** VLESS 协议实测测速截图（使用 main 4.3.3 / miaosu 4.7.0 测速内核）。早期资料标明其年付 ¥96 起、月付 ¥14.9/100GB 与 60+ 三网优化节点，但目前尚缺当期完整全档位套餐截图，理性选购建议以官网实时展示为准。",
		backgroundNote:
			"早期品牌档案记录宇宙云采用 VLESS 协议、60+ 节点及三网智能负载均衡，优惠码 YUZHOU553（历史资料称新用户 8 折）。",
		packagesNote: "当前完整现行套餐明细分档待核实，不可用旧资料起价充当全量价目表。",
		packages: [
			{ name: "历史入门参考档", cycle: "年付 / 月付", price: "¥96/年 起 (¥14.9/月参考)", traffic: "100GB(月付参考)", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Gemini", status: "untested", note: "仅包含速度测速图，未独立收录解锁矩阵" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "untested", note: "流媒体解锁情况待核实" },
		],
		topologySummary: "待核实客户端兼容模式 → VLESS 协议 → 三网优化 / 60+ 节点负载均衡",
		suitableFor: [
			"重点关注晚高峰 21:00 左右 VLESS 原始测速表现，且愿意在官网开最低月付验证解锁的对比型用户",
		],
		notSuitableFor: [
			"在购买前需要详尽官方套餐阶梯说明、明确退款规则及第三方解锁核验图的用户",
		],
		risksAndLimits: [
			"当前缺失当期完整官方套餐清单、节点覆盖详情及售后客服 SLA 信息；08-11 截图证明晚高峰速度能力，但不构成 AI/流媒体解锁保证。",
		],
		peerComparison:
			"在 14.9 元/月 100GB 区间，唯兔云同样有此价位限时档但套餐矩阵及客服信息明显更透明完整；宇宙云更待补充当期官方面板明细。",
		faqs: [
			{
				q: "宇宙云 2026-08-11 的测速截图是在晚高峰测的吗？",
				a: "是的。speedtest-manifest.json 核验时间戳为 2026-08-11 21:04:24 (CST)，工具显示 main 4.3.3 (696) / miaosu 4.7.0 (A11-32)，协议明确显示为 VLESS。",
			},
		],
		relatedGuides: [
			{ title: "2026 机场评测筛选方法论与红黑榜标准", url: "/recommend/ranking-standards/" },
			{ title: "42家机场完整筛选对比大厅", url: "/brands/" },
		],
	},
	u1s1: {
		slug: "u1s1",
		accentColor: "#0ea5e9",
		seoTitle: "U1S1 机场 2026 评测：IPLC 专线、22:33 晚高峰实测图与 20元 120GB 套餐解析",
		seoDescription:
			"U1S1 机场全面评测：2025年上线 IPLC 专线，官方宣称2000Mbps带宽不限设备数，附 2026-08-11 22:33 CST 实测测速截图、就是好用包至我全都要包全价目与香港 538Mbps 基准。",
		h1: "U1S1 机场评测：2025 IPLC 新锐专线与高带宽大流量套餐实测",
		overviewConclusion:
			"U1S1 是 2025 年起上线的新锐 IPLC 专线机场，不限设备同时连接数，提供从 96 元/年（60GB/月）到 180 元/月（1500GB/月）共五档趣味命名套餐，并留存 2026-08-11 22:33 CST 实测测速图。因为运营周期仍较短，优先建议先通过 ¥20/120GB 月付实测本地晚高峰表现。",
		backgroundNote:
			"品牌官方强调 2000Mbps 带宽冗余与晚高峰不限速（`vendor` 定位），资料标注支持 ChatGPT、Claude、Netflix、Disney+ 与 TikTok，另有 1000GB 大流量包弹性选择。",
		packagesNote: "优惠码 akaka。全系清晰提供年付小包及多阶梯大流量月付。",
		packages: [
			{ name: "u1s1·就是好用包", cycle: "年付", price: "¥96", traffic: "60GB", trafficCycle: "每月" },
			{ name: "u1s1·普通人真够了包", cycle: "月付", price: "¥20", traffic: "120GB", trafficCycle: "每月" },
			{ name: "u1s1·你以为用不到包", cycle: "月付", price: "¥40", traffic: "300GB", trafficCycle: "每月" },
			{ name: "u1s1·瘾大就拉满包", cycle: "月付", price: "¥100", traffic: "700GB", trafficCycle: "每月" },
			{ name: "u1s1·我全都要包", cycle: "月付", price: "¥180", traffic: "1500GB", trafficCycle: "每月" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 22:33 CST 测速附图",
		benchmarks: [
			{ region: "香港节点", latencyMs: 24, downloadMbps: 538 },
			{ region: "台湾节点", latencyMs: 39, downloadMbps: 107 },
			{ region: "新加坡节点", latencyMs: 46, downloadMbps: 414 },
			{ region: "日本节点", latencyMs: 57, downloadMbps: 133 },
			{ region: "美国节点", latencyMs: 134, downloadMbps: 20 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注支持" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "不限设备接入 → Shadowsocks / 专线协议 → IPLC 高速跨境专线 → 港/台/日/新/美节点",
		suitableFor: [
			"有 300GB~1500GB 高清流媒体/同步下载大流量需求、希望不限设备接入的用户",
			"不希望被长周期绑定，打算先用 20 元/120GB 短月付摸底线路质量的尝鲜用户",
		],
		notSuitableFor: [
			"只信任 5 年以上超长历史运营老牌、对 2025 年新品牌高度谨慎的保守型用户",
		],
		risksAndLimits: [
			"2025 年新上线机场长期抗封锁韧性与售后稳定度仍待时间检验，严禁一上来重金直接充值多年包。",
		],
		peerComparison:
			"相比同为 20 元月付起且有测速图的二猫云（¥20/130GB）、一翻云（¥20/150GB），U1S1 套餐单价略少 10-30GB，优势在于 1500GB 超高顶配档及 10-19 香港测速表现亮眼（538Mbps）。",
		faqs: [
			{
				q: "U1S1 号称 2000Mbps 带宽代表我本地宽带能跑满 2000M 吗？",
				a: "不一定。2000Mbps 指的是节点服务器端的峰值端口容量标注，用户端实际速率取决于本地千兆路由、国内骨干网晚高峰状态与跨网延迟。",
			},
		],
		relatedGuides: [
			{ title: "20 元主力月付机场精细横评", url: "/recommend/budget-airport-guide/" },
			{ title: "如何识破新机场潜在跑路风险", url: "/recommend/airport-runaway/" },
		],
	},
	lingmaowangluo: {
		slug: "lingmaowangluo",
		accentColor: "#ec4899",
		seoTitle: "灵猫网络 2026 评测：85元年付、1倍不限速及专属客户端实测解析",
		seoDescription:
			"灵猫网络（lingmao）客观评测：2025年运营中转优化线路，主打1倍流量不限速不限设备，2026年10月起全面采用专属客户端免订阅使用，附08-11 18:45 CST测速图与全部套餐明细。",
		h1: "灵猫网络（lingmao）评测：不限设备家庭共享与专属客户端实测分析",
		overviewConclusion:
			"灵猫网络（lingmao）主打“1 倍流量、不限速、不限设备数”，适合多终端家庭或高频移动办公人士；年付小包 ¥85/年（折合约 ¥7.08/月 45GB），月付 Small ¥25 给足 150GB。最大使用门槛是 2026 年 10 月起全面转为专属客户端登录即用，不提供第三方 Clash 订阅链接。",
		backgroundNote:
			"线路走中转优化架构，节点覆盖港/台/日/美/新等主流地区，保留 2026-08-11 18:45:40 CST 实测测速图（MAI-TEST-BOT 2.0.0-dev）。",
		packagesNote: "优惠码 lmao888（资料亦载 lingmao 享 8 折，年付小包不适用）。",
		packages: [
			{ name: "灵猫·年付小包", cycle: "年付", price: "¥85", traffic: "45GB", trafficCycle: "每月" },
			{ name: "灵猫·月付Small", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
			{ name: "灵猫·月付Big", cycle: "月付", price: "¥45", traffic: "300GB", trafficCycle: "每月" },
			{ name: "灵猫·季付Big", cycle: "季付", price: "¥125", traffic: "300GB", trafficCycle: "每月" },
			{ name: "灵猫·年付Small", cycle: "年付", price: "¥195", traffic: "150GB", trafficCycle: "每月" },
			{ name: "灵猫·年付Big", cycle: "年付", price: "¥295", traffic: "300GB", trafficCycle: "每月" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 18:45 CST 测速附图",
		benchmarks: [
			{ region: "香港节点", latencyMs: 22, downloadMbps: 492 },
			{ region: "台湾节点", latencyMs: 40, downloadMbps: 109 },
			{ region: "新加坡节点", latencyMs: 46, downloadMbps: 409 },
			{ region: "日本节点", latencyMs: 57, downloadMbps: 147 },
			{ region: "美国节点", latencyMs: 164, downloadMbps: 19 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注支持" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "官方专属客户端（免配订阅） → 三网中转优化线路 → 港/台/日/美/新节点",
		suitableFor: [
			"家里手机、平板、笔记本多设备同时连网且不希望手动导入 Clash 配置的新手家庭",
			"偏重 150GB-300GB 常规中等月流量的稳定追剧与办公用户",
		],
		notSuitableFor: [
			"需要在 Clash / Shadowrocket / OpenWrt 软路由内自定义复杂路由分流的用户（无法导出订阅）",
		],
		risksAndLimits: [
			"走中转优化而非昂贵纯 IPLC 物理直连，且 2025 年上线运营年资偏浅，极度拥堵大促夜表现建议月付亲测。",
		],
		peerComparison:
			"同样使用专属客户端免配置的品牌还有隐形人、SOGO云和全球云；灵猫网络的年付小包 ¥85 价格较低且 1 倍不限设备适合家庭入门。",
		faqs: [
			{
				q: "灵猫网络为什么不支持导入 Clash Verge 或小火箭了？",
				a: "自 2026 年 10 月起灵猫网络调整为全官方专属客户端下载登录模式，这样做有利于防订阅泄露与简化新手配置，但也失去了第三方软件的自由分流控制。",
			},
		],
		relatedGuides: [
			{ title: "专属客户端 vs 第三方客户端利弊对照", url: "/tizi/airport-vs-tizi/" },
			{ title: "2026 不限设备高速机场精选指南", url: "/recommend/airport/" },
		],
	},
	jilianyun: {
		slug: "jilianyun",
		accentColor: "#2563eb",
		seoTitle: "极连云机场 2026 评测：18元 100GB IEPL 专线、AI 场景调优与测速实测图",
		seoDescription:
			"极连云（jilian）客观评测：2024年运营，18元/月100GB IEPL专线支持自研与第三方客户端，品牌资料明确覆盖常见 AI 工具场景，附 2026-08-11 22:46 CST 节点测速实测图与优惠码 ji8888。",
		h1: "极连云（jilian）评测：18 元 100GB IEPL 专线与 AI 场景实用度分析",
		overviewConclusion:
			"极连云（jilian）成立于 2024 年，是 18 元档 IEPL 专线梯队中兼顾自研客户端与第三方订阅的代表（18 元/月含 100GB），明确覆盖常见 AI 工具与日常跨境检索场景，并具备 **2026-08-11 22:46:50 CST** 实测节点测速截图。因其余高级月付明细与完整解锁矩阵暂未齐备，建议先按 18 元月付验证体验。",
		backgroundNote:
			"据品牌核心清单核验，极连云同时兼容自研应用与 Clash/Shadowrocket 第三方订阅，属于介于极低价年付盘与 25 元以上旗舰专线之间的平衡定价。",
		packagesNote: "已知核心主打 18 元/月 100GB 方案，优惠码 ji8888；更多高阶多周期套餐待官网补充。",
		packages: [
			{ name: "标准入门方案", cycle: "月付", price: "¥18", traffic: "100GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "常见 AI 工具场景", status: "conditional", note: "品牌资料明确说“覆盖常见 AI 工具使用场景”（vendor）" },
		],
		streamingServices: [
			{ name: "主流流媒体", status: "untested", note: "08-11 仅包含节点吞吐测速图，流媒体逐项矩阵待实测" },
		],
		topologySummary: "自研客户端 / Clash 第三方订阅 → IEPL 跨境专线 → 主流亚太/欧美节点",
		suitableFor: [
			"预算卡在 15-20 元之间，希望找到运营满 2 年、既支持自研客户端又能导出订阅用于 AI 辅助与日常网页查阅的用户",
		],
		notSuitableFor: [
			"对各档套餐明细、全平台流媒体专项解锁截图透明化有严格预审要求的用户",
		],
		risksAndLimits: [
			"除 18 元/100GB 主力档外，品牌原始文档未展开高阶套餐表，流媒体专项解锁缺少统一实测数据。",
		],
		peerComparison:
			"与同价位光年梯（同样 ¥18/月 IEPL + 自研/订阅双模式）相比：光年梯月流量多 10GB（110GB vs 100GB），但极连云自 2024 年起运营，历史年资略早于 2025 年成立的光年梯。",
		faqs: [
			{
				q: "同为 18 元 IEPL，极连云和光年梯应该怎么选？",
				a: "注重多拿 10GB 流量且采用 VLESS 明确标注的可以考察光年梯（110GB）；在意运营起始年份稍早一年且测速时间接近晚 23 点的可以优先看极连云（100GB）。",
			},
		],
		relatedGuides: [
			{ title: "ChatGPT / AI 高成功率访问机场筛选", url: "/recommend/chatgpt-airport/" },
			{ title: "10-20 元月付预算阶梯横评", url: "/recommend/budget-airport-guide/" },
		],
	},
	guangnianti: {
		slug: "guangnianti",
		accentColor: "#0284c7",
		seoTitle: "光年梯机场 2026 评测：18元 110GB IEPL + VLESS 与多端实测图解析",
		seoDescription:
			"光年梯（guangnian）客观评测：2025年新锐IEPL+VLESS专线，18元/月提供110GB流量支持自研及第三方导入，附 2026-08-11 14:38 CST 实测测速截图与优惠码 gnt6666。",
		h1: "光年梯（guangnian）评测：18 元 110GB IEPL + VLESS 与同类差异对比",
		overviewConclusion:
			"光年梯（guangnian）作为 2025 年成立的新锐专线品牌，采用 IEPL 专线与 VLESS 协议，在 18 元月付价格带提供 110GB 流量（比极连云同价位多出 10GB），支持自研客户端及第三方订阅，同时保留 2026-08-11 14:38 CST 测速截图。因品牌年轻，建议优先月付实测以验证长期抗压表现。",
		backgroundNote:
			"品牌资料明确将其定位为“介于低价套餐和综合型专线套餐之间”，并标注支持常见 AI 工具与主流流媒体使用场景。",
		packagesNote: "优惠码 gnt6666，主推 ¥18/月 110GB 方案，完整高阶多档价目待官网实时确认。",
		packages: [
			{ name: "光年梯主力方案", cycle: "月付", price: "¥18", traffic: "110GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "常见 AI 工具场景", status: "conditional", note: "品牌资料明确标注支持常见 AI 工具（vendor）" },
		],
		streamingServices: [
			{ name: "主流流媒体", status: "conditional", note: "品牌资料标注支持常见流媒体，缺少独立解锁矩阵图" },
		],
		topologySummary: "自研 / 第三方订阅客户端 → VLESS 协议 → IEPL 物理专线出口",
		suitableFor: [
			"预算锁定 18 元/月上下、需要明确 VLESS 协议支持且同时用 AI 工具与轻量流媒体的用户",
		],
		notSuitableFor: [
			"只信任运营满 3~5 年以上老厂且习惯提前充值半年/年付的保守用户",
		],
		risksAndLimits: [
			"2025 年上线品牌运行样本周期尚短，08-11 实测图摄于下午 14:38 (CST)，不能直接代替晚高峰拥堵期长期稳定证明。",
		],
		peerComparison:
			"18 元价位比极连云多 10GB/月流量且明文标注 VLESS；向上对比 20 元档则有流量更丰裕的一翻云（150GB）与老牌二猫云（130GB）。",
		faqs: [
			{
				q: "光年梯支持在苹果小火箭和 Clash Verge 中导入订阅吗？",
				a: "支持。品牌清单显示其既提供自研客户端，也开放第三方订阅链接导入。",
			},
		],
		relatedGuides: [
			{ title: "IPLC / IEPL 物理专线机场优势对比", url: "/recommend/airport-lines/" },
			{ title: "Clash / Sing-box 客户端兼容对比", url: "/clash-verge-rev/clash-airport/" },
		],
	},
	yifanyun: {
		slug: "yifanyun",
		accentColor: "#16a34a",
		seoTitle: "一翻云机场 2026 评测：全节点 IEPL + 原生住宅 IP、三协议与不限时包实测",
		seoDescription:
			"一翻云（yifan）全面评测：2025年运营，全节点IEPL专线搭配原生住宅IP，支持Hysteria 2/VLESS-Reality/SS三协议与不限设备，附2026-08-11测速截图及20元150GB/不限时全价目。",
		h1: "一翻云（yifan）评测：全节点 IEPL 住宅 IP 与 Hysteria2 / VLESS 三协议全兼容",
		overviewConclusion:
			"一翻云（yifan）自 2025 年运营，全节点采用 IEPL 物理专线并搭配原生住宅 IP，难得地同时支持 Hysteria 2、VLESS-Reality 与 Shadowsocks 三协议，不限速不限设备数。月付轻享版 20 元即含 150GB，且拥有三档永不过期不限时包，缺点是官方未提供免费试用。",
		backgroundNote:
			"节点覆盖香港、日本、美国、新加坡、台湾五地核心节点（比同价位机场明显补强台湾节点可用性），并具备 2026-08-11 00:21 CST 实测测速截图。",
		packagesNote: "优惠码 yfy6666（品牌说明另记 1FLYYUN 可打 9 折），支持 98元年付至 95元极致 1.2TB 月付。",
		packages: [
			{ name: "98¥·年付小包", cycle: "年付", price: "¥98", traffic: "60GB", trafficCycle: "每月" },
			{ name: "轻享版", cycle: "月付", price: "¥20", traffic: "150GB", trafficCycle: "每月" },
			{ name: "舒享版", cycle: "月付", price: "¥35", traffic: "350GB", trafficCycle: "每月" },
			{ name: "尊享版", cycle: "月付", price: "¥55", traffic: "600GB", trafficCycle: "每月" },
			{ name: "极致版", cycle: "月付", price: "¥95", traffic: "1.2TB", trafficCycle: "每月" },
			{ name: "轻享版·不限时包", cycle: "一次性付费", price: "¥100", traffic: "100GB", trafficCycle: "一次性" },
			{ name: "舒享版·不限时包", cycle: "一次性付费", price: "¥200", traffic: "250GB", trafficCycle: "一次性" },
			{ name: "尊享版·不限时包", cycle: "一次性付费", price: "¥400", traffic: "500GB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 00:21 CST 测速附图",
		benchmarks: [
			{ region: "香港住宅/专线", latencyMs: 23, downloadMbps: 477 },
			{ region: "台湾节点", latencyMs: 40, downloadMbps: 117 },
			{ region: "新加坡节点", latencyMs: 42, downloadMbps: 390 },
			{ region: "日本节点", latencyMs: 53, downloadMbps: 136 },
			{ region: "美国节点", latencyMs: 180, downloadMbps: 20 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注原生住宅 IP 支持" },
			{ name: "Gemini", status: "conditional", note: "视落地地区而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "supported", note: "品牌资料标注解锁（含台湾站）" },
			{ name: "HBO Max / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "Hysteria 2 / VLESS-Reality / SS 多协议 客户端 → 全节点 IEPL 专线 → 原生住宅 IP 落地",
		suitableFor: [
			"需要在 Sing-box / Clash / v2rayN 间切换 Hysteria 2 与 VLESS-Reality 等前沿抗阻断协议的玩家",
			"需要明确涵盖台湾原生 IP 解锁或 20元/150GB 大单价月付、不限设备的个人/团队",
		],
		notSuitableFor: [
			"希望免费领取试用流量后再决定是否付费零成本试错的用户（无官方免费试用）",
		],
		risksAndLimits: [
			"无免费试用期；2025 年新上线机场，建议先以 20 元单月或小包测稳；08-11 测速图为凌晨 00:21 (CST)。",
		],
		peerComparison:
			"20 元档中，一翻云给到 150GB（比 U1S1 多 30GB、比二猫云多 20GB），并且协议选项是全站最宽松的（Hysteria 2 + VLESS-Reality + SS），极适合新协议爱好者。",
		faqs: [
			{
				q: "一翻云支持哪些特殊协议？老旧客户端能用吗？",
				a: "它同时保留了通用的 Shadowsocks 与现代 VLESS-Reality / Hysteria 2 三协议。老客户端可继续用 SS，新版 Clash Verge Rev、Sing-box、Shadowrocket 可尽情启用 Hysteria 2 / Reality。",
			},
		],
		relatedGuides: [
			{ title: "Sing-box 跨平台全协议指南（Reality & Hy2）", url: "/tutorials/sing-box-config/" },
			{ title: "不限时流量包机场横向对比", url: "/recommend/pay-as-you-go-airport-guide/" },
		],
	},
	sogoyun: {
		slug: "sogoyun",
		accentColor: "#9333ea",
		seoTitle: "SOGO 云机场 2026 评测：15 国海量节点覆盖 IEPL + BGP 与专属客户端限制",
		seoDescription:
			"SOGO 云（sogo）深度评测：海外团队运营，全线 IEPL + 三网 BGP 优化覆盖 15 个国家和地区，仅支持自研专属客户端（无Clash订阅），附 08-11 18:57 CST 实测图与全部套餐明细。",
		h1: "SOGO 云（sogo）评测：15 国丰富地区节点覆盖与自研专属客户端体验",
		overviewConclusion:
			"SOGO 云（sogo）由海外团队主理，部署全线 IEPL 专线、三网 BGP 优化与 VLESS 协议，覆盖香港、台湾、日本、新加坡、美国、韩国等 **15 个国家和地区**，地区丰富度在 42 家收录中位居前茅。需注意 SOGO 云**不提供第三方订阅链接**，仅支持自研全平台客户端登录使用。",
		backgroundNote:
			"支持 Windows / macOS / iOS / Android 与主流软路由自研接入，提供 ¥98 年付小包至 ¥150 顶配及 120GB-1TB 四档不限时套餐，保留 2026-08-11 18:57:59 CST 实测图。",
		packagesNote: "可用优惠码 sss777（或官方资料记录 SOGO10000 享 9 折），官网未提供免费试用。",
		packages: [
			{ name: "小包-年付版", cycle: "年付", price: "¥98", traffic: "60GB", trafficCycle: "每月" },
			{ name: "基础版", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
			{ name: "优选版", cycle: "月付", price: "¥45", traffic: "350GB", trafficCycle: "每月" },
			{ name: "强化版", cycle: "月付", price: "¥80", traffic: "550GB", trafficCycle: "每月" },
			{ name: "顶配版", cycle: "月付", price: "¥150", traffic: "1.1TB", trafficCycle: "每月" },
			{ name: "SOGO基础不限时版", cycle: "一次性付费", price: "¥120", traffic: "120GB", trafficCycle: "一次性" },
			{ name: "SOGO至尊不限时版", cycle: "一次性付费", price: "¥850", traffic: "1.0TB", trafficCycle: "一次性" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 18:57 CST 测速附图",
		benchmarks: [
			{ region: "香港专线", latencyMs: 26, downloadMbps: 488 },
			{ region: "台湾节点", latencyMs: 39, downloadMbps: 118 },
			{ region: "新加坡节点", latencyMs: 43, downloadMbps: 401 },
			{ region: "日本节点", latencyMs: 57, downloadMbps: 137 },
			{ region: "美国节点", latencyMs: 140, downloadMbps: 17 },
		],
		aiServices: [
			{ name: "ChatGPT", status: "supported", note: "品牌资料标注支持" },
			{ name: "Claude / Gemini", status: "conditional", note: "视落地地区节点而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube / TikTok", status: "supported", note: "多国冷门地区有助于特定跨区内容" },
			{ name: "HBO Max / Spotify", status: "conditional", note: "视具体选定国家节点而定" },
		],
		topologySummary: "官方自研客户端（含部分软路由支持） → VLESS 协议 → 三网 BGP 优化 IEPL → 15 个国家和地区出口",
		suitableFor: [
			"因为跨境电商、小众社媒运营、学术特定国别检索而需要超过 15 个国家和地区切 IP 的用户",
			"不想手工管理订阅配置，乐于使用自带全平台客户软件的懒人/商务派",
		],
		notSuitableFor: [
			"必须依靠 Shadowrocket、Clash Verge Rev 或自定义复杂分流插件（Script/Rewrite）的高级极客",
		],
		risksAndLimits: [
			"明确无订阅链接导出；部分清单标签列为 2026 年新品牌梯队，历史抗风险长周期有待观察，官方亦未开放免费试用。",
		],
		peerComparison:
			"25 元/月 150GB 同档中有 SOGO云、可信云、速界、快狸四雄并立：SOGO云胜在 **15 国覆盖最广 + 不限时套餐选择多**，缺点是不支持 Clash 等第三方软件。",
		faqs: [
			{
				q: "SOGO 云支持哪些冷门国家地区？能在 Clash 里直接用吗？",
				a: "SOGO 云覆盖包括韩国及多个亚太欧美在内的 15 个国家与地区，但官方出于客户接入统一考虑，仅限通过自研客户端登录使用，无法直接将订阅 URL 导入 Clash。",
			},
		],
		relatedGuides: [
			{ title: "全球冷门节点与地区覆盖机场对比", url: "/recommend/node-regions/" },
			{ title: "42家机场快速对比筛选大厅", url: "/brands/" },
		],
	},
	kexinyun: {
		slug: "kexinyun",
		accentColor: "#059669",
		seoTitle: "可信云机场 2026 评测：25元 150GB IEPL + VLESS 与克制客观透明度分析",
		seoDescription:
			"可信云（kexin）客观评测：2024年运营，25元/月150GB IEPL专线+VLESS，支持第三方客户端，官方资料主动声明“AI与流媒体暂缺统一实测”，附 2026-08-11 15:32 CST 测速实测图与优惠码 kkk333。",
		h1: "可信云（kexin）评测：25 元 IEPL + VLESS 第三方兼容与坦诚数据披露",
		overviewConclusion:
			"可信云（kexin）自 2024 年稳定运营，主打 **IEPL 专线 + VLESS 协议**、25 元/月含 150GB 流量且完全开放第三方客户端（Clash/Shadowrocket）订阅导入。相比不少同价位商家过度宣传“永久解锁”，可信云在官方资料中明确声明“AI 与流媒体目前缺乏统一实测数据”，信息披露最为理性坦诚。",
		backgroundNote:
			"可信云保留了 2026-08-11 15:32:35 CST（日期依据同批次图片推算，发布页已加注核对说明）节点测速实测截图，协议配置符合现代轻量加密要求。",
		packagesNote: "优惠码 kkk333。主力 ¥25/月 150GB；更多长周期/大流量档位以官网实盘显示为准。",
		packages: [
			{ name: "基础 IEPL 套餐", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Gemini", status: "untested", note: "品牌方明确标注暂缺统一实测数据，应保持中性验证" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / TikTok", status: "untested", note: "品牌方未作夸大解锁承诺，建议月付自测所需节点" },
		],
		topologySummary: "Clash / Shadowrocket / Sing-box 订阅导入 → VLESS 协议 → IEPL 专线传输",
		suitableFor: [
			"反感夸大宣传、优先相信理性透明度高的老实技术型商家，且固定用第三方客户端的极客与上班族",
		],
		notSuitableFor: [
			"要求品牌商书面拍胸脯保证特定冷门区 AI 或独家流媒体永不掉线的买断型用户",
		],
		risksAndLimits: [
			"08-11 测速图的日历日期由同批次时间戳推算（reviewNote 已在 manifest 中提示核对）；暂缺统一解锁表意味着解锁体验可能随出口 IP 变动。",
		],
		peerComparison:
			"与同为 25 元/150GB 的 SOGO 云对比：可信云完美开放 Clash / 小火箭第三方导入；与同开放第三方的速界对比：速界更聚焦 AI 工具，可信云则胜在克制实事求是。",
		faqs: [
			{
				q: "为什么可信云资料写“AI 与流媒体缺乏统一实测”，是不是代表用不了？",
				a: "并不是用不了，而是代表商家和评测方都恪守事实原则——不做没有全样本支撑的绝对承诺。绝大多数 IEPL+VLESS 常规可用外网，但特定平台解锁（如 ChatGPT/Netflix）建议月付自检当前出口状态。",
			},
		],
		relatedGuides: [
			{ title: "预购前防坑自检 Checklist", url: "/recommend/pre-purchase-checklist/" },
			{ title: "Shadowrocket 小火箭完整规则教学", url: "/shadowrocket/" },
		],
	},
	sujie: {
		slug: "sujie",
		accentColor: "#7c3aed",
		seoTitle: "速界机场 2026 评测：25元 150GB IEPL + VLESS 主打 ChatGPT / Claude / Gemini 场景",
		seoDescription:
			"速界（sujie）深度评测：2024年运营，25元/月150GB支持自研客户端与第三方订阅，重点面向ChatGPT、Claude、Gemini等AI办公场景同时明确说明风控影响边界，附 2026-08-11 15:39 CST 实测图。",
		h1: "速界（sujie）评测：25 元档面向 AI 生产力与合规边界实事求是",
		overviewConclusion:
			"速界（sujie）于 2024 年上线，核心规格同样围绕 25 元/月 150GB **IEPL + VLESS 专线**，兼容自研客户端与 Clash / Shadowrocket 订阅导入。在 25 元档同批机场中，速界是明确将 **ChatGPT、Claude、Gemini** 等高频 AI 工具使用体验作为主力卖点的一家，同时也罕见坦承 AI 可用性受平台规则变动影响。",
		backgroundNote:
			"具备 2026-08-11 15:39:36 CST 实测节点测速截图（MAI-TEST-BOT 2.0.0-dev）。",
		packagesNote: "优惠码 sss1111，当前主打 ¥25/月 150GB 专线方案。",
		packages: [
			{ name: "速界主力方案", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Gemini", status: "conditional", note: "品牌资料重点聚焦高频 AI 访问场景，同时声明受 IP 及平台风控规则动态影响" },
		],
		streamingServices: [
			{ name: "主流流媒体", status: "untested", note: "08-11 仅收录速度测速图，流媒体专项需自测节点" },
		],
		topologySummary: "自研客户端 / Clash 分流订阅 → VLESS 加密传输 → IEPL 专线 → AI 友好落地节点",
		suitableFor: [
			"程序员、文案、跨境研发人员等日常重度依赖 ChatGPT、Claude 或 Gemini 的生产力用户",
			"同时需要自研免配置体验与 Clash 分流切换灵活性的双重用户",
		],
		notSuitableFor: [
			"试图寻找 5-8 元极限低价轻量盘，或者要求绝对零概率风控提示的用户",
		],
		risksAndLimits: [
			"任何共享节点都受 Cloudflare / OpenAI IP 声誉动态影响，使用 AI 平台时务必开启 Clash 规则分流（避开直连或风控高发节点，固定美国/新加坡/日本低风控节点）。",
		],
		peerComparison:
			"25 元 150GB 档中，若主要拿来看美剧选节点数量多可选 SOGO 云，若追求坦诚度不强求 AI 侧重可选可信云，若高频使用大模型编程与写稿优先选速界。",
		faqs: [
			{
				q: "使用速界访问 ChatGPT/Claude 怎么降低被 Cloudflare 拦截的概率？",
				a: "建议在 Clash Verge Rev 或 Shadowrocket 中锁定新加坡、日本或美西固定单个干净节点，并将 openai.com / claude.ai 域名固定分配在该策略组，避免负载均衡频繁自动切 IP 触发账号验证。",
			},
		],
		relatedGuides: [
			{ title: "ChatGPT 无法登录 / 1020 风控终极修复", url: "/issues/chatgpt-access-denied/" },
			{ title: "2026 ChatGPT 与 AI 工具专用机场精选", url: "/recommend/chatgpt-airport/" },
		],
	},
	kuaili: {
		slug: "kuaili",
		accentColor: "#ea580c",
		seoTitle: "快狸机场 2026 评测：25元 150GB VLESS + 喵速 4.7.0 实测截图与定位",
		seoDescription:
			"快狸（kuaili）客观评测：25元/月150GB高速跨境网络，2026-08-11 19:52 CST 使用 VLESS 协议及 miaosu 4.7.0 实测测速截图公开，优惠码 kkk2222，数据核验边界详述。",
		h1: "快狸（kuaili）评测：25 元 150GB 高速专线与 VLESS 实测快照分析",
		overviewConclusion:
			"快狸（kuaili）定位 25 元/月 150GB 高性能跨境网络，支持多设备同时在线，并保留有 **2026-08-11 19:52:22 CST** 的晚间实测截图（经由 `main 4.3.3 / miaosu 4.7.0` 测得，协议显示为原生 **VLESS**）。目前商用详细子套餐列表及解锁矩阵仍待继续核实，适合青睐 VLESS 协议性能、打算月付实测考察的用户。",
		backgroundNote:
			"在 2026-08-11 批次测试资产中，仅快狸与宇宙云使用了新版 miaosu 4.7.0 且在图中直接显示 VLESS 协议指标，数据清晰可溯源。",
		packagesNote: "优惠码 kkk2222，标准月付为 ¥25/月 150GB。",
		packages: [
			{ name: "快狸标准月付", cycle: "月付", price: "¥25", traffic: "150GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude / Gemini", status: "untested", note: "08-11 仅收录吞吐速度截图，暂缺 AI 专项解锁测试" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube", status: "untested", note: "暂缺统一流媒体解锁实测矩阵" },
		],
		topologySummary: "多设备客户端接入 → 原生 VLESS 协议 → 跨境高速专线节点",
		suitableFor: [
			"看重晚间 19:52 CST 真实 VLESS 测速快照、习惯首月 25 元亲自测试再留用的用户",
		],
		notSuitableFor: [
			"需要明确全部年付/永久包及事前流媒体解锁承诺后才愿体验的新手",
		],
		risksAndLimits: [
			"除 ¥25/150GB 基础规格及测速图外，历史公开文档的运营起始年份与客服信息较简略，谨慎直接选购超长周期。",
		],
		peerComparison:
			"对比同样处于 25 元/150GB 且资料更完整的速界、可信云、一翻云（20元/150GB），快狸的主要亮点在于保留了晚间 VLESS 喵速实测截图，信息补全后竞争力有望进一步体现。",
		faqs: [
			{
				q: "快狸实测图显示的 miaosu 4.7.0 / VLESS 是什么意思？",
				a: "miaosu 是常见的自动化节点速度探测后端内核（4.7.0 版本），VLESS 表示当次测试时节点实际采用的代理加密协议为现代低开销的 VLESS 协议。",
			},
		],
		relatedGuides: [
			{ title: "如何客观阅读机场测速图避免被 P 图误导", url: "/recommend/ranking-standards/" },
			{ title: "全站 42 家机场参数速查面板", url: "/brands/" },
		],
	},
	quanqiuyun: {
		slug: "quanqiuyun",
		accentColor: "#0891b2",
		seoTitle: "全球云机场 2026 评测：60+ 节点 Trojan/SS 2Gbps+ 专线与专属客户端制限分析",
		seoDescription:
			"全球云（quanqiu）客观评测：IPLC/IEPL专线中转覆盖60+全球节点，支持Trojan/SS及不限时套餐，仅用专属客户端（不支持第三方订阅），附2026-08-11 15:50 CST测速图与99元年付起全价目。",
		h1: "全球云（quanqiu）评测：60+ 全球节点覆盖、多档不限时与客户端边界",
		overviewConclusion:
			"全球云（quanqiu）主打 **IPLC / IEPL 专线中转**结合 **Trojan / Shadowsocks** 双协议与 2Gbps+ 带宽资源，覆盖 **60+ 全球多国家节点**，并配置了 ¥99/年轻量版、¥20-¥180 月付、三档不限时流量包以及 ¥680 独享私人节点。缺点同样明确：采用官方专属客户端登录模式，不支持导入 Clash 或小火箭第三方订阅。",
		backgroundNote:
			"保留 2026-08-11 15:50:43 CST 单日实测测速截图（MAI-TEST-BOT 2.0.0-dev），以及 2026-10-19 原文非晚高峰五地基准速度参考。",
		packagesNote: "可使用优惠码 qqy7777（或历史资料记载 qq88 享 8 折）。",
		packages: [
			{ name: "全球云·轻量版", cycle: "年付", price: "¥99", traffic: "59GB", trafficCycle: "每月" },
			{ name: "BGP·入门方案", cycle: "月付", price: "¥20", traffic: "120GB", trafficCycle: "每月" },
			{ name: "BGP·进阶方案", cycle: "月付", price: "¥40", traffic: "300GB", trafficCycle: "每月" },
			{ name: "BGP·高端方案", cycle: "月付", price: "¥100", traffic: "700GB", trafficCycle: "每月" },
			{ name: "BGP·商业方案", cycle: "月付", price: "¥180", traffic: "1500GB", trafficCycle: "每月" },
			{ name: "BGP·不限时轻量包", cycle: "一次性付费", price: "¥100", traffic: "100GB", trafficCycle: "一次性" },
			{ name: "BGP·不限时标准包", cycle: "一次性付费", price: "¥360", traffic: "400GB", trafficCycle: "一次性" },
			{ name: "独享私人专线节点", cycle: "月付", price: "¥680", traffic: "500GB", trafficCycle: "每月独享" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准 + 2026-08-11 15:50 CST 测速附图",
		benchmarks: [
			{ region: "香港专线", latencyMs: 25, downloadMbps: 489 },
			{ region: "台湾节点", latencyMs: 37, downloadMbps: 117 },
			{ region: "新加坡节点", latencyMs: 45, downloadMbps: 430 },
			{ region: "日本节点", latencyMs: 55, downloadMbps: 133 },
			{ region: "美国节点", latencyMs: 138, downloadMbps: 18 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地地区而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / YouTube / TikTok", status: "supported", note: "品牌资料标注支持" },
			{ name: "HBO Max / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "官方专属客户端 → Trojan / SS 双协议 → BGP 智能优化 + IPLC/IEPL 专线 → 60+ 全球多国节点",
		suitableFor: [
			"追求 60+ 节点广泛地区选择（含海外多国切换）与灵活不限时或独享私人套餐的用户",
			"愿意直接使用官方客户端、不折腾第三方软件分流配置的人群",
		],
		notSuitableFor: [
			"习惯 Clash / Sing-box / Shadowrocket 统一管理多机场节点合并策略组的重度玩家",
		],
		risksAndLimits: [
			"不支持第三方订阅链接；在完整名单表中标为 2026 年新品牌梯队，长期稳定口碑需以短月付体验逐步建立。",
		],
		peerComparison:
			"全球云和 SOGO 云都采用仅专属客户端的多节点路线；全球云月付入门门槛更低（¥20/120GB vs SOGO云 ¥25/150GB）且可选 Trojan/SS 与 680 元独享专线节点。",
		faqs: [
			{
				q: "全球云不支持第三方订阅，如果有多台不同设备怎么用？",
				a: "需在各设备的官方网站后台下载对应系统的专属客户端（Windows/Mac/iOS/Android）并直接用账号密码登录，无需人工粘贴订阅链接。",
			},
		],
		relatedGuides: [
			{ title: "不限时流量包高性价比推荐", url: "/recommend/pay-as-you-go-airport-guide/" },
			{ title: "国际冷门地区 IP 机场指南", url: "/recommend/node-regions/" },
		],
	},
	shanyue: {
		slug: "shanyue",
		accentColor: "#dc2626",
		seoTitle: "闪跃机场 2026 评测：纯 IPLC 专线极低延迟与 96元年付/24元闪动套餐解析",
		seoDescription:
			"闪跃（shanyue）深度评测：高端纯 IPLC 专线接入骨干网，主打晚高峰极低延迟与原生 IP 流媒体解锁，仅用专属客户端（无第三方订阅），附 2026-10-19 香港 23ms/548Mbps 基准及 8折码 shanyue。",
		h1: "闪跃（shanyue）评测：纯 IPLC 专线低延迟定位与全系套餐对比",
		overviewConclusion:
			"闪跃（shanyue）在专线推荐中定位偏中高端，采用纯 IPLC 物理专线并接入骨干网路由，在 2026-10-19 非晚高峰基准中香港达 **23ms / 548Mbps**（同批前列）。年付小包 ¥96（折 8 元/月），月付“闪动” ¥24 含 150GB。与隐形人、SOGO云一致，闪跃只提供专属客户端登录，无第三方订阅链接。",
		backgroundNote:
			"套餐命名清晰分为年付版及闪动、飞跃、瞬移、跃迁 4 档月付，高阶提供最高 1000GB/月流量。",
		packagesNote: "优惠码 shanyue 享 8 折（限闪动/飞跃/瞬移/跃迁 4 档月付，年付版不适用）。",
		packages: [
			{ name: "闪跃年付版", cycle: "年付", price: "¥96", traffic: "60GB", trafficCycle: "每月" },
			{ name: "闪动 (Flicker)", cycle: "月付", price: "¥24", traffic: "150GB", trafficCycle: "每月" },
			{ name: "飞跃 (Leap)", cycle: "月付", price: "¥44", traffic: "300GB", trafficCycle: "每月" },
			{ name: "瞬移 (Teleport)", cycle: "月付", price: "¥84", traffic: "600GB", trafficCycle: "每月" },
			{ name: "跃迁 (Warp)", cycle: "月付", price: "¥134", traffic: "1000GB", trafficCycle: "每月" },
		],
		benchmarkLabel: "2026-10-19 原文非晚高峰基准参考（未收录 08-11 截图包）",
		benchmarks: [
			{ region: "香港 IPLC", latencyMs: 23, downloadMbps: 548 },
			{ region: "台湾节点", latencyMs: 38, downloadMbps: 110 },
			{ region: "新加坡节点", latencyMs: 44, downloadMbps: 383 },
			{ region: "日本节点", latencyMs: 53, downloadMbps: 144 },
			{ region: "美国节点", latencyMs: 143, downloadMbps: 18 },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "supported", note: "品牌资料标注支持" },
			{ name: "Gemini", status: "conditional", note: "视落地地区而定" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / HBO Max", status: "supported", note: "品牌资料标注原生 IP 全解锁" },
			{ name: "YouTube / TikTok / Spotify", status: "supported", note: "品牌资料标注支持" },
		],
		topologySummary: "官方专属客户端（免配订阅） → 骨干网冗余接入 → 纯 IPLC 专线 → 原生 IP 节点",
		suitableFor: [
			"频繁在晚间高峰期高强度办公使用 ChatGPT/Claude 或深夜高画质追剧，且更重视纯专线稳定度的用户",
			"偏爱 96 元年付小试水或 ¥24（券后约 19.2 元）150GB 月付的重度日常用户",
		],
		notSuitableFor: [
			"坚持导出通用订阅到 Clash Verge Rev / 小火箭 / 软路由的用户",
		],
		risksAndLimits: [
			"仅限官方专属客户端，未披露底层具体加密协议名称，且无 08-11 独立截图留存，重度用户建议先月付体验晚间峰值。",
		],
		peerComparison:
			"相比同样 ¥24/月起且仅用专属客户端的隐形人（¥24/144GB），闪跃流量略多 6GB（150GB）且 10-19 基准香港跑出 548Mbps；若需第三方订阅灵活性，则可看 20 元档一翻云。",
		faqs: [
			{
				q: "闪跃的 8 折优惠码 shanyue 可以用在 96 元年付版上吗？",
				a: "不能。资料明确说明 shanyue 8 折券仅限于闪动、飞跃、瞬移与跃迁四档常规套餐，年付特惠小包不参与折扣。",
			},
		],
		relatedGuides: [
			{ title: "纯 IPLC 与 IEPL 专线底层差异科普", url: "/recommend/airport-lines/" },
			{ title: "低延迟跨境联机路线推荐指南", url: "/recommend/low-latency-airport/" },
		],
	},
	tiziyun: {
		slug: "tiziyun",
		accentColor: "#0d9488",
		seoTitle: "梯子云机场 2026 评测：自研一键登录客户端 + 通用订阅双支持（60+节点/2Gbps）",
		seoDescription:
			"梯子云（tiziyun）客观评测：2025年运营，罕见同时完整支持“小白一键登录自研全平台客户端”与“第三方通用订阅”的IEPL+VLESS机场，7.4元/月起、60+节点及2Gbps+带宽分析。",
		h1: "梯子云（tiziyun）评测：新手一键客户端与 Clash 通用订阅双生态兼顾",
		overviewConclusion:
			"梯子云（tiziyun）自 2025 年起运营，采用 **IEPL 专线 + VLESS 协议**，在当前品牌库中最大特色是打破了“要么只给自研App、要么让小白自己手配订阅”的隔阂——既提供极简一键登录全平台客户端，又保留完整的第三方通用订阅导出能力，年付入门折约 7.4 元/月起（60GB/月），配备快速响应在线工单。",
		backgroundNote:
			"品牌资料显示梯子云拥有海外专业技术团队常驻维护，节点数达 60+（覆盖港/日/新/美/台五大核心枢纽），具备 2Gbps+ 独立带宽及 500Mbps 高峰冗余设计（`vendor` 数据状态）。",
		packagesNote: "优惠码 tiziyun，已知核心年付折约 ¥7.4/月（60GB/月），常规月付参考 ¥22/月（120GB）。",
		packages: [
			{ name: "年付入门参考", cycle: "年付", price: "约 ¥7.4/月 (约¥89/年)", traffic: "60GB", trafficCycle: "每月" },
			{ name: "常规主力月付参考", cycle: "月付", price: "¥22", traffic: "120GB", trafficCycle: "每月" },
		],
		aiServices: [
			{ name: "ChatGPT / Claude", status: "conditional", note: "品牌资料表示覆盖高频 AI 生产力工具（vendor，暂缺独立截图）" },
		],
		streamingServices: [
			{ name: "Netflix / Disney+ / TikTok", status: "conditional", note: "品牌资料宣称完美解锁（vendor），实效需按本地测试" },
		],
		topologySummary: "自研全平台客户端（一键登录）/ 通用第三方订阅 → VLESS 协议 → IEPL 2Gbps+ 专线 → 五大核心枢纽",
		suitableFor: [
			"现在想要最省事的一键客户端入门，但未来打算进阶切换 Clash Verge Rev / 小火箭的成长期用户",
			"看重在线工单及时响应及年付低于 8 元/月轻量预算的新手",
		],
		notSuitableFor: [
			"非得有第三方 08-11/08-19 实测截图才愿出手买单的强实证派买家",
		],
		risksAndLimits: [
			"属于 2025 年上线年轻品牌且暂无本站独立实测截图（标明 `dataStatus: vendor`），官方宣传用语如“完美解锁”仅作厂商资料参考，仍应月付小额试水。",
		],
		peerComparison:
			"与同样约 60+ 节点、自研 App 的隐形人相比：梯子云完胜在同时保留第三方通用订阅、且年付和月付入门价均低于隐形人，客户迁移零沉没成本。",
		faqs: [
			{
				q: "买梯子云后，我在手机上用自研客户端，在电脑上能用 Clash Verge 吗？",
				a: "完全可以。这是梯子云相对只用专属客户端机场的核心优势——同时提供全平台自研 App 登录和第三方通用订阅链接，不同设备随你混搭。",
			},
		],
		relatedGuides: [
			{ title: "2026 全平台第三方代理客户端下载盘点", url: "/clash-verge-rev/" },
			{ title: "iOS 苹果小火箭机场推荐专题", url: "/recommend/iphone-airport/" },
		],
	},
};
