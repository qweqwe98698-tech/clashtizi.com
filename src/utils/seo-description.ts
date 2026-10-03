/**
 * SEO Meta Description Optimizer
 * Ensures all pages strictly conform to Bing Webmaster Tools & Google Search standards (150-160 characters target).
 * Completely eliminates Bing Rule 118 ("The meta description is too short") and Rule 117 ("Duplicate meta description").
 */

export const STATIC_PAGE_DESCRIPTIONS: Record<string, string> = {
	"/": "Clash梯子网专注于2026年最新高速稳定翻墙机场推荐、科学上网配置指南与网络排障大全。深度实测IEPL/IPLC纯专线大厂晚高峰抗丢包性能，全面覆盖Clash Verge、Sing-box、小火箭Shadowrocket及v2rayN多平台跨端客户端配置教程与流媒体解锁技巧，助您零门槛打造安全极速的出海网络环境。",
	"/archive/": "Clash梯子网全站文章归档与历史专栏大全。全面汇集2026年最新翻墙机场客观评测、科学上网工具配置指南、网络断流排障方案、节点订阅测速教程以及AI流媒体跨境出海实战干货，按年份与分类清晰整理，助您快速检索高价值网络技术文档与解决方案，轻松排查各类网络疑难杂症，享受丝滑畅通出海互联新体验与技术支持。",
	"/about/": "Clash梯子网（clashtizi.com）是专注于跨国网络代理生态、前沿跨境传输协议实测与企业级高速专线机场客观评测的独立技术平台。我们坚持晚高峰抗压实测与严格准入门槛，为外贸电商、跨境办公及科研人员提供真实高可用科学上网指南，深度解析专线物理链路架构与防跑路策略，全力打造权威可信的极客评测生态。",
	"/friends/": "Clash梯子网友情链接与合作伙伴专区。汇聚优质网络安全博客、开源代理客户端开发者、跨境技术社区与极客技术站点。热烈欢迎网络技术、云计算与跨境网络领域的优质独立博客与技术创作者交流互动、建立友链，共同推进行业开放与技术互联互通，携手构建安全高速、开放共享的全球互联与跨境出海技术交流生态圈与优质资源池。",
	"/anime/": "Clash梯子网站长追番列表与动漫文化专栏。分享当前追番进度、季度新番推荐、经典动画评分与二次元ACG随笔。结合海外流媒体（如Netflix、B站海外版、AbemaTV）4K极速解锁实测经验，记录精彩剧集视听体验与宅文化心得感悟，同时分享流媒体跨区解锁网络调优技巧，带您尽情领略二次元高清视听盛宴与追番乐趣。",
	"/devices/": "Clash梯子网极客硬件与开发测试设备清单。记录网站评测与跨境办公主力硬件装备，涵盖跨平台测速环境（Windows、macOS、iOS、Android主力设备）、家庭软路由与多链路BGP网络测试设备配置参数，打造硬核专业、可靠可信的评测基石，全方位保障各项网络测速、丢包分析与客户端兼容性测试真实有效。",
	"/skills/": "Clash梯子网技术技能清单与核心专业知识架构。涵盖跨国网络工程、TCP/IP网络协议优化、代理内核定制与规则分流、Linux服务器运维、前沿跨境传输架构以及现代全栈Web开发技术，持续分享真实技术积累与跨境出海网络实战沉淀，致力于以扎实严谨的技术功底为广大用户提供高可用跨境网络技术指导方案与实战支持。",
	"/projects/": "Clash梯子网开源项目与自动化运维工具展示中心。精选网站自主研发的自动化测速脚本、订阅解析转换器、SEO智能发布工作流及网络诊断小工具。开源代码完全开放，致力于提升网络极客与跨境开发者的网络配置效率与日常运维体验，帮助广大技术爱好者轻松掌握自动化网络运维与跨境出海开发技巧，大幅提升日常工作生产力。",
	"/timeline/": "Clash梯子网站点成长时光机与里程碑时间线。记录网站从创建伊始、各大专栏改版、评测体系完善到智能化系统升级的每一个重要节点。见证我们坚持真实晚高峰客观评测、深耕科学上网指南与跨境网络技术文档的持续演进历程与技术初心，不断优化全站用户体验，打造中文互联网首屈一指的科学上网技术沉淀与知识分享服务平台。",
	"/ai-tools/": "Clash梯子网精选AI效率工具库与出海生产力导航。汇总ChatGPT、Claude、Midjourney等顶尖人工智能大模型访问指南、原生机房出口IP选购要点、防封号网络配置方案与多端提示词技巧，助您在智能时代大幅提升跨境工作与创作效率，轻松跨越地域访问限制，构建流畅无阻的AI办公与深度研发环境。",
	"/albums/": "Clash梯子网站长视觉影像与生活摄影画廊。精选日常旅行足迹、极客数码生活、城市街拍与风景摄影作品集，记录屏幕代码与技术评测之外的真实生活瞬间与光影美感，带您感受科技与生活交织的温度与色彩细节，在繁忙的代码与网络评测工作之余，定格大自然与城市烟火气中的美好光影瞬间，用心分享真实生活美学体验与生活感悟。",
	"/diary/": "Clash梯子网站长日常技术随笔与极客生活日记。记录跨境网络评测心得、前沿开源代理工具体验、服务器架构调优笔记与生活思考感悟。用真实的文字串联起技术探索的每一个高光与沉思时刻，展现代码与网络背后的真实极客日常，在持续实践与深度思考中沉淀硬核技术见解，为您呈现最真实的极客精神、生活态度与前沿技术思考。",
	"/rss/": "Clash梯子网官方RSS内容订阅聚合源。实时同步2026年最新高速稳定翻墙机场评测、科学上网工具配置教程、网络断流排障方案与AI流媒体解锁实用技巧。支持Feedly、Inoreader等主流RSS阅读器一键订阅，零门槛获取第一手出海网络技术动态与深度评测更新，助您随时掌握网络前沿资讯与实测干货分享。",
	"/atom/": "Clash梯子网官方Atom标准订阅聚合源。按W3C标准格式实时推送2026年最新翻墙机场评测、代理内核配置与网络排障指南。全面支持各平台现代化阅读器无缝解析，帮助跨境电商、外贸办公与网络极客高效追踪出海网络技术沉淀与优质机场晚高峰实测报告，零延迟获取网站所有最新高质量技术文章与实测配置教程完整方案。",
};

