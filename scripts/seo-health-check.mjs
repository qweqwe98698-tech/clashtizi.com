import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");

console.log("\n=======================================================");
console.log("🔍 RUNNING SEO HEALTH & RELEASE SAFETY CHECK");
console.log("=======================================================\n");

let hasCriticalError = false;
const issues = [];
const stats = {
  totalPages: 0,
  indexablePages: 0,
  noindexPages: 0,
  canonicalErrors: 0,
  brokenLinks: 0,
  sitemapUrls: 0,
  schemaErrors: 0,
  duplicateTitles: 0,
  duplicateH1s: 0,
  suspiciousPages: 0
};

// Helper: Recursively get all HTML files
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

// 1. Robots.txt Check
console.log("1️⃣ Checking /robots.txt...");
const robotsPath = path.join(distDir, "robots.txt");
let robotsStatus = "PASS";
if (!fs.existsSync(robotsPath)) {
  robotsStatus = "FAIL (Missing robots.txt)";
  issues.push({ level: "CRITICAL", msg: "robots.txt file not found in dist/" });
  hasCriticalError = true;
} else {
  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  if (/Disallow:\s*\/\s*$/m.test(robotsContent) && !/Allow:\s*\//.test(robotsContent)) {
    robotsStatus = "FAIL (全站禁止抓取: Disallow: / found)";
    issues.push({ level: "CRITICAL", msg: "robots.txt contains Disallow: / blocking all search engine crawlers!" });
    hasCriticalError = true;
  } else if (!robotsContent.includes("sitemap.xml") && !robotsContent.includes("sitemap-index.xml")) {
    robotsStatus = "WARN (No Sitemap declaration)";
    issues.push({ level: "WARN", msg: "robots.txt does not declare Sitemap directive." });
  } else {
    console.log("   ✓ robots.txt permits search crawlers and references sitemap.");
  }
}

// 2. Sitemap Check
console.log("\n2️⃣ Checking Sitemap...");
const sitemapPath = path.join(distDir, "sitemap.xml");
const sitemap0Path = path.join(distDir, "sitemap-0.xml");
let sitemapStatus = "PASS";
let sitemapUrls = [];

const activeSitemap = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapPath;

if (!fs.existsSync(activeSitemap)) {
  sitemapStatus = "FAIL (Missing sitemap.xml)";
  issues.push({ level: "CRITICAL", msg: "Sitemap xml file not found in dist/" });
  hasCriticalError = true;
} else {
  const sitemapContent = fs.readFileSync(activeSitemap, "utf-8");
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, "").trim());
  stats.sitemapUrls = sitemapUrls.length;

  if (sitemapUrls.length === 0) {
    sitemapStatus = "FAIL (Empty Sitemap)";
    issues.push({ level: "CRITICAL", msg: "Sitemap contains 0 URLs!" });
    hasCriticalError = true;
  } else {
    // Check for localhost or invalid protocols
    const invalidUrls = sitemapUrls.filter(u => u.includes("localhost") || u.includes("127.0.0.1") || !u.startsWith("http"));
    if (invalidUrls.length > 0) {
      sitemapStatus = "FAIL (Contains localhost/invalid URLs)";
      issues.push({ level: "CRITICAL", msg: `Sitemap contains ${invalidUrls.length} invalid or localhost URLs` });
      hasCriticalError = true;
    } else {
      console.log(`   ✓ Sitemap valid, contains ${sitemapUrls.length} production URLs.`);
    }
  }
}

// 3. Scan all HTML pages
console.log("\n3️⃣ Scanning generated HTML pages for SEO health...");
const allHtmlFiles = getAllHtmlFiles(distDir);
stats.totalPages = allHtmlFiles.length;

const titleMap = new Map();
const h1Map = new Map();
const knownValidRoutes = new Set();

// Populate valid routes from HTML file paths
for (const file of allHtmlFiles) {
  let route = file.replace(distDir, "").replace(/\\/g, "/");
  if (route.endsWith("/index.html")) {
    route = route.slice(0, -10) || "/";
  }
  knownValidRoutes.add(route);
  if (!route.endsWith("/")) knownValidRoutes.add(route + "/");
}

