import { WINDOW_RESIZE } from '../actions';
export function BrowserReducer(state = initialState, action) {
    switch (action.type) {
        case WINDOW_RESIZE:
            return Object.assign(Object.assign({}, state), { windowHeight: action.payload.windowHeight, windowWidth: Math.min(1600, action.payload.windowWidth) });
        default:
            return state;
    }
}
const initialState = {
    windowHeight: window === null || window === void 0 ? void 0 : window.innerHeight,
    windowWidth: Math.min(1600, window === null || window === void 0 ? void 0 : window.innerWidth),
};
