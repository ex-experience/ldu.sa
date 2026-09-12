import fs from "node:fs/promises";
import path from "node:path";

const repo = "https://cdn.jsdelivr.net/gh/ex-experience/ldu.sa@source-rebuild";
const distDir = path.resolve("dist");
const outDir = path.resolve("preview");

await fs.mkdir(outDir, { recursive: true });

let html = await fs.readFile(path.join(distDir, "index.html"), "utf8");

const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
const jsMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);

if (!cssMatch || !jsMatch) {
  throw new Error("Could not locate Vite CSS/JS assets in dist/index.html");
}

const cssFile = path.basename(cssMatch[1]);
const jsFile = path.basename(jsMatch[1]);

let css = await fs.readFile(path.join(distDir, "assets", cssFile), "utf8");
let js = await fs.readFile(path.join(distDir, "assets", jsFile), "utf8");

const replacements = new Map([
  [/\/ldu\.sa\/assets\/case-arena-[^"']+\.jpg/g, `${repo}/docs/media/case-arena.jpg`],
  [/\/ldu\.sa\/assets\/case-banquet-[^"']+\.jpg/g, `${repo}/docs/media/case-banquet.jpg`],
  [/\/ldu\.sa\/assets\/case-desert-[^"']+\.jpg/g, `${repo}/docs/media/case-desert.jpg`],
  [/\/ldu\.sa\/assets\/case-horizon-[^"']+\.jpg/g, `${repo}/docs/media/case-horizon.jpg`],
  [/\/ldu\.sa\/assets\/hero-night-[^"']+\.jpg/g, `${repo}/docs/media/hero-night.jpg`],
  [/\/ldu\.sa\/assets\/hero-stage-[^"']+\.jpg/g, `${repo}/docs/media/hero-stage.jpg`]
]);

for (const [pattern, replacement] of replacements) {
  js = js.replace(pattern, replacement);
}

js = js.replaceAll("/ldu.sa/", "/");
js = js.replace(/\n?\/\/# sourceMappingURL=.*$/m, "");

css = css
  .replace(/\/ldu\.sa\/assets\/Cinzel-[^)]+\.ttf/g, `${repo}/docs/fonts/Cinzel.ttf`)
  .replace(/\/ldu\.sa\/assets\/PlayfairDisplay-[^)]+\.ttf/g, `${repo}/docs/fonts/PlayfairDisplay.ttf`);

if (js.toLowerCase().includes("</script")) {
  throw new Error("Inline JS unexpectedly contains a closing script tag");
}

if (css.toLowerCase().includes("</style")) {
  throw new Error("Inline CSS unexpectedly contains a closing style tag");
}

html = html
  .replace(cssMatch[0], `<style>${css}</style>`)
  .replace(jsMatch[0], `<script type="module">${js}</script>`)
  .replaceAll("/ldu.sa/favicon.svg", `${repo}/docs/favicon.svg`)
  .replaceAll("/ldu.sa/og.jpg", `${repo}/docs/og.jpg`);

if (html.includes("/ldu.sa/assets/")) {
  throw new Error("Preview still contains unresolved /ldu.sa/assets references");
}

await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
await fs.writeFile(path.join(outDir, ".nojekyll"), "", "utf8");

console.log(`Standalone preview generated: ${Buffer.byteLength(html)} bytes`);
