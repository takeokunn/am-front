import * as PlaybackActions from '../actions/Playback';
import { globals } from '../utils';
import { resizeMediaCentralImage } from '../utils/resizeMediaCentralImage';
/*
    Leverage the  media session API on mobile devices.
    https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
*/
export const MediaSessionMiddleware = (store) => (next) => (action) => {
    next(action);
    if (!globals.navigator.mediaSession) {
        return;
    }
    switch (action.type) {
        case PlaybackActions.SET_MEDIA:
        case PlaybackActions.SET_VIDEO_MEDIA: {
            const { Media: media } = store.getState();
            if (media === null || media === void 0 ? void 0 : media.mediaId) {
                globals.navigator.mediaSession.metadata = new globals.MediaMetadata({
                    title: media.title,
                    artist: media.artistName,
                    album: media.albumName,
                    artwork: [
                        { src: media.artwork },
                        {
                            src: resizeMediaCentralImage(media.artwork, 96, undefined, 'webp'),
                            sizes: '96x96',
                            type: 'image/webp',
                        },
                        {
                            src: resizeMediaCentralImage(media.artwork, 128, undefined, 'webp'),
                            sizes: '128x128',
                            type: 'image/webp',
                        },
                        {
                            src: resizeMediaCentralImage(media.artwork, 192, undefined, 'webp'),
                            sizes: '192x192',
                            type: 'image/webp',
                        },
                        {
                            src: resizeMediaCentralImage(media.artwork, 256, undefined, 'webp'),
                            sizes: '256x256',
                            type: 'image/webp',
                        },
                        {
                            src: resizeMediaCentralImage(media.artwork, 384, undefined, 'webp'),
                            sizes: '384x384',
                            type: 'image/webp',
                        },
                        {
                            src: resizeMediaCentralImage(media.artwork, 512, undefined, 'webp'),
                            sizes: '512x512',
                            type: 'image/webp',
                        },
                    ],
                });
            }
            break;
        }
        case PlaybackActions.CLEAR:
        case PlaybackActions.CLEAR_VIDEO:
        case PlaybackActions.ENDED:
            globals.navigator.mediaSession.playbackState = 'none';
            break;
        case PlaybackActions.STARTED:
        case PlaybackActions.RESUMED:
            globals.navigator.mediaSession.playbackState = 'playing';
            break;
        case PlaybackActions.PAUSED:
            globals.navigator.mediaSession.playbackState = 'paused';
            break;
        default:
            break;
    }
};
