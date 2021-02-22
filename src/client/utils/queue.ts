export const secondsToText = (seconds: number) => {
    if (seconds > 3600) {
        return `${Math.round(seconds / 3600)} hour(s)`;
    } else if (seconds > 60) {
        return `${Math.round(seconds / 60)} minute(s)`;
    } else {
        return "A few seconds";
    }
};
