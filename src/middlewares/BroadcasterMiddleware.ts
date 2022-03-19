import * as PlaybackActions from '../actions/Playback';
import { getAudioInstance } from '../player';
import { getMediaUpdate } from '../utils';
/*
    Leverage the  media session API on mobile devices.
    https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
*/
export const BroadcasterMiddleware = (store) => (next) => async (action) => {
    next(action);
    switch (action.type) {
        case PlaybackActions.SET_MEDIA: {
            const { Media: media } = store.getState();
            if (!(media === null || media === void 0 ? void 0 : media.mediaId)) {
                return;
            }
            const player = await getAudioInstance();
            const mediaUpdate = getMediaUpdate(media);
            const broadcaster = player.playbackBroadcaster;
            if (!broadcaster || !broadcaster.isHealthy || !player.configuration.flags.broadcast) {
                return;
            }
            broadcaster.postToParentWindow(mediaUpdate);
            break;
        }
        default:
            break;
    }
};
