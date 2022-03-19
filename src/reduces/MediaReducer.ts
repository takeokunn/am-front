import { ADD_PLAY_QUEUE_DATA, AWAIT_PLAY_QUEUE, CLEAR, CLEAR_VIDEO, INVALIDATE_PLAY_QUEUE, PLAYBACK_NOT_SUPPORTED, REMOVE_FROM_QUEUE, REORDER, SET_BACKGROUND_IMAGE, SET_LYRICS, SET_STREAMING_BADGE, SET_STREAMING_INFO, SET_MEDIA, SET_VIDEO_MEDIA, SET_PLAY_QUEUE_DATA, SET_ACTIVE_QUEUES_DATA, SET_WEB_MEDIA, } from '../actions/Playback';
const initialState = {
    albumName: '',
    subTitle: '',
    subTitleContainerType: '',
    subTitleLink: undefined,
    durationSeconds: 0,
    logo: '',
    artistName: '',
    artwork: '',
    mediaId: '',
    title: '',
    button: {},
    musicExperienceActionButtons: undefined,
    isForMusicExperience: false,
    contextMenu: {},
    onBackgroundImageRequired: [],
    hasLyrics: false,
    onLyricsRequired: [],
    hasStreamingBadge: false,
    streamingBadge: 'SD',
    bitDepth: 0,
    sampleRate: 0,
    onMediaViewed: [],
    onVisualPlayQueueDataRequired: [],
    onActiveQueuesDataRequired: [],
    onMiniTransportViewed: [],
    onPlaybackNotSupported: [],
    onStatsForNerdsRequired: [],
    onTrackRatingDataRequired: [],
    npvBackground: '',
    lyrics: undefined,
    playQueue: undefined,
    activeQueuesData: undefined,
    fetchingPlayQueue: false,
};
function array_move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}
const reducer = {
    [CLEAR]: (state, action) => initialState,
    [CLEAR_VIDEO]: (state, action) => initialState,
    [PLAYBACK_NOT_SUPPORTED]: (state, action) => initialState,
    [SET_MEDIA]: (state, action) => (Object.assign(Object.assign(Object.assign({}, initialState), action.payload.metadata), { npvBackground: '' })),
    [SET_VIDEO_MEDIA]: (state, action) => (Object.assign(Object.assign({}, initialState), action.payload.metadata)),
    [SET_WEB_MEDIA]: (state, action) => (Object.assign(Object.assign(Object.assign({}, state), action.payload.metadata), { onPlaybackNotSupported: action.payload.onPlaybackNotSupported })),
    [SET_BACKGROUND_IMAGE]: (state, action) => (Object.assign(Object.assign({}, state), { npvBackground: action.payload.image })),
    [SET_LYRICS]: (state, action) => (Object.assign(Object.assign({}, state), { lyrics: action.payload.lyrics })),
    [SET_STREAMING_BADGE]: (state, action) => (Object.assign(Object.assign({}, state), { streamingBadge: action.payload.streamingBadge })),
    [SET_STREAMING_INFO]: (state, action) => (Object.assign(Object.assign({}, state), { bitDepth: action.payload.bitDepth, sampleRate: action.payload.sampleRate })),
    [SET_PLAY_QUEUE_DATA]: (state, action) => (Object.assign(Object.assign({}, state), {
        // TODO: delete "|| action.payload.playQueueTemplate" once CQE code is merged into prod
        // @ts-ignore
        playQueue: action.payload.overlayTemplate || action.payload.playQueueTemplate, fetchingPlayQueue: false })),
    [ADD_PLAY_QUEUE_DATA]: (state, action) => {
        var _a;
        if ((_a = state === null || state === void 0 ? void 0 : state.playQueue) === null || _a === void 0 ? void 0 : _a.widgets) {
            const widgetToUpdate = state.playQueue.widgets[0];
            widgetToUpdate.items = widgetToUpdate.items.concat(action.payload.items);
            if ('onEndOfWidget' in widgetToUpdate) {
                widgetToUpdate.onEndOfWidget = action.payload.onEndOfWidget;
            }
            widgetToUpdate.onViewed = action.payload.onViewed;
            const playQueue = Object.assign(Object.assign({}, state.playQueue), {
                widgets: [widgetToUpdate],
            });
            return Object.assign(Object.assign({}, state), { playQueue });
        }
        return state;
    },
    [SET_ACTIVE_QUEUES_DATA]: (state, action) => (Object.assign(Object.assign({}, state), { activeQueuesData: action.payload.overlayTemplate, fetchingPlayQueue: false })),
    [INVALIDATE_PLAY_QUEUE]: (state) => (Object.assign(Object.assign({}, state), { playQueue: undefined })),
    [AWAIT_PLAY_QUEUE]: (state) => (Object.assign(Object.assign({}, state), { fetchingPlayQueue: true })),
    [REORDER]: (state, action) => {
        var _a;
        if ((_a = state === null || state === void 0 ? void 0 : state.playQueue) === null || _a === void 0 ? void 0 : _a.widgets) {
            const playQueueWidget = state.playQueue.widgets[0];
            const items = [...playQueueWidget.items];
            array_move(items, action.payload.fromIndex, action.payload.toIndex);
            playQueueWidget.items = items;
            return Object.assign(Object.assign({}, state), { playQueue: Object.assign(Object.assign({}, state.playQueue), { widgets: [playQueueWidget] }) });
        }
        return state;
    },
    [REMOVE_FROM_QUEUE]: (state, action) => {
        var _a, _b;
        if ((_a = state === null || state === void 0 ? void 0 : state.playQueue) === null || _a === void 0 ? void 0 : _a.widgets) {
            const playQueueWidget = state.playQueue.widgets[0];
            const items = (_b = playQueueWidget.items) === null || _b === void 0 ? void 0 : _b.filter((item) => item.id !== action.payload.mediaId);
            playQueueWidget.items = items;
            return Object.assign(Object.assign({}, state), { playQueue: Object.assign(Object.assign({}, state.playQueue), { widgets: [playQueueWidget] }) });
        }
        return state;
    },
};
export function MediaReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
