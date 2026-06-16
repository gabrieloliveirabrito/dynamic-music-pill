import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "dist/extension.js",
    format: "esm",
    target: "es2017",
    sourcemap: true,
    platform: "neutral",
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