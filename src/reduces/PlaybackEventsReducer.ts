import { CLEAR, CLEAR_VIDEO, SET_MEDIA, SET_VIDEO_MEDIA, } from '../actions/Playback';
const initialState = {
    onStarted: [],
    onResumed: [],
    onScrubbed: [],
    onPaused: [],
    onFinished: [],
    onStopped: [],
    onRebuffered: [],
    onError: [],
    bufferTime: 0,
    currentTime: 0,
    playbackStarted: false,
};
const reducer = {
    [CLEAR]: (state, action) => initialState,
    [CLEAR_VIDEO]: (state, action) => initialState,
    [SET_MEDIA]: (state, action) => (Object.assign(Object.assign({}, state), action.payload.events)),
    [SET_VIDEO_MEDIA]: (state, action) => (Object.assign(Object.assign({}, state), action.payload.events)),
};
export function PlaybackEventsReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
