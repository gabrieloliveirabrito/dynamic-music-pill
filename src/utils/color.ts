import GdkPixbuf from "gi://GdkPixbuf";
import { Color } from "@/types/color";

/** Faithful port of srcJS/utils.js getAverageColor. */
export function getAverageColor(pixbuf: GdkPixbuf.Pixbuf): Color {
    const w = pixbuf.get_width();
    const h = pixbuf.get_height();
    const pixels = pixbuf.get_pixels();
    const rowstride = pixbuf.get_rowstride();
    const nChannels = pixbuf.get_n_channels();
    let r = 0, g = 0, b = 0, count = 0;

    for (let y = 0; y < h; y += 20) {
        for (let x = 0; x < w; x += 20) {
            const idx = y * rowstride + x * nChannels;
            r += pixels[idx];
            g += pixels[idx + 1];
            b += pixels[idx + 2];
            count++;
        }
    }

    if (count === 0) {
        return { r: 40, g: 40, b: 40 };
    }
    return {
        r: Math.floor(r / count),
        g: Math.floor(g / count),
        b: Math.floor(b / count),
    };
}

/** Faithful port of srcJS/utils.js getClosestGnomeAccent. */
export function getClosestGnomeAccent(r: number, g: number, b: number): string {
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h *= 60;
    }
    s *= 100;
    const lPct = l * 100;

    if (s < 15 || lPct < 15 || lPct > 90) {
        return "slate";
    }

    const presets: Record<string, number> = {
        red: 0, orange: 30, yellow: 50, green: 120,
        teal: 170, blue: 210, purple: 280, pink: 330,
    };

    let closest = "blue";
    let minDistance = Infinity;

    for (const [name, targetHue] of Object.entries(presets)) {
        const diff = Math.abs(h - targetHue);
        const distance = Math.min(diff, 360 - diff);
        if (distance < minDistance) {
            minDistance = distance;
            closest = name;
        }
    }

    if (Math.abs(h - 360) < minDistance) {
        closest = "red";
    }
    return closest;
}