for (const file of allHtmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, "/");
  // Skip internal iframe assets
  if (relPath.startsWith("pio/") || relPath.includes("/pio/")) {
    continue;
  }
  const html = fs.readFileSync(file, "utf-8");

  // A. Check Suspicious Spam Pages
  if (/(casino|bet\d+|poker|porn|xxx|download-[a-z0-9]{8})/i.test(relPath)) {
    stats.suspiciousPages++;
    issues.push({ level: "CRITICAL", msg: `Suspicious spam page detected: ${relPath}` });
    hasCriticalError = true;
  }

  // B. Check Noindex
  const is404 = relPath === "404.html";
  const hasNoindex = /<meta[^>]*name=["'](robots|googlebot|bingbot)["'][^>]*content=["'][^"']*noindex/i.test(html);
  if (hasNoindex) {
    stats.noindexPages++;
    if (!is404 && !relPath.includes("admin") && !relPath.includes("test")) {
      issues.push({ level: "CRITICAL", msg: `Unexpected noindex found on standard page: ${relPath}` });
      hasCriticalError = true;
    }
  } else {
    stats.indexablePages++;
  }

  // C. Check Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch && !is404) {
    stats.canonicalErrors++;
    issues.push({ level: "WARN", msg: `Missing canonical link tag in ${relPath}` });
  } else if (canonicalMatch) {
    const canonicalUrl = canonicalMatch[1];
    if (canonicalUrl.includes("localhost") || canonicalUrl.includes("127.0.0.1")) {
      stats.canonicalErrors++;
      issues.push({ level: "CRITICAL", msg: `Canonical URL points to localhost in ${relPath}: ${canonicalUrl}` });
      hasCriticalError = true;
    }
  }

  // D. Check Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && !is404) {
    const titleText = titleMatch[1].trim();
    if (titleMap.has(titleText)) {
      stats.duplicateTitles++;
    } else {
      titleMap.set(titleText, relPath);
    }
  }

  // E. Check H1
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length > 0 && !is404) {
    const h1Clean = h1Matches[0].replace(/<[^>]+>/g, "").trim();
    if (h1Clean && h1Map.has(h1Clean)) {
      stats.duplicateH1s++;
    } else if (h1Clean) {
      h1Map.set(h1Clean, relPath);
    }
  }

  // F. Check Internal Links
  const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
  for (const hrefAttr of hrefMatches) {
    const href = hrefAttr.replace(/^href=["']|["']$/gi, "").trim();
    if (href === "" || href === "#") {
      // ignore empty anchors on buttons if intended, but log warning if on standard link
    } else if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_astro/") && !href.startsWith("/images/") && !href.startsWith("/api/")) {
      const cleanHref = href.split("?")[0].split("#")[0];
      if (cleanHref !== "/" && !knownValidRoutes.has(cleanHref) && !fs.existsSync(path.join(distDir, cleanHref))) {
        stats.brokenLinks++;
        issues.push({ level: "WARN", msg: `Potential broken internal link in ${relPath} -> ${href}` });
      }
    }
  }

  // G. Check Schema JSON-LD syntax
  const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const script of schemaMatches) {
    const jsonStr = script.replace(/<script[^>]*>|<\/script>/gi, "").trim();
    try {
      JSON.parse(jsonStr);
    } catch (e) {
      stats.schemaErrors++;
      issues.push({ level: "CRITICAL", msg: `Invalid JSON-LD Schema syntax in ${relPath}: ${e.message}` });
      hasCriticalError = true;
    }
  }

  // H. Check Meta Description Length (Bing Rule 118: 140-165 characters)
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (!is404) {
    if (!descMatch) {
      issues.push({ level: "CRITICAL", msg: `Missing meta description in ${relPath}` });
      hasCriticalError = true;
    } else {
      const descText = descMatch[1].trim();
      if (descText.length < 130) {
        issues.push({ level: "WARN", msg: `Meta description too short (${descText.length} chars, Bing target: 150-160) in ${relPath}: "${descText}"` });
      } else if (descText.length > 175) {
        issues.push({ level: "WARN", msg: `Meta description too long (${descText.length} chars) in ${relPath}` });
      }
    }
  }
}

// 4. IndexNow Support Verification
console.log("4️⃣ Checking IndexNow Submission Support...");
const indexNowScript = path.join(__dirname, "indexnow-submit.js");
const hasIndexNow = fs.existsSync(indexNowScript);
console.log(hasIndexNow ? "   ✓ IndexNow integration present (scripts/indexnow-submit.js)" : "   ⚠ IndexNow script missing");

// Output Summary Report
console.log("\n=======================================================");
console.log("📊 SEO HEALTH CHECK REPORT SUMMARY");
console.log("=======================================================");
console.log(`Total Pages Scanned:      ${stats.totalPages}`);
console.log(`Indexable Pages:          ${stats.indexablePages}`);
console.log(`Noindex Pages (404/Misc): ${stats.noindexPages}`);
console.log(`Sitemap URLs:             ${stats.sitemapUrls}`);
console.log(`Canonical Errors:         ${stats.canonicalErrors}`);
console.log(`Broken Internal Links:    ${stats.brokenLinks}`);
console.log(`Schema JSON Errors:       ${stats.schemaErrors}`);
console.log(`Suspicious Spam Pages:    ${stats.suspiciousPages}`);
console.log(`Robots.txt Status:        ${robotsStatus}`);
console.log(`Sitemap.xml Status:       ${sitemapStatus}`);
console.log(`IndexNow Supported:       ${hasIndexNow ? "YES" : "NO"}`);
console.log("-------------------------------------------------------");

if (issues.length > 0) {
  console.log("\n⚠️ DETECTED ISSUES / WARNINGS:");
  for (const iss of issues) {
    console.log(`  [${iss.level}] ${iss.msg}`);
  }
}

const releaseDecision = hasCriticalError ? "BLOCKED" : "READY";
console.log(`\n🚦 RELEASE_DECISION: ${releaseDecision}`);
console.log("=======================================================\n");

if (hasCriticalError) {
  process.exit(1);
} else {
  process.exit(0);
}
