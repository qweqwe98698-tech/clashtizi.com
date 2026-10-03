import fs from "node:fs";
import path from "node:path";

const distDir = "dist";
function getAllHtmlFiles(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList;
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			getAllHtmlFiles(fullPath, fileList);
		} else if (file.endsWith(".html")) {
			fileList.push(fullPath);
		}
	}
	return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log("Total HTML files scanned:", htmlFiles.length);

const titleMap = new Map();
const missingTitle = [];
const shortTitles = [];
const longTitles = [];
const redirectPages = [];

for (const file of htmlFiles) {
	const rel = path.relative(distDir, file).replace(/\\/g, "/");
	if (rel.startsWith("pio/")) continue;
	const html = fs.readFileSync(file, "utf-8");

	const isRedirect = /<meta[^>]*http-equiv=["']refresh["']/i.test(html) || /<title>Redirecting/i.test(html);
	if (isRedirect) {
		redirectPages.push(rel);
		continue;
	}

	const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	if (!m || !m[1].trim()) {
		missingTitle.push(rel);
		continue;
	}

	const title = m[1].trim();
	if (title.length < 15) {
		shortTitles.push({ rel, title, len: title.length });
	}
	if (title.length > 70) {
		longTitles.push({ rel, title, len: title.length });
	}

	if (!titleMap.has(title)) {
		titleMap.set(title, []);
	}
	titleMap.get(title).push(rel);
}

console.log("\n=== REDIRECT PAGES ===");
console.log(`Count: ${redirectPages.length}`);

console.log("\n=== MISSING TITLES ===");
console.log(`Count: ${missingTitle.length}`);
if (missingTitle.length) console.log(missingTitle);

console.log("\n=== SHORT TITLES (< 15 chars) ===");
console.log(`Count: ${shortTitles.length}`);
shortTitles.forEach(t => console.log(`  - [${t.len}] ${t.title} (${t.rel})`));

console.log("\n=== LONG TITLES (> 70 chars) ===");
console.log(`Count: ${longTitles.length}`);
longTitles.forEach(t => console.log(`  - [${t.len}] ${t.title} (${t.rel})`));

console.log("\n=== DUPLICATE TITLES (Bing Rule 113) ===");
const duplicates = [...titleMap.entries()].filter(([t, urls]) => urls.length > 1);
console.log(`Total duplicate title sets: ${duplicates.length}`);
for (const [t, urls] of duplicates) {
	console.log(`\nDuplicate Title: "${t}" (${urls.length} pages)`);
	urls.forEach(u => console.log(`  - ${u}`));
}
