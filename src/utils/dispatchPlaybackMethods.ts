import { enqueueSkyfireMethod } from '../actions';
export function dispatchPlaybackMethods(dispatch, mediaId, methods = []) {
    methods.forEach((method) => {
        dispatch(enqueueSkyfireMethod({
            queue: method.queue,
            method: Object.assign(Object.assign({}, method), { owner: mediaId }),
        }));
    });
}
