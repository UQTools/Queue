import { createContext } from "react";
import { QueueUtils } from "../types/queue";
import { generateMailto } from "./mailto";

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

export const generateNotificationMailto = (
    recipient: string,
    courseCode: string,
    studentName: string,
    claimerName: string
) => {
    const subject = `[${courseCode}] Queue question help`;
    const mailTemplate = `Hi ${studentName},

You're next in the ${courseCode} queue. You've been invited to this zoom meeting <insert-zoom-link>.
Please join the meeting to get help from your tutor.

Regards,
${claimerName}"`;
    return generateMailto(recipient, subject, mailTemplate);
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
    if (!("Notification" in window)) {
        return;
    }
    Notification.requestPermission();
};

export const QueueContext = createContext<QueueUtils>({
    updateQuestionStatus: () => {},
    setSelectedQuestion: () => {},
    openClaimModal: () => {},
    courseCode: "",
});
