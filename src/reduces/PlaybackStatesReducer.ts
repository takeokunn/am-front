import { PodcastPlaybackActions } from 'dm-podcast-web-player';
import { BUFFERING, CLEAR, CLEAR_VIDEO, PAUSED, PLAY, PLAY_VIDEO, REBUFFERED, REPEAT_ALL, REPEAT_OFF, REPEAT_ONE, RESUMED, SET_MEDIA, SET_VIDEO_MEDIA, SET_PLAY_QUEUE_CONTROL, SHUFFLE_OFF, SHUFFLE_ON, STARTED, THUMBS_DOWN, THUMBS_UP, UNDO_THUMBS_DOWN, UNDO_THUMBS_UP, } from '../actions/Playback';
const initialState = {
    content: {
        state: 'READY',
    },
};
function updateState(state, props) {
    const newPropsValue = props.reduce((newProps, prop) => {
        if (!state[prop.name]) {
            return newProps;
        }
        return Object.assign(Object.assign({}, newProps), { [prop.name]: Object.assign(Object.assign({}, state[prop.name]), { state: prop.value }) });
    }, {});
    return Object.assign(Object.assign({}, state), newPropsValue);
}
const reducer = {
    [CLEAR]: () => initialState,
    [CLEAR_VIDEO]: () => initialState,
    [SET_MEDIA]: (state, action) => {
        if (action.payload.states) {
            return Object.assign(Object.assign({}, state), action.payload.states);
        }
        return state;
    },
    [SET_VIDEO_MEDIA]: (state, action) => {
        if (action.payload.states) {
            return Object.assign(Object.assign({}, state), action.payload.states);
        }
        return state;
    },
    [RESUMED]: (state, action) => updateState(state, [{ name: 'play', value: 'PLAYING' }]),
    [PLAY || PodcastPlaybackActions.PLAY]: (state, action) => updateState(state, [{ name: 'play', value: 'PLAYING' }]),
    [PLAY_VIDEO]: (state, action) => updateState(state, [{ name: 'play', value: 'PLAYING' }]),
    [STARTED]: (state, action) => updateState(state, [
        { name: 'play', value: 'PLAYING' },
        { name: 'content', value: 'READY' },
    ]),
    [BUFFERING]: (state, action) => updateState(state, [{ name: 'content', value: 'WAITING' }]),
    [REBUFFERED]: (state, action) => updateState(state, [{ name: 'content', value: 'READY' }]),
    [PAUSED]: (state, action) => updateState(state, [{ name: 'play', value: 'PAUSED' }]),
    [SHUFFLE_ON]: (state, action) => updateState(state, [{ name: 'shuffle', value: 'ON' }]),
    [SHUFFLE_OFF]: (state, action) => updateState(state, [{ name: 'shuffle', value: 'OFF' }]),
    [REPEAT_OFF]: (state, action) => updateState(state, [{ name: 'repeat', value: 'OFF' }]),
    [REPEAT_ALL]: (state, action) => updateState(state, [{ name: 'repeat', value: 'ALL' }]),
    [REPEAT_ONE]: (state, action) => updateState(state, [{ name: 'repeat', value: 'ONE' }]),
    [THUMBS_UP]: (state, action) => updateState(state, [
        { name: 'thumbsUp', value: 'ON' },
        { name: 'thumbsDown', value: 'OFF' },
    ]),
    [UNDO_THUMBS_UP]: (state, action) => updateState(state, [{ name: 'thumbsUp', value: 'OFF' }]),
    [THUMBS_DOWN]: (state, action) => updateState(state, [
        { name: 'thumbsUp', value: 'OFF' },
        { name: 'thumbsDown', value: 'ON' },
    ]),
    [UNDO_THUMBS_DOWN]: (state, action) => updateState(state, [{ name: 'thumbsDown', value: 'OFF' }]),
    [SET_PLAY_QUEUE_CONTROL]: (state, action) => (Object.assign(Object.assign({}, state), { visualPlayQueue: action.payload.visualPlayQueue })),
};
export function PlaybackStatesReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
