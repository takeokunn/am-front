import { HAS_NOT_SOFT_REFRESHED, HAS_SOFT_REFRESHED } from '../actions';
export const initialState = {
    hasSoftRefreshed: false,
};
export function SoftRefreshReducer(state = initialState, action) {
    switch (action.type) {
        case HAS_SOFT_REFRESHED:
            return {
                hasSoftRefreshed: true,
            };
        case HAS_NOT_SOFT_REFRESHED:
            return {
                hasSoftRefreshed: false,
            };
        default:
            return state;
    }
}
