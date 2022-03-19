import { SET_ACTIVITY_FEED_STATE_METHOD } from '../actions';
export const initialState = {
    feedItemIds: [],
};
export function ActivityFeedReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVITY_FEED_STATE_METHOD:
            return {
                feedItemIds: action.payload.feedItemIds,
            };
        default:
            return state;
    }
}
