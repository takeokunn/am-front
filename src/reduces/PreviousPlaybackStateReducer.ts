import { SET_PREVIOUS_PLAYBACK_STATE } from '../actions/Playback';
const initialState = {
    state: undefined,
};
export function PreviousPlaybackStateReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PREVIOUS_PLAYBACK_STATE:
            return { state: action.payload };
        default:
            return state;
    }
}
