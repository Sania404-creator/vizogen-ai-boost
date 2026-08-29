/* Bun preload: swap app modules for static-export equivalents. */
import { plugin } from "bun";
import { basename, join } from "node:path";

const ROOT = process.cwd();
const IMG_PREFIX = "/assets/img/";

const reexport = (stub: string) => ({
  loader: "js" as const,
  contents: `export * from ${JSON.stringify(join(ROOT, stub))};`,
});

plugin({
  name: "static-export-alias",
  setup(build) {
    build.onLoad({ filter: /@tanstack[\\/]react-router[\\/]dist[\\/]esm[\\/]index\.js$/ }, () =>
      reexport("tools/static/stubs/router.tsx"),
    );
    build.onLoad({ filter: /@tanstack[\\/]react-start[\\/]dist[\\/]esm[\\/]index\.js$/ }, () =>
      reexport("tools/static/stubs/start.ts"),
    );
    build.onLoad({ filter: /src[\\/]components[\\/]ui[\\/]accordion\.tsx$/ }, () =>
      reexport("tools/static/stubs/accordion.tsx"),
    );
    build.onLoad({ filter: /src[\\/]components[\\/]landing[\\/]pricing\.tsx$/ }, () =>
      reexport("tools/static/components/pricing-static.tsx"),
    );
    build.onLoad({ filter: /\.(png|jpe?g|webp|svg|gif|avif)$/ }, (args) => ({
      loader: "js",
      contents: `export default ${JSON.stringify(IMG_PREFIX + basename(args.path))};`,
    }));
  },
});
