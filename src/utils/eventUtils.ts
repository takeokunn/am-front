export function throttle(callback, limit) {
    let timeoutHandler;
    return (...args) => {
        if (!timeoutHandler) {
            timeoutHandler = setTimeout(() => {
                callback(...args);
                timeoutHandler = null;
            }, limit);
        }
    };
}