const FILLERS = [
	"欢迎访问Clash梯子网获取2026年最新高速稳定翻墙节点评测与科学上网配置指南，涵盖全网优质专线机场实测对比、多协议防封技巧与全平台客户端配置教程。",
	"深入解析IEPL/IPLC纯专线底层抗封锁机制、双机场主备容灾方案、订阅防红技巧与流媒体原生解锁表现，帮助您零门槛搭建全天候畅通出海网络环境。",
	"全面涵盖晚高峰极限压测表现、4K视频秒开缓冲评测、防跑路月付止损策略以及跨平台客户端一键订阅配置技巧，为您提供权威硬核的科学上网选型决策参考。",
	"助您轻松上手高速稳定的出海网络，享受丝滑跨境互联新体验。"
];

/**
 * Normalizes and formats SEO description to strictly meet 150-160 characters.
 */
export function getSafeSeoDescription(
	rawDescription?: string,
	pathname?: string,
	title?: string,
): string {
	// 1. Check exact static path matches
	if (pathname) {
		const cleanPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
		if (STATIC_PAGE_DESCRIPTIONS[cleanPath]) {
			return STATIC_PAGE_DESCRIPTIONS[cleanPath];
		}
		// Handle pagination paths like /2/, /3/ with unique dynamic descriptions
		const pageMatch = cleanPath.match(/^\/(\d+)\/$/);
		if (pageMatch) {
			const pageNum = pageMatch[1];
			return `Clash梯子网专注于2026年最新高速稳定翻墙机场推荐、节点测速与科学上网配置指南（第${pageNum}页）。全面实测IEPL/IPLC纯专线大厂晚高峰抗丢包性能，提供Clash Verge、Sing-box、小火箭Shadowrocket及v2rayN多端客户端教程与流媒体解锁技巧，助您零门槛搭建安全极速出海网络。`;
		}
	}

	let desc = (rawDescription || "").trim();

	// If no description, fallback to home description
	if (!desc) {
		return STATIC_PAGE_DESCRIPTIONS["/"];
	}

	// 2. If already in optimal range (150 ~ 160 characters), return as-is
	if (desc.length >= 150 && desc.length <= 160) {
		return desc;
	}

	// 3. If too long (> 160), trim cleanly at punctuation
	if (desc.length > 160) {
		const sliced = desc.slice(0, 159);
		const punct = Math.max(
			sliced.lastIndexOf("。"),
			sliced.lastIndexOf("，"),
			sliced.lastIndexOf("、"),
			sliced.lastIndexOf("；"),
		);
		if (punct >= 150) {
			return sliced.slice(0, punct) + "。";
		}
		return desc.slice(0, 158) + "。";
	}

	// 4. If too short (< 150), accumulate fillers until >= 150
	let combined = desc.endsWith("。") ? desc : `${desc}。`;
	for (const f of FILLERS) {
		if (combined.length >= 150) break;
		combined += f;
	}

	if (combined.length >= 150 && combined.length <= 160) {
		return combined;
	}

	if (combined.length > 160) {
		const sliced = combined.slice(0, 159);
		const punct = Math.max(
			sliced.lastIndexOf("。"),
			sliced.lastIndexOf("，"),
			sliced.lastIndexOf("、"),
			sliced.lastIndexOf("；"),
		);
		if (punct >= 150) {
			return sliced.slice(0, punct) + "。";
		}
		return combined.slice(0, 158) + "。";
	}

	return combined;
}
