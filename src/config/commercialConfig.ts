export interface CommercialPartner {
	name: string;
	desc: string;
	badge: string;
	badgeColor?: string;
	coupon?: string;
	url: string;
	highlight?: boolean;
}

export interface CommercialConfig {
	enable: boolean;
	title: string;
	subtitle?: string;
	partners: CommercialPartner[];
}

export const commercialConfig: CommercialConfig = {
	enable: true,
	title: "商业合作区",
	subtitle: "优质专线 / 晚高峰实测",
	partners: [
		{
			name: "光速云",
			desc: "IEPL专线 · 7.5元/月起",
			badge: "8折",
			badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
			coupon: "AMM",
			url: "https://sahude.gsyvipaff.com/#/?code=keqgvT5Y",
			highlight: true,
		},
		{
			name: "飞猫云",
			desc: "纯净专线 · 4K秒开",
			badge: "8折",
			badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
			coupon: "flycat888",
			url: "https://guangs.flycataff.com/#/?code=6uq0Xe9y",
			highlight: true,
		},
		{
			name: "微风网络",
			desc: "平价稳定 · 7.0元/月起",
			badge: "9折",
			badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
			coupon: "flat888",
			url: "https://edp01.breezenetaff.com/#/?code=t3huofyI",
		},
		{
			name: "星岛梦",
			desc: "企业内网 · 8.0元/月起",
			badge: "9折",
			badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
			coupon: "nmw888",
			url: "https://guangs.xingdaomeng.com/#/?code=1TynBYnR",
		},
		{
			name: "无忧链接",
			desc: "IPLC专线 · 极速出海",
			badge: "推荐",
			badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
			coupon: "wuyou",
			url: "https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL",
		},
		{
			name: "唯兔云",
			desc: "原生落地 · 14.9元/月起",
			badge: "9折",
			badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
			coupon: "rabbit",
			url: "https://guangs.v2yunvipaff.com/#/?code=xIutqOBA",
		},
	],
};