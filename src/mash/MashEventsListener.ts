import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PAUSED } from '../actions/Playback';
import { APP_PAUSE } from './MashEvents';
import { globals } from '../utils';
const { window } = globals;
/**
 * Registers handling of MASH events for mShop
 * Reference: https://w.amazon.com/index.php/MASH/MASH_1.4_API#MASH_Events
 */
export default function MashEventsListener() {
    const dispatch = useDispatch();
    const { mediaId } = useSelector((state) => state.Media);
    const { play } = useSelector((state) => state.PlaybackStates);
    const isMediaPlaying = (play === null || play === void 0 ? void 0 : play.state) === 'PLAYING';
    const handleAppPauseEvent = useCallback(() => {
        if (mediaId && isMediaPlaying) {
            dispatch({ type: PAUSED, payload: { mediaId } });
        }
    }, [mediaId, isMediaPlaying]);
    /**
     * Pause playback if the webview is moved to background in mShop app.
     */
    useEffect(() => {
        var _a;
        (_a = window.P) === null || _a === void 0 ? void 0 : _a.when('mash').execute((mash) => {
            if (mash && mash.addEventListener) {
                mash.addEventListener(APP_PAUSE, handleAppPauseEvent);
            }
        });
        return () => {
            var _a;
            (_a = window.P) === null || _a === void 0 ? void 0 : _a.when('mash').execute((mash) => {
                if (mash && mash.removeEventListener) {
                    mash.removeEventListener(APP_PAUSE, handleAppPauseEvent);
                }
            });
        };
    }, [mediaId, play]);
    return null;
}
