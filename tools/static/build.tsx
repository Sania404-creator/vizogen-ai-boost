/* Static site exporter.
 *
 * Renders every TanStack route to plain HTML (no React runtime shipped), compiles
 * the Tailwind stylesheet, copies images, and drops in a vanilla JS bundle that
 * restores the interactive bits (menus, toggles, modals, forms).
 *
 * Run: bun tools/static/build.tsx
 * Output: static-site/  (upload its contents to public_html on shared hosting)
 */
import { mkdir, rm, cp, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "static-site");
const IMG_PREFIX = "/assets/img/";


/* ---------- routes ---------- */
function urlFromFile(file: string) {
  const name = file.replace(/\.tsx$/, "");
  if (name === "index") return "/";
  return "/" + name.split(".").join("/");
}

const routeFiles = (await readdir(join(ROOT, "src/routes")))
  .filter((f) => f.endsWith(".tsx") && f !== "__root.tsx")
  .sort();

/* ---------- html helpers ---------- */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap";

type Meta = Record<string, string>[];

function headTags(meta: Meta, canonicalPath: string) {
  const out: string[] = [];
  const get = (k: string, v: string) => meta.find((m) => m[k] === v)?.content ?? "";
  const title = meta.find((m) => m.title)?.title ?? "Vizogen";
  const description = get("name", "description");
  out.push(`<title>${esc(title)}</title>`);
  if (description) out.push(`<meta name="description" content="${esc(description)}">`);
  for (const m of meta) {
    if (m.title || m.charSet) continue;
    if (m.name === "description") continue;
    const key = m.name ? "name" : m.property ? "property" : null;
    if (!key) continue;
    out.push(`<meta ${key}="${esc(m[key]!)}" content="${esc(m.content ?? "")}">`);
  }
  out.push(
    `<link rel="canonical" href="https://vizogen.in${canonicalPath === "/" ? "/" : canonicalPath + "/"}">`,
  );
  return out.join("\n    ");
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** framer-motion SSR leaves elements at their `initial` state (invisible). */
function unhideMotion(html: string) {
  return html.replace(/style="([^"]*)"/g, (full, style: string) => {
    let s = style as string;
    if (!/opacity:\s*0|transform:/.test(s)) return full;
    s = s
      .replace(/opacity:\s*0(?![.\d])\s*;?/g, "")
      .replace(/transform:\s*[^;"]*;?/g, "")
      .replace(/height:\s*0px;?/g, "")
      .trim();
    return s ? `style="${s}"` : "";
  });
}

/* ---------- render ---------- */
const { renderToStaticMarkup } = await import("react-dom/server");
const React = await import("react");
const { FloatingWidgets } = await import("../../src/components/site/floating-widgets");

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, "assets/img"), { recursive: true });

const pages: { url: string; file: string }[] = [];

for (const file of routeFiles) {
  const url = urlFromFile(file);
  (globalThis as Record<string, unknown>).__STATIC_PATHNAME__ = url;
  const mod = (await import(join(ROOT, "src/routes", file))) as {
    Route: { options: { component: () => JSX.Element; head?: () => { meta?: Meta } } };
  };
  const options = mod.Route.options;
  const Component = options.component;
  const meta = options.head?.().meta ?? [];

  let body = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(Component),
      React.createElement(FloatingWidgets),
    ),
  );
  body = unhideMotion(body);

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headTags(meta, url)}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${FONTS}">
    <link rel="stylesheet" href="/assets/styles.css">
    <link rel="icon" href="/favicon.png" type="image/png">
  </head>
  <body data-path="${url}">
    ${body}
    <script src="/assets/app.js" defer></script>
  </body>
</html>
`;

  const outFile = url === "/" ? join(OUT, "index.html") : join(OUT, url.slice(1), "index.html");
  await mkdir(dirname(outFile), { recursive: true });
  await Bun.write(outFile, html);
  pages.push({ url, file: outFile });
  console.log("rendered", url);
}

/* ---------- 404 ---------- */
await Bun.write(
  join(OUT, "404.html"),
  (await Bun.file(join(OUT, "index.html")).text()).replace(
    /<title>[^<]*<\/title>/,
    "<title>Page not found — Vizogen</title>",
  ),
);

/* ---------- images ---------- */
async function copyImages(dir: string) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await copyImages(p);
    else if (/\.(png|jpe?g|webp|svg|gif|avif)$/.test(entry.name))
      await cp(p, join(OUT, "assets/img", entry.name));
  }
}
await copyImages(join(ROOT, "src/assets"));

// Remote (uploaded) assets referenced through *.asset.json
for (const entry of await readdir(join(ROOT, "src/assets"))) {
  if (!entry.endsWith(".asset.json")) continue;
  const json = (await Bun.file(join(ROOT, "src/assets", entry)).json()) as {
    url: string;
    original_filename: string;
  };
  const res = await fetch(`http://localhost:8080${json.url}`);
  if (!res.ok) throw new Error(`Failed to download ${json.original_filename}: ${res.status}`);
  await Bun.write(join(OUT, "assets/img", json.original_filename), await res.arrayBuffer());
}

if (existsSync(join(ROOT, "public/favicon.png")))
  await cp(join(ROOT, "public/favicon.png"), join(OUT, "favicon.png"));
if (existsSync(join(ROOT, "public/robots.txt")))
  await cp(join(ROOT, "public/robots.txt"), join(OUT, "robots.txt"));

/* ---------- rewrite asset.json urls in html ---------- */
for (const page of pages.concat([{ url: "/404", file: join(OUT, "404.html") }])) {
  let html = await Bun.file(page.file).text();
  html = html.replace(
    /\/__l5e\/assets-v1\/[^/"]+\/([^"']+?)(?=["'])/g,
    (_m, name: string) => IMG_PREFIX + name,
  );
  await Bun.write(page.file, html);
}

/* ---------- runtime js + extra css ---------- */
await cp(join(ROOT, "tools/static/assets/app.js"), join(OUT, "assets/app.js"));

/* ---------- css ---------- */
// Build the CSS entry from the app's own design tokens so the theme matches 1:1.
const appCss = await Bun.file(join(ROOT, "src/styles.css")).text();
const extra = await Bun.file(join(ROOT, "tools/static/assets/extra.css")).text();
const cssEntry = join(ROOT, "static-site/.styles.entry.css");
await Bun.write(
  cssEntry,
  appCss
    .replace('@source "../src";', `@source "${join(ROOT, "src")}";\n@source "${OUT}";`)
    + "\n" + extra,
);
const proc = Bun.spawnSync([
  "bunx",
  "@tailwindcss/cli",
  "-i",
  cssEntry,
  "-o",
  join(OUT, "assets/styles.css"),
  "--minify",
]);
if (proc.exitCode !== 0) {
  console.error(proc.stderr.toString());
  throw new Error("Tailwind build failed");
}

/* ---------- sitemap ---------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap  s.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>https://vizogen.in${p.url}</loc></url>`).join("\n")}
</urlset>
`.replace("sitemap  s", "sitemaps");
await Bun.write(join(OUT, "sitemap.xml"), sitemap);

console.log(`\n✔ ${pages.length} pages written to static-site/`);
