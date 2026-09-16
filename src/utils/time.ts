export function formatTime(microSeconds: number, forceHours = false): string {
    if (!microSeconds || microSeconds < 0) {
        return forceHours ? "0:00:00" : "0:00";
    }
    const totalSeconds = Math.floor(microSeconds / 1000000);
    const hours = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    if (forceHours || hours > 0) {
        return `${hours}:${pad(min)}:${pad(sec)}`;
    }
    return `${min}:${pad(sec)}`;
}
