import esbuild from "esbuild";

const watch = process.argv.includes("--watch");
const release = process.argv.includes("--release");

const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts", "src/prefs.ts"],
    bundle: true,
    minify: release,
    outdir: ".",
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
    let result = await ctx.rebuild();
    await ctx.dispose();

    console.log(JSON.stringify(result));

    if (result.errors.length === 0) {
        console.log("✅ build done");
        process.exit(0);
    } else {
        console.log("failed to build");
        process.exit(1);
    }
}