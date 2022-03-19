import { SHOW_TRANSPORT_OVERLAY, SET_ACTIVE_QUEUES_DATA } from '../actions';
export const ActiveQueuesMiddleware = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case SET_ACTIVE_QUEUES_DATA:
            // Need to set active queues data on each call for its data to be fresh
            store.dispatch({
                type: SHOW_TRANSPORT_OVERLAY,
                payload: {
                    overlayTemplate: action.payload.overlayTemplate,
                    onDataRequired: action.payload.onDataRequired,
                },
            });
            break;
        default:
            break;
    }
};
