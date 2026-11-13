import { airports42Data } from "../data/airports-42";

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

const brandBySlug = (slug: string) => {
	const found = airports42Data.find((b) => b.slug === slug);
	if (!found || !found.registerUrl) {
		throw new Error(`Missing brand or registerUrl in airports-42.ts for slug: ${slug}`);
	}
	return found;
};

const gsy = brandBySlug("guangsuyun");
const muguang = brandBySlug("muguang");
const feimao = brandBySlug("feimaoyun");
const weifeng = brandBySlug("weifeng");
const dalaoyun = brandBySlug("dalaoyun");
const xingdaomeng = brandBySlug("xingdaomeng");
const yinxingren = brandBySlug("yinxingren");
const ermaoyun = brandBySlug("ermaoyun");
const wuyou = brandBySlug("wuyoulianjie");
const weitu = brandBySlug("weituyun");
const firefly = brandBySlug("firefly");

export const commercialConfig: CommercialConfig = {
	enable: true,
	title: "商业合作区",
	subtitle: "优质专线 / 晚高峰实测",
	partners: [
		{
			name: gsy.name,
			desc: "IEPL双专线 · 7.5元/月起",
			badge: "主推 8折",
			badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
			coupon: gsy.coupon,
			url: gsy.registerUrl!,
			highlight: true,
		},
		{
			name: muguang.name,
			desc: "BGP智能调度 · 20元/月起",
			badge: "专线",
			badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20",
			coupon: muguang.coupon,
			url: muguang.registerUrl!,
			highlight: true,
		},
		{
			name: feimao.name,
			desc: "纯净专线 · 7元/月起",
			badge: "8折",
			badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
			coupon: feimao.coupon,
			url: feimao.registerUrl!,
			highlight: true,
		},
		{
			name: weifeng.name,
			desc: "平价稳定 · 7.0元/月起",
			badge: "9折",
			badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
			coupon: weifeng.coupon,
			url: weifeng.registerUrl!,
		},
		{
			name: dalaoyun.name,
			desc: "IEPL专线 · 5.6元/月起",
			badge: "7折",
			badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20",
			coupon: dalaoyun.coupon,
			url: dalaoyun.registerUrl!,
		},
		{
			name: xingdaomeng.name,
			desc: "企业内网 · 8.0元/月起",
			badge: "9折",
			badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
			coupon: xingdaomeng.coupon,
			url: xingdaomeng.registerUrl!,
		},
		{
			name: yinxingren.name,
			desc: "IPLC专线 · 专属客户端",
			badge: "8折",
			badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20",
			coupon: yinxingren.coupon,
			url: yinxingren.registerUrl!,
		},
		{
			name: ermaoyun.name,
			desc: "4K优化 · 20元/月起",
			badge: "4K优化",
			badgeColor: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20",
			coupon: ermaoyun.coupon,
			url: ermaoyun.registerUrl!,
		},
		{
			name: wuyou.name,
			desc: "免转订阅 · 6元轻量起",
			badge: "轻量",
			badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
			coupon: wuyou.coupon,
			url: wuyou.registerUrl!,
		},
		{
			name: weitu.name,
			desc: "三网优化 · 14.9元/月起",
			badge: "9折",
			badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
			coupon: weitu.coupon,
			url: weitu.registerUrl!,
		},
		{
			name: "Firefly",
			desc: "IPLC专线 · 6档全套餐",
			badge: "IPLC",
			badgeColor: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
			coupon: firefly.coupon,
			url: firefly.registerUrl!,
		},
	],
};