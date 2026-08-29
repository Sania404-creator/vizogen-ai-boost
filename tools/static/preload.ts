/* Bun preload: swap app modules for static-export equivalents. */
import { plugin } from "bun";
import { basename, join } from "node:path";

const ROOT = process.cwd();
const IMG_PREFIX = "/assets/img/";

const alias: Record<string, string> = {
  "@tanstack/react-router": join(ROOT, "tools/static/stubs/router.tsx"),
  "@tanstack/react-start": join(ROOT, "tools/static/stubs/start.ts"),
  "@/components/ui/accordion": join(ROOT, "tools/static/stubs/accordion.tsx"),
  "@/components/landing/pricing": join(ROOT, "tools/static/components/pricing-static.tsx"),
};

plugin({
  name: "static-export-alias",
  setup(build) {
    build.onResolve({ filter: /^@tanstack\/react-router$/ }, () => ({
      path: alias["@tanstack/react-router"]!,
    }));
    build.onResolve({ filter: /^@tanstack\/react-start$/ }, () => ({
      path: alias["@tanstack/react-start"]!,
    }));
    build.onResolve({ filter: /(^@\/components\/ui\/accordion$|\/components\/ui\/accordion$)/ }, () => ({
      path: alias["@/components/ui/accordion"]!,
    }));
    build.onResolve({ filter: /(^@\/components\/landing\/pricing$|\/components\/landing\/pricing$)/ }, () => ({
      path: alias["@/components/landing/pricing"]!,
    }));
    build.onLoad({ filter: /\.(png|jpe?g|webp|svg|gif|avif)$/ }, (args) => ({
      loader: "js",
      contents: `export default ${JSON.stringify(IMG_PREFIX + basename(args.path))};`,
    }));
  },
});
