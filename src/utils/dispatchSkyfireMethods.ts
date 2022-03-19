import { enqueueSkyfireMethod } from '../actions';
export function dispatchSkyfireMethods(dispatch, template, methods = []) {
    methods.forEach((method) => {
        dispatch(enqueueSkyfireMethod({
            queue: method.queue,
            method: Object.assign(Object.assign({}, method), { owner: template.id }),
        }));
    });
}
