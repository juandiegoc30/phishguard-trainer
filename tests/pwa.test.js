const assert = require("node:assert/strict");
const fs = require("node:fs");

// --- Manifest ---

const manifestPath = "web/manifest.webmanifest";
assert.ok(fs.existsSync(manifestPath), "manifest.webmanifest should exist");

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch {
  assert.fail("manifest.webmanifest should be valid JSON");
}

assert.ok(manifest.name, "manifest should have a name");
assert.ok(manifest.short_name, "manifest should have a short_name");
assert.ok(manifest.start_url, "manifest should have a start_url");
assert.ok(manifest.display, "manifest should have a display");
assert.ok(
  ["standalone", "fullscreen", "minimal-ui", "browser"].includes(manifest.display),
  `manifest display should be a valid value, got "${manifest.display}"`
);
assert.ok(manifest.background_color, "manifest should have a background_color");
assert.ok(manifest.theme_color, "manifest should have a theme_color");
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, "manifest should have at least one icon");

for (const icon of manifest.icons) {
  assert.ok(icon.src, "each manifest icon should have a src");
  assert.ok(icon.sizes, "each manifest icon should have sizes");
  assert.ok(icon.type, "each manifest icon should have a type");
  assert.ok(fs.existsSync(`web/${icon.src}`), `manifest icon src "${icon.src}" should exist on disk`);
}

// --- HTML files ---

for (const htmlPath of ["web/index.html", "web/404.html"]) {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.ok(
    html.includes('rel="manifest"'),
    `${htmlPath} should link to the web app manifest`
  );
  assert.ok(
    html.includes('name="theme-color"'),
    `${htmlPath} should have a theme-color meta tag`
  );
  assert.ok(
    html.includes('apple-mobile-web-app-capable'),
    `${htmlPath} should have apple-mobile-web-app-capable meta tag`
  );
  assert.ok(
    html.includes('apple-mobile-web-app-title'),
    `${htmlPath} should have apple-mobile-web-app-title meta tag`
  );
}

// --- Service worker ---

const swPath = "web/sw.js";
assert.ok(fs.existsSync(swPath), "sw.js should exist");

const sw = fs.readFileSync(swPath, "utf8");

assert.ok(sw.includes('"install"'), "sw.js should register an install handler");
assert.ok(sw.includes('"activate"'), "sw.js should register an activate handler");
assert.ok(sw.includes('"fetch"'), "sw.js should register a fetch handler");
assert.ok(sw.includes("caches.open"), "sw.js should open a cache");
assert.ok(sw.includes("skipWaiting"), "sw.js should call skipWaiting on install");
assert.ok(sw.includes("clients.claim"), "sw.js should call clients.claim on activate");
assert.ok(
  sw.includes("tailwind.css"),
  "sw.js should include the compiled Tailwind CSS in the cached assets"
);

// SW registration in index.html (via app.js script tag) or inline
const indexHtml = fs.readFileSync("web/index.html", "utf8");
const appJs = fs.readFileSync("web/assets/js/app.js", "utf8");
assert.ok(
  appJs.includes("serviceWorker") || indexHtml.includes("serviceWorker"),
  "service worker should be registered in app.js or index.html"
);

console.log("pwa.test.js passed");
