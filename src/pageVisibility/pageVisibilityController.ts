import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UAParser } from 'ua-parser-js';
import { PAUSED } from '../actions/Playback';
import { globals } from '../utils';
/**
 * Registers visibilitychange event on navigation.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
export default function PageVisibilityController() {
    const dispatch = useDispatch();
    const { mediaId } = useSelector((state) => state.Media);
    const { play } = useSelector((state) => state.PlaybackStates);
    const isMediaPlaying = (play === null || play === void 0 ? void 0 : play.state) === 'PLAYING';
    const RWP_MSHOP_DEVICE_TYPE = 'A3GUQNOIIEF57X';
    const ua = new UAParser(globals.navigator.userAgent);
    const os = ua.getOS();
    const handleAppPauseEvent = useCallback(() => {
        if (mediaId && isMediaPlaying) {
            dispatch({ type: PAUSED, payload: { mediaId } });
        }
    }, [mediaId, isMediaPlaying]);
    /**
     * Pause playback if the webview is moved to background in mShop ios app.
     */
    useEffect(() => {
        if (RWP_MSHOP_DEVICE_TYPE === globals.amznMusic.appConfig.deviceType && os.name === 'iOS') {
            document.addEventListener('visibilitychange', handleAppPauseEvent, false);
            return () => {
                document.removeEventListener('visibilitychange', handleAppPauseEvent, false);
            };
        }
        return () => { };
    }, [mediaId, play]);
    return null;
}
