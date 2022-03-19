import { INIT_TRACK_PERFORMANCE_DATA, UPDATE_TRACK_PERFORMANCE_DATA, UPDATE_PLAYBACK_SESSION_PERFORMANCE_DATA, } from '../actions/Playback';
const initialState = {
    trackPerformanceMap: {},
    sessionPerformance: {},
};
export function PlaybackPerformanceReducer(state = initialState, action) {
    switch (action.type) {
        case INIT_TRACK_PERFORMANCE_DATA: {
            const { uri, playbackRequestedTime, isAudioPlayerColdstart, isEMECheckColdstart, } = action.payload;
            const [, id] = uri.split('://');
            const isRepeat = !!state.trackPerformanceMap[id];
            const isInitialPlayback = Object.entries(state.trackPerformanceMap).length === 0;
            return Object.assign(Object.assign({}, state), { trackPerformanceMap: Object.assign(Object.assign({}, state.trackPerformanceMap), { [id]: {
                        uri,
                        playbackRequestedTime,
                        isAudioPlayerColdstart,
                        isEMECheckColdstart,
                        isRepeat,
                        isInitialPlayback,
                    } }) });
        }
        case UPDATE_TRACK_PERFORMANCE_DATA: {
            const { data, id } = action.payload;
            return Object.assign(Object.assign({}, state), { trackPerformanceMap: Object.assign(Object.assign({}, state.trackPerformanceMap), { [id]: Object.assign(Object.assign({}, state.trackPerformanceMap[id]), data) }) });
        }
        case UPDATE_PLAYBACK_SESSION_PERFORMANCE_DATA: {
            const { data } = action.payload;
            return Object.assign(Object.assign({}, state), { sessionPerformance: Object.assign(Object.assign({}, state.sessionPerformance), data) });
        }
        default:
            return state;
    }
}
