import { useEffect, useRef } from "react";

export const useInterval = (
    callback: () => any,
    delay: number,
    immediately: boolean = true
) => {
    const savedCallback = useRef<() => any>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Call this for the first time
    useEffect(() => {
        if (!immediately) {
            return;
        }
        savedCallback.current?.();
    }, [immediately]);

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current?.();
        };
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
