import { spawn, ChildProcess } from "node:child_process";
import readline from "node:readline";
import chokidar from "chokidar"

let buildingTimer: NodeJS.Timeout | null = null;
let gnomeProcess: ChildProcess | null = null;
let rebuilding = false;

const LOG_REGEX =
    /\[DMP\]|Dynamic Music Pill|dynamic-music-pill@andbal|JS ERROR|Exception/;

function run(command: string, args: string[]) {
    return new Promise<void>((resolve, reject) => {
        const proc = spawn(command, args, {
            stdio: "inherit",
        });

        proc.on("exit", code => {
            if (code === 0) resolve();
            else reject(new Error(`${command} exited with code ${code}`));
        });
    });
}

async function build() {
    console.log("🔧 Building...");
    await run("bash", ["-c", "./install.sh"]);
}

function stopGnome() {
    console.log("💀 Stopping mutter-devkit...");

    spawn("pkill", ["-TERM", "mutter-devkit"], {
        stdio: "ignore",
    });

    gnomeProcess = null;
}

function startGnome() {
    console.log("🚀 Starting GNOME sandbox...");

    gnomeProcess = spawn(
        "dbus-run-session",
        ["bash", "-c", "./runner.sh"],
        {
            stdio: ["ignore", "pipe", "pipe"],
        }
    );

    const handleOutput = (buffer: Buffer) => {
        const text = buffer.toString();

        for (const line of text.split("\n")) {
            if (LOG_REGEX.test(line)) {
                console.log(line);
            }
        }
    };

    gnomeProcess.stdout?.on("data", handleOutput);
    gnomeProcess.stderr?.on("data", handleOutput);

    gnomeProcess.on("exit", code => {
        console.log(`GNOME exited (${code})`);
        gnomeProcess = null;
    });
}

async function reload() {
    if (rebuilding) return;

    rebuilding = true;

    try {
        console.log("🔁 Reload");

        stopGnome();

        await build();

        startGnome();
    } catch (err) {
        console.error(err);
    } finally {
        rebuilding = false;
    }
}

async function main() {
    await build();
    startGnome();

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on("keypress", (_, key) => {
        if (key.ctrl && key.name === "c") {
            stopGnome();
            process.exit(0);
        }

        if (key.ctrl && key.name === "r") {
            void reload();
        }
    });

    const watcher = chokidar.watch([
        "src", "schemas", "locales", "metadata.json"
    ], {
        ignoreInitial: true,
    });

    watcher.on("all", (event, path) => {
        console.log(`File ${event}: ${path}`);

        if (buildingTimer) {
            clearTimeout(buildingTimer);
        }

        console.log("Waiting for changes to stop...");

        buildingTimer = setTimeout(() => {
            void reload();
        }, 5000);
    });

    console.log("Watcher ready");

    console.log("");
    console.log("⌨️  Ctrl+R = reload");
    console.log("⌨️  Ctrl+C = exit");
}

void main();