import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{
			name: "⚡ 机场推荐",
			url: "/recommend/airport/",
			icon: "material-symbols:rocket-launch",
			children: [
				{
					name: "2026 翻墙机场权威排行榜",
					url: "/recommend/airport/",
					icon: "material-symbols:trophy",
				},
				{
					name: "🏢 42家机场品牌库",
					url: "/brands/",
					icon: "material-symbols:apps",
				},
				{
					name: "IPLC / IEPL 物理专线机场",
					url: "/recommend/airport-lines/",
					icon: "material-symbols:cable",
				},
				{
					name: "高性价比平价/低价机场评测",
					url: "/recommend/cheap-airport/",
					icon: "material-symbols:savings",
				},
				{
					name: "4K 流媒体与 ChatGPT 解锁专线",
					url: "/recommend/streaming-airport/",
					icon: "material-symbols:live-tv",
				},
			],
		},
		{
			name: "🌐 梯子与外网",
			url: "/tizi/",
			icon: "material-symbols:language",
			children: [
				{
					name: "国内怎么上外网？（入门指南）",
					url: "/tizi/how-to-access-foreign-websites/",
					icon: "material-symbols:explore",
				},
				{
					name: "梯子是什么？常用梯子工具盘点",
					url: "/tizi/",
					icon: "material-symbols:help",
				},
				{
					name: "TUN 模式原理与虚拟网卡配置",
					url: "/tizi/tun/",
					icon: "material-symbols:lan",
				},
				{
					name: "机场 VPN 与普通梯子区别对比",
					url: "/tizi/vpn-vs-tizi/",
					icon: "material-symbols:compare-arrows",
				},
			],
		},
		{
			name: "🎁 免费节点与试用",
			url: "/recommend/free-trial/",
			icon: "material-symbols:featured-seasonal-and-gifts",
			children: [
				{
					name: "2026 免费机场试用与送流量活动",
					url: "/recommend/free-trial/",
					icon: "material-symbols:redeem",
				},
				{
					name: "Clash / v2rayN 免费节点获取",
					url: "/recommend/free-nodes/",
					icon: "material-symbols:hub",
				},
			],
		},
		{
			name: "📖 客户端教程",
			url: "/clash-verge-rev/",
			icon: "material-symbols:menu-book",
			children: [
				{
					name: "Clash Verge Rev 电脑客户端配置",
					url: "/clash-verge-rev/",
					icon: "material-symbols:terminal",
				},
				{
					name: "v2rayN Windows 配置教程",
					url: "/v2rayn/",
					icon: "material-symbols:desktop-windows",
				},
				{
					name: "Shadowrocket 小火箭配置与规则",
					url: "/shadowrocket/",
					icon: "material-symbols:phone-iphone",
				},
				{
					name: "Sing-box 跨平台全协议指南",
					url: "/tutorials/sing-box-config/",
					icon: "material-symbols:box",
				},
			],
		},
		{
			name: "🛠️ 故障排障",
			url: "/tizi/troubleshooting/",
			icon: "material-symbols:build",
			children: [
				{
					name: "全站网络故障排障中心 (总纲)",
					url: "/tizi/troubleshooting/",
					icon: "material-symbols:medical-services",
				},
				{
					name: "梯子连上但打不开网页排查",
					url: "/tizi/connected-no-internet/",
					icon: "material-symbols:wifi-off",
				},
				{
					name: "Clash 节点超时全红排查",
					url: "/issues/clash-nodes-timeout/",
					icon: "material-symbols:warning",
				},
				{
					name: "梯子突然用不了快速定位",
					url: "/tizi/suddenly-not-working/",
					icon: "material-symbols:error",
				},
				{
					name: "ChatGPT 访问报错与封锁排障",
					url: "/issues/chatgpt-access-denied/",
					icon: "material-symbols:smart-toy",
				},
			],
		},
		LinkPreset.Archive,
	],
};
