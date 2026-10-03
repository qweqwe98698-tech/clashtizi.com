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

const descMap = new Map();
const titleMap = new Map();

for (const file of htmlFiles) {
	const rel = path.relative(distDir, file).replace(/\\/g, "/");
	if (rel.startsWith("pio/")) continue;
	const html = fs.readFileSync(file, "utf-8");
	
	const mDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
	const desc = mDesc ? mDesc[1].trim() : null;
	if (desc) {
		if (!descMap.has(desc)) descMap.set(desc, []);
		descMap.get(desc).push({ rel, len: desc.length });
	}

	const mTitle = html.match(/<title>([^<]*)<\/title>/i);
	const title = mTitle ? mTitle[1].trim() : null;
	if (title) {
		if (!titleMap.has(title)) titleMap.set(title, []);
		titleMap.get(title).push(rel);
	}
}

console.log("=== DUPLICATE DESCRIPTIONS AUDIT ===");
const duplicateDescs = [...descMap.entries()].filter(([d, list]) => list.length > 1);
console.log(`Total duplicate description sets: ${duplicateDescs.length}`);
for (const [d, list] of duplicateDescs) {
	console.log(`\nDesc (len ${d.length}): "${d.slice(0, 50)}..."`);
	console.log(`Pages count: ${list.length}`);
	for (const item of list.slice(0, 5)) {
		console.log(`  - ${item.rel}`);
	}
	if (list.length > 5) console.log(`  ... and ${list.length - 5} more`);
}

console.log("\n=== DUPLICATE TITLES AUDIT ===");
const duplicateTitles = [...titleMap.entries()].filter(([t, list]) => list.length > 1);
console.log(`Total duplicate title sets: ${duplicateTitles.length}`);
for (const [t, list] of duplicateTitles) {
	console.log(`\nTitle: "${t}"`);
	console.log(`Pages count: ${list.length}`);
	for (const rel of list.slice(0, 5)) {
		console.log(`  - ${rel}`);
	}
	if (list.length > 5) console.log(`  ... and ${list.length - 5} more`);
}
