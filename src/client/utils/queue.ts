export const secondsToText = (seconds: number) => {
    if (seconds > 3600) {
        const hours = Math.round(seconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (seconds > 60) {
        const minutes = Math.round(seconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
        return "a few seconds";
    }
};
