export const ENQUEUE_SKYFIRE_METHOD = 'ENQUEUE_SKYFIRE_METHOD';
export function enqueueSkyfireMethod(payload) {
    return {
        payload,
        type: ENQUEUE_SKYFIRE_METHOD,
    };
}
export const EXECUTE_SKYFIRE_QUEUED_METHOD = 'EXECUTE_SKYFIRE_QUEUED_METHOD';
export function executeSkyfireQueuedMethod(queue) {
    return {
        payload: {
            queue,
        },
        type: EXECUTE_SKYFIRE_QUEUED_METHOD,
    };
}
export const DEQUEUE_SKYFIRE_METHOD = 'DEQUEUE_SKYFIRE_METHOD';
export function dequeueSkyfireMethod(queue) {
    return {
        payload: {
            queue,
        },
        type: DEQUEUE_SKYFIRE_METHOD,
    };
}
export const PARK_SKYFIRE_METHOD = 'PARK_SKYFIRE_METHOD';
export function parkSkyfireMethod(payload) {
    return {
        payload,
        type: PARK_SKYFIRE_METHOD,
    };
}
export const UNPARK_SKYFIRE_METHOD = 'UNPARK_SKYFIRE_METHOD';
export function unparkSkyfireMethod(ownerId) {
    return {
        payload: {
            ownerId,
        },
        type: UNPARK_SKYFIRE_METHOD,
    };
}
