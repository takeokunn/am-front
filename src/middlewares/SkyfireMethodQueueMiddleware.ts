import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { VIDEO_NOW_PLAYING_TEMPLATE } from '../types/templates/videoNowPlaying';
import { DEQUEUE_SKYFIRE_METHOD, dequeueSkyfireMethod, ENQUEUE_SKYFIRE_METHOD, EXECUTE_SKYFIRE_QUEUED_METHOD, executeMethod, executeSkyfireQueuedMethod, INVALIDATE_TEMPLATE, parkSkyfireMethod, SOFT_REFRESH_TEMPLATES, } from '../actions';
import { INVOKE_HTTP_GLOBAL } from '../types/ISkyfireInvokeHttpMethod';
export const SkyfireMethodQueueMiddleware = (store) => (next) => (action) => {
    if (!action.payload) {
        return next(action);
    }
    const methodQueueState = store.getState().SkyfireMethodQueue;
    const { queue } = action.payload;
    switch (action.type) {
        case ENQUEUE_SKYFIRE_METHOD:
            next(action);
            if (isMultithreadedQueue(queue)) {
                store.dispatch(executeMethod(action.payload.method));
            }
            else if (!methodQueueState.queues[queue.id] ||
                methodQueueState.queues[queue.id].length === 0) {
                store.dispatch(executeSkyfireQueuedMethod(queue));
            }
            break;
        case EXECUTE_SKYFIRE_QUEUED_METHOD: {
            const method = store.getState().SkyfireMethodQueue.queues[queue.id][0];
            const { TemplateStack, Media } = store.getState();
            if (!method.owner) {
                store.dispatch(dequeueSkyfireMethod(method.queue));
                throw new Error('Attempted to execute an orphaned method');
            }
            if (isOwnerActive(TemplateStack, Media, method.owner) || isMethodUnparkable(method)) {
                store.dispatch(executeMethod(method));
            }
            else {
                store.dispatch(parkSkyfireMethod({ queue: method.queue, method }));
                store.dispatch(dequeueSkyfireMethod(method.queue));
            }
            break;
        }
        case DEQUEUE_SKYFIRE_METHOD:
            next(action);
            if (isSingleThreadedQueue(queue) && methodQueueState.queues[queue.id].length > 1) {
                store.dispatch(executeSkyfireQueuedMethod(queue));
            }
            break;
        default:
            next(action);
    }
    return undefined;
};
function isSingleThreadedQueue(queue) {
    return queue.interface === 'QueuesInterface.v1_0.SingleThreadedQueue';
}
function isMultithreadedQueue(queue) {
    return !isSingleThreadedQueue(queue);
}
function isOwnerActive(templateStackState, mediaState, ownerId) {
    return isTemplateActive(templateStackState, ownerId) || isMediaActive(mediaState, ownerId);
}
function isTemplateActive(templateStackState, templateId) {
    for (const overlayTemplate of templateStackState.overlayTemplates) {
        if (overlayTemplate.id === templateId) {
            return true;
        }
    }
    let activeTemplate = templateStackState.currentTemplate;
    if (!activeTemplate) {
        return true;
    }
    while (activeTemplate) {
        if (activeTemplate.id === templateId) {
            return true;
        }
        activeTemplate = activeTemplate.innerTemplate;
    }
    return false;
}
function isMediaActive(mediaState, mediaId) {
    return mediaId === mediaState.mediaId;
}
/**
 * Determine is a method can be parked or not. Some methods like Playback or invalidateTemplate
 * should be queue right away.
 *
 * @param  {ISkyfireMethod} method
 * @returns boolean
 */
function isMethodUnparkable(method) {
    return (method.queue.id === 'PLAYBACK' ||
        method.interface === INVALIDATE_TEMPLATE ||
        method.interface === INVOKE_HTTP_GLOBAL ||
        method.interface === SOFT_REFRESH_TEMPLATES ||
        method.queue.id === 'BOOKMARK_SYNC' ||
        method.queue.id === 'FOLLOW_SYNC' ||
        method.queue.id === 'SAVE_SYNC' ||
        method.queue.id === 'UI_METRICS_SYNC' ||
        method.queue.id === 'PLAYBACK_METRICS_SYNC' ||
        isNPVTemplateInterface(method));
}
/**
 * Determine if method is for Now Playing View template
 *
 * @param  {ISkyfireMethod} method
 * @returns boolean
 */
function isNPVTemplateInterface(method) {
    var _a, _b;
    if (method.queue.id === 'TEMPLATE' &&
        method.template &&
        method.template.interface) {
        return (((_a = method.template) === null || _a === void 0 ? void 0 : _a.interface) === NOW_PLAYING_TEMPLATE ||
            ((_b = method.template) === null || _b === void 0 ? void 0 : _b.interface) === VIDEO_NOW_PLAYING_TEMPLATE);
    }
    return false;
}
