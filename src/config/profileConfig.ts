import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp",
	name: "ClashTizi 极客评测",
	bio: "专注 Clash Verge、Sing-box、小火箭客户端配置与优质 IPLC 专线机场深度评测",
	typewriter: {
		enable: true,
		speed: 60,
	},
	links: [
		{
			name: "机场推荐",
			icon: "material-symbols:rocket-launch",
			url: "/recommend/airport/",
		},
		{
			name: "Clash 教程",
			icon: "material-symbols:menu-book",
			url: "/tutorials/clash-verge-setup/",
		},
		{
			name: "排障中心",
			icon: "material-symbols:build-circle",
			url: "/issues/clash-nodes-timeout/",
		},
	],
};
