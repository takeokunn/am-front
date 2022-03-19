import { DEQUEUE_SKYFIRE_METHOD, ENQUEUE_SKYFIRE_METHOD, PARK_SKYFIRE_METHOD, UNPARK_SKYFIRE_METHOD, } from '../actions';
const initialState = { queues: {}, parkedMethods: {} };
export function SkyfireMethodQueueReducer(state = initialState, action) {
    switch (action.type) {
        case ENQUEUE_SKYFIRE_METHOD:
            return enqueueSkyfireMethod(state, action);
        case DEQUEUE_SKYFIRE_METHOD:
            return dequeueSkyfireMethod(state, action);
        case PARK_SKYFIRE_METHOD:
            return parkSkyfireMethod(state, action);
        case UNPARK_SKYFIRE_METHOD:
            return unparkSkyfireMethod(state, action);
        default:
            return state;
    }
}
function enqueueSkyfireMethod(state, action) {
    const { queue, method } = action.payload;
    const queueState = state.queues[queue.id] ? state.queues[queue.id] : [];
    const updatedQueue = [...queueState, method];
    return Object.assign(Object.assign({}, state), { queues: Object.assign(Object.assign({}, state.queues), { [queue.id]: updatedQueue }) });
}
function dequeueSkyfireMethod(state, action) {
    const { queue } = action.payload;
    const currentQueue = state.queues[queue.id] ? state.queues[queue.id] : [];
    return Object.assign(Object.assign({}, state), { queues: Object.assign(Object.assign({}, state.queues), { [queue.id]: currentQueue.slice(1) }) });
}
function parkSkyfireMethod(state, action) {
    const methodOwner = action.payload.method.owner;
    if (!methodOwner) {
        return state;
    }
    const ownerParkedMethods = state.parkedMethods[methodOwner] || [];
    return Object.assign(Object.assign({}, state), {
        parkedMethods: Object.assign(Object.assign({}, state.parkedMethods), { [methodOwner]: [...ownerParkedMethods, action.payload.method] }),
    });
}
function unparkSkyfireMethod(state, action) {
    return Object.assign(Object.assign({}, state), { parkedMethods: Object.assign(Object.assign({}, state.parkedMethods), { [action.payload.ownerId]: [] }) });
}
