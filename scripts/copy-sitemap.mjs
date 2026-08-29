import { copyFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

async function main() {
	try {
		const sitemapIndex = resolve(distDir, "sitemap-index.xml");
		const sitemapXml = resolve(distDir, "sitemap.xml");
		await access(sitemapIndex);
		await copyFile(sitemapIndex, sitemapXml);
		console.log("Successfully created dist/sitemap.xml from sitemap-index.xml");
	} catch (err) {
		console.warn("Could not copy sitemap-index.xml to sitemap.xml:", err.message);
	}
}

main();
