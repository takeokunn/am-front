import { CREATE_AND_BIND_TEMPLATE, CREATE_TEMPLATE, END_TRANSPORT_HOVERING, HIDE_TRANSPORT_OVERLAY, SHOW_TRANSPORT_OVERLAY, START_TRANSPORT_HOVERING, TOGGLE_TRANSPORT_OVERLAY, } from '../actions';
export const initialState = {
    id: undefined,
    isTransportHovering: false,
    isTransportOverlayOpen: false,
    lastHoverTimestamp: Date.now(),
    onDataRequired: [],
};
export function TransportOverlayReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_TRANSPORT_OVERLAY:
            return {
                id: action.payload.id || state.id,
                isTransportOverlayOpen: true,
                isTransportHovering: state.isTransportHovering,
                lastHoverTimestamp: state.lastHoverTimestamp,
                onDataRequired: action.payload.onDataRequired || state.onDataRequired,
            };
        case TOGGLE_TRANSPORT_OVERLAY: {
            const isOpen = !state.isTransportOverlayOpen;
            return {
                id: action.payload.id,
                isTransportOverlayOpen: isOpen,
                isTransportHovering: state.isTransportHovering,
                lastHoverTimestamp: state.lastHoverTimestamp,
                onDataRequired: isOpen ? action.payload.onDataRequired : [],
            };
        }
        case HIDE_TRANSPORT_OVERLAY:
            return {
                id: undefined,
                isTransportOverlayOpen: false,
                isTransportHovering: state.isTransportHovering,
                lastHoverTimestamp: state.lastHoverTimestamp,
                onDataRequired: [],
            };
        case CREATE_TEMPLATE:
        case CREATE_AND_BIND_TEMPLATE:
            return {
                isTransportOverlayOpen: false,
                isTransportHovering: state.isTransportHovering,
                lastHoverTimestamp: state.lastHoverTimestamp,
                onDataRequired: [],
            };
        case START_TRANSPORT_HOVERING:
            return Object.assign(Object.assign({}, state), { isTransportHovering: true, lastHoverTimestamp: action.payload.timestamp });
        case END_TRANSPORT_HOVERING:
            return Object.assign(Object.assign({}, state), { isTransportHovering: false });
        default:
            return state;
    }
}
