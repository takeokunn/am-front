import { useEffect } from 'react';
export default function useTimeout(element, timerRef, callback, timeMS) {
    useEffect(() => {
        if (!element)
            return () => { };
        const currentTimer = timerRef;
        currentTimer.current = setTimeout(() => {
            callback();
        }, timeMS);
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [element]);
}
