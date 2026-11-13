import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const postsDir = path.join(rootDir, "src/content/posts");
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");
const vercelJsonPath = path.join(rootDir, "vercel.json");

if (!fs.existsSync(postsDir)) {
	console.log("No posts directory found.");
	process.exit(0);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
const redirects = [];
const vercelRedirects = [];

for (const file of files) {
	const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
	const permMatch = content.match(/permalink:\s*['"]?([^'"\n\r]+)/);
	if (permMatch) {
		const slug = file.replace(/\.(md|mdx)$/, "");
		let target = permMatch[1].trim();
		if (!target.startsWith("/")) target = `/${target}`;
		if (!target.endsWith("/")) target = `${target}/`;

		redirects.push(`/posts/${slug}/ ${target} 301`);
		redirects.push(`/posts/${slug} ${target} 301`);

		vercelRedirects.push({
			source: `/posts/${slug}`,
			destination: target,
			permanent: true,
		});
		vercelRedirects.push({
			source: `/posts/${slug}/`,
			destination: target,
			permanent: true,
		});
	}
}

// 1. Write public/_redirects
fs.mkdirSync(publicDir, { recursive: true });
const redirectsContent = `# Cloudflare Pages 301 Redirects\n${redirects.join("\n")}\n`;
fs.writeFileSync(path.join(publicDir, "_redirects"), redirectsContent, "utf-8");
console.log(`✓ Generated public/_redirects with ${redirects.length} rules.`);

// 2. Write dist/_redirects if dist exists
if (fs.existsSync(distDir)) {
	fs.writeFileSync(path.join(distDir, "_redirects"), redirectsContent, "utf-8");
	console.log(`✓ Copied _redirects to dist/_redirects.`);
}

// 3. Sync vercel.json
if (fs.existsSync(vercelJsonPath)) {
	try {
		const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, "utf-8"));
		vercelConfig.redirects = vercelRedirects;
		fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, "\t") + "\n", "utf-8");
		console.log(`✓ Updated vercel.json with ${vercelRedirects.length} redirects.`);
	} catch (e) {
		console.warn(`Failed to update vercel.json: ${e.message}`);
	}
}
