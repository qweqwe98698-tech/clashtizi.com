import type { APIRoute } from "astro";

const siteUrl = import.meta.env.SITE || "https://clashtizi.com/";

const robotsTxt = `
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: yisouspider
Allow: /

User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteUrl).href}
Sitemap: ${new URL("sitemap-0.xml", siteUrl).href}
Sitemap: ${new URL("sitemap.xml", siteUrl).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
