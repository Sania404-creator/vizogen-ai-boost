# Static export (plain HTML / CSS / JS)

Generates a framework-free copy of the site into `static-site/` — ready to upload to
shared hosting (Hostinger, cPanel, etc.). No React, no Node, no backend at runtime.

## Build

```bash
bun run static
```

Output:

```
static-site/
  index.html            # homepage
  <route>/index.html    # one folder per page (pretty URLs)
  404.html
  assets/styles.css     # compiled Tailwind theme (same tokens as the app)
  assets/app.js         # vanilla JS: menus, toggles, modals, forms, reveals
  assets/img/*          # every referenced image
  favicon.png, robots.txt, sitemap.xml
```

## Deploy

Upload the **contents** of `static-site/` into `public_html`. Pages resolve through
folder `index.html` files, so `/pricing` works with no rewrites. Add this to
`.htaccess` if you want the custom 404:

```apache
ErrorDocument 404 /404.html
```

## How it works

- Each route component is rendered to static markup (`react-dom/server`) at build
  time; no React is shipped to the browser.
- `tools/static/preload.ts` swaps build-time-only modules: the router and server
  functions are stubbed, the Radix accordion becomes native `<details>`, and the
  pricing section is replaced with a data-attribute version whose toggles are
  driven by `assets/app.js`.
- Forms have no backend: submissions are formatted and handed to WhatsApp
  (+91 84889 18358) and email (info.vizogen@gmail.com).
