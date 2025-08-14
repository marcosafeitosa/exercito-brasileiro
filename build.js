const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["content.js"], // seu arquivo principal
    bundle: true,
    minify: true, // opcional
    outfile: "dist/content.bundle.js",
    platform: "browser",
  })
  .catch(() => process.exit(1));
