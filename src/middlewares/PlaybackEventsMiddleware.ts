import * as PlaybackActions from '../actions/Playback';
import { dispatchPlaybackMethods } from '../utils/dispatchPlaybackMethods';
export const PlaybackEventsMiddleware = (store) => (next) => (action) => {
    const playbackEvents = store.getState().PlaybackEvents;
    const playbackActions = store.getState().PlaybackActions;
    const playbackStates = store.getState().PlaybackStates;
    const { mediaId } = store.getState().Media;
    const template = store.getState().TemplateStack.currentTemplate;
    if (!template) {
        next(action);
        return;
    }
    switch (action.type) {
        case PlaybackActions.STARTED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onStarted);
            break;
        case PlaybackActions.RESUMED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onResumed);
            break;
        case PlaybackActions.SCRUBBED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onScrubbed);
            break;
        case PlaybackActions.PAUSED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onPaused);
            break;
        case PlaybackActions.ENDED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onFinished);
            break;
        case PlaybackActions.STOPPED:
        case PlaybackActions.CLEAR:
            setPreviousPlaybackState();
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onStopped);
            break;
        case PlaybackActions.REBUFFERED:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onRebuffered);
            break;
        case PlaybackActions.ERROR:
            dispatchPlaybackMethods(store.dispatch, mediaId, playbackEvents.onError);
            break;
        case PlaybackActions.PLAY_NEXT:
            if (playbackActions.onNext) {
                setPreviousPlaybackState();
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onNext);
            }
            break;
        case PlaybackActions.PLAY_PREVIOUS:
            if (playbackActions.onPrevious) {
                setPreviousPlaybackState();
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onPrevious);
            }
            break;
        case PlaybackActions.REPEAT_ALL:
            if (playbackActions.onRepeatAll) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onRepeatAll);
            }
            break;
        case PlaybackActions.REPEAT_OFF:
            if (playbackActions.onRepeatOff) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onRepeatOff);
            }
            break;
        case PlaybackActions.REPEAT_ONE:
            if (playbackActions.onRepeatOne) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onRepeatOne);
            }
            break;
        case PlaybackActions.SHUFFLE_OFF:
            if (playbackActions.onShuffleOff) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onShuffleOff);
            }
            break;
        case PlaybackActions.SHUFFLE_ON:
            if (playbackActions.onShuffleOn) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onShuffleOn);
            }
            break;
        case PlaybackActions.THUMBS_DOWN:
            if (playbackActions.onThumbsDown) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onThumbsDown);
            }
            break;
        case PlaybackActions.THUMBS_UP:
            if (playbackActions.onThumbsUp) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onThumbsUp);
            }
            break;
        case PlaybackActions.UNDO_THUMBS_DOWN:
            if (playbackActions.onUndoThumbsDown) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onUndoThumbsDown);
            }
            break;
        case PlaybackActions.UNDO_THUMBS_UP:
            if (playbackActions.onUndoThumbsUp) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onUndoThumbsUp);
            }
            break;
        case PlaybackActions.SET_VOLUME:
            if (playbackActions.onVolumeChange) {
                dispatchPlaybackMethods(store.dispatch, mediaId, playbackActions.onVolumeChange);
            }
            break;
        default:
            break;
    }
    next(action);
    function setPreviousPlaybackState() {
        var _a;
        store.dispatch({
            type: PlaybackActions.SET_PREVIOUS_PLAYBACK_STATE,
            payload: (_a = playbackStates.play) === null || _a === void 0 ? void 0 : _a.state,
        });
    }
};
