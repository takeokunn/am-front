import { UPDATE_LYRICS_VIEWED } from '../actions';
import { STARTED, STOPPED } from '../actions/Playback';
const initialState = {
    lyricsViewed: false,
};
export function LyricsViewedReducer(state = initialState, action) {
    switch (action.type) {
        // NPV has been opened once and we have lyrics.
        // We send a default value of [0] to indicate having lyrics.
        // Skyfire will perform the calculation based upon playback time.
        case UPDATE_LYRICS_VIEWED:
            return { lyricsViewed: true };
        case STOPPED:
        case STARTED:
            return { lyricsViewed: false };
        default:
            return state;
    }
}
