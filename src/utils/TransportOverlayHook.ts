import { useSelector } from 'react-redux';
import { TRANSPORT_OVERLAY_ACTIVE_QUEUES, TRANSPORT_OVERLAY_PLAY_QUEUE } from '../actions';
export function useIsVisualPlayQueueDisabled() {
    return useSelector((state) => { var _a; return !!((_a = state.PlaybackStates.visualPlayQueue) === null || _a === void 0 ? void 0 : _a.isDisabled); });
}
export function useIsTransportOverlayLoaded() {
    return useSelector((state) => {
        var _a, _b, _c, _d;
        if (state.TransportOverlay.id === TRANSPORT_OVERLAY_ACTIVE_QUEUES) {
            return !!((_b = (_a = state.Media.activeQueuesData) === null || _a === void 0 ? void 0 : _a.widgets) === null || _b === void 0 ? void 0 : _b.length);
        }
        if (state.TransportOverlay.id === TRANSPORT_OVERLAY_PLAY_QUEUE) {
            return !!((_d = (_c = state.Media.playQueue) === null || _c === void 0 ? void 0 : _c.widgets) === null || _d === void 0 ? void 0 : _d.length);
        }
        return false;
    });
}
