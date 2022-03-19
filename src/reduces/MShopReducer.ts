import { SET_TRANSPORT_BOTTOM_OVERRIDE, ENABLE_TRANSPORT_BOTTOM_OVERRIDE } from '../actions';
const initialState = {
    transportBottomOverride: 0,
    enableTransportBottomOverride: false,
};
export function MShopReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TRANSPORT_BOTTOM_OVERRIDE:
            return Object.assign(Object.assign({}, state), { transportBottomOverride: action.payload.transportBottomOverride });
        case ENABLE_TRANSPORT_BOTTOM_OVERRIDE:
            return Object.assign(Object.assign({}, state), { enableTransportBottomOverride: action.payload.enableTransportBottomOverride });
        default:
            return state;
    }
}
