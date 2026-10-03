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
console.log("Total HTML files:", htmlFiles.length);

const missing = [];
const tooLong = [];
const tooShort = [];
const descMap = new Map();

for (const file of htmlFiles) {
	const rel = path.relative(distDir, file).replace(/\\/g, "/");
	if (rel.startsWith("pio/")) continue;
	const html = fs.readFileSync(file, "utf-8");
	const m = html.match(
		/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
	);
	if (!m || !m[1].trim()) {
		missing.push(rel);
	} else {
		const d = m[1].trim();
		if (d.length > 160) tooLong.push({ rel, len: d.length, d });
		if (d.length < 150) tooShort.push({ rel, len: d.length, d });
		if (descMap.has(d)) {
			descMap.get(d).push(rel);
		} else {
			descMap.set(d, [rel]);
		}
	}
}

console.log("Missing description:", missing.length, missing);
console.log("Too long (> 160 chars):", tooLong.length);
if (tooLong.length) console.log(tooLong.slice(0, 5));
console.log("Too short (< 150 chars):", tooShort.length);
if (tooShort.length) console.log(tooShort.slice(0, 5));

const duplicates = [...descMap.entries()].filter(
	([d, urls]) => urls.length > 1,
);
console.log("Duplicate descriptions:", duplicates.length);
if (duplicates.length) {
	console.log("Top duplicates:");
	duplicates.slice(0, 8).forEach(([d, urls]) => {
		console.log(
			`- (${urls.length} pages, len ${d.length}): ${d.slice(0, 60)}...`,
		);
		console.log("  Pages:", urls.slice(0, 3));
	});
}
