import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{
			name: "⚡ 机场推荐",
			url: "/recommend/airport/",
			icon: "material-symbols:rocket-launch",
		},
		{
			name: "📖 客户端教程",
			url: "/archive/",
			icon: "material-symbols:menu-book",
			children: [
				{
					name: "Clash Verge Rev 配置教程",
					url: "/clash-verge-rev/",
					icon: "material-symbols:terminal",
				},
				{
					name: "Shadowrocket 小火箭教程",
					url: "/shadowrocket/",
					icon: "material-symbols:rocket",
				},
				{
					name: "Sing-box 跨平台配置全指南",
					url: "/tutorials/sing-box-config/",
					icon: "material-symbols:box",
				},
			],
		},
		{
			name: "🛠️ 故障排障",
			url: "/archive/",
			icon: "material-symbols:build",
			children: [
				{
					name: "Clash 节点超时全红排查",
					url: "/issues/clash-nodes-timeout/",
					icon: "material-symbols:warning",
				},
				{
					name: "ChatGPT 1020 报错解决",
					url: "/issues/chatgpt-access-denied/",
					icon: "material-symbols:smart-toy",
				},
			],
		},
		LinkPreset.Archive,
	],
};

