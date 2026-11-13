import type { APIRoute } from "astro";

const siteUrl = import.meta.env.SITE || "https://clashtizi.com/";

const robotsTxt = `
User-agent: Googlebot
Allow: /
Disallow: /pio/

User-agent: Bingbot
Allow: /
Disallow: /pio/

User-agent: Baiduspider
Allow: /
Disallow: /pio/

User-agent: yisouspider
Allow: /
Disallow: /pio/

User-agent: *
Allow: /
Disallow: /pio/

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
