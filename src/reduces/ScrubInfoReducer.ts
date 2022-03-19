import { ENDED, UPDATE_SCRUB_INFO } from '../actions/Playback';
const initialState = {
    currentTime: -1,
    scrubTime: -1,
};
export function ScrubInfoReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_SCRUB_INFO:
            return {
                currentTime: action.payload.currentTime,
                scrubTime: action.payload.scrubTime,
            };
        case ENDED:
            return initialState;
        default:
            return state;
    }
}
