import { createContext } from "react";
import { QueueUtils } from "../types/queue";

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

export const generateMailto = (
    recipient: string,
    courseCode: string,
    studentName: string,
    claimerName: string
) => {
    return `mailto:${recipient}?subject=%5B${courseCode}%20Queue%5D%20Queue%20question%20help&body=Hi%20${studentName}%2C%0D%0A%0D%0AYou're%20next%20in%20the%20${courseCode}%20queue.%20You've%20been%20invited%20to%20this%20zoom%20meeting%20%3Cinsert-zoom-link%3E.%0D%0A%20Please%20join%20the%20meeting%20to%20get%20help%20from%20your%20tutor.%0D%0A%0D%0ARegards%2C%0D%0A${claimerName}`;
};

export const pushNotification = (title: string, body: string) => {
    if (!("Notification" in window)) {
        return;
    }
    if (Notification.permission === "granted") {
        return new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                return new Notification(title, { body });
            }
        });
    }
};

export const requestNotification = () => {
    Notification.requestPermission();
};

export const QueueContext = createContext<QueueUtils>({
    updateQuestionStatus: () => {},
    setSelectedQuestion: () => {},
    openClaimModal: () => {},
    courseCode: "",
});
