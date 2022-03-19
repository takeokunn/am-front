import { CLEAR, CLEAR_VIDEO, SET_MEDIA, SET_VIDEO_MEDIA, } from '../actions/Playback';
const initialState = {
    onNext: undefined,
    onPrevious: undefined,
    onRepeatAll: undefined,
    onRepeatOff: undefined,
    onRepeatOne: undefined,
    onShuffleOff: undefined,
    onShuffleOn: undefined,
    onThumbsDown: undefined,
    onThumbsUp: undefined,
    onUndoThumbsDown: undefined,
    onUndoThumbsUp: undefined,
    onVolumeChange: undefined,
    onClosedCaptionsOff: undefined,
    onClosedCaptionsOn: undefined,
    onToggleToAudio: undefined,
    onToggleToVideo: undefined,
};
const reducer = {
    [CLEAR]: () => initialState,
    [CLEAR_VIDEO]: () => initialState,
    [SET_MEDIA]: (state, action) => {
        if (action.payload.actions) {
            return Object.assign(Object.assign({}, state), action.payload.actions);
        }
        return state;
    },
    [SET_VIDEO_MEDIA]: (state, action) => {
        if (action.payload.actions) {
            return Object.assign(Object.assign({}, state), action.payload.actions);
        }
        return state;
    },
};
export function PlaybackActionsReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
