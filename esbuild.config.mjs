import esbuild from "esbuild";

const watch = process.argv.includes("--watch");
const release = process.argv.includes("--release");

const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    minify: release,
    outfile: "dist/extension.js",
    format: "esm",
    target: "es2017",
    sourcemap: true,
    platform: "neutral",
    logLevel: "info",
    external: [
        "resource://*",
        "gi://*"
    ]
}); 

if (watch) {
    await ctx.watch();
    console.log("👀 watching...");
} else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("✅ build done");
}