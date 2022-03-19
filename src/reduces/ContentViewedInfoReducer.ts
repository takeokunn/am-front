import { SET_CONTENT_VIEWED_INDICES, } from '../actions/ContentViewed';
const initialState = {
    firstViewableIndex: undefined,
    lastViewableIndex: undefined,
};
export function ContentViewedInfoReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CONTENT_VIEWED_INDICES:
            return action.payload;
        default:
            return state;
    }
}
