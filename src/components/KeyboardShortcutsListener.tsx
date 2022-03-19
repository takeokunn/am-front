import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { SHOW_TRANSPORT_OVERLAY, TRANSPORT_OVERLAY_ACTIVE_QUEUES, TRANSPORT_OVERLAY_PLAY_QUEUE, } from '../actions/TransportOverlay';
import { PLAY_NEXT, PLAY_PREVIOUS, PLAYBACK_TOGGLE, TRIGGER_ACTIVE_QUEUES, } from '../actions/Playback';
import { DIALOG_TEMPLATE } from '../types/templates/dialog';
import { globals } from '../utils';
const { document, window } = globals;
export default function KeyboardShortcutsListener() {
    var _a, _b;
    const PLAYBACK_SHORTCUTS = {
        SPACE: 'Space',
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        PLAYQUEUE: 'KeyP',
        ACTIVEQUEUES: 'KeyA',
    };
    const dispatch = useDispatch();
    const { mediaId } = useSelector((state) => state.Media);
    const { visualPlayQueue } = useSelector((state) => state.PlaybackStates);
    const { id, isTransportOverlayOpen } = useSelector((state) => state.TransportOverlay, shallowEqual);
    const { overlayTemplates } = useSelector((state) => state.TemplateStack);
    const isDialog = ((_a = overlayTemplates[0]) === null || _a === void 0 ? void 0 : _a.interface) === DIALOG_TEMPLATE;
    const isVisualPlayQueueDisabled = (_b = visualPlayQueue === null || visualPlayQueue === void 0 ? void 0 : visualPlayQueue.isDisabled) !== null && _b !== void 0 ? _b : true;
    function handleKeyboardShortcuts(e) {
        if (isDialog) {
            return;
        }
        const src = e.srcElement;
        // Don't listen for global shortcuts while the user is typing into an input field
        const inputFields = ['input', 'textarea'];
        if (inputFields.includes(src === null || src === void 0 ? void 0 : src.localName)) {
            return;
        }
        // Prevent Space from scrolling the page.
        // Source: https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
        if (e.keyCode === 32 && e.target === document.body) {
            e.preventDefault();
        }
        const isPlayQueueOpen = id === TRANSPORT_OVERLAY_PLAY_QUEUE && isTransportOverlayOpen;
        const isActiveQueuesOpen = id === TRANSPORT_OVERLAY_ACTIVE_QUEUES && isTransportOverlayOpen;
        switch (e.code) {
            case PLAYBACK_SHORTCUTS.PLAYQUEUE:
                if (!isPlayQueueOpen && !isVisualPlayQueueDisabled) {
                    dispatch({
                        type: SHOW_TRANSPORT_OVERLAY,
                        payload: { id: TRANSPORT_OVERLAY_PLAY_QUEUE },
                    });
                }
                break;
            case PLAYBACK_SHORTCUTS.ACTIVEQUEUES:
                if (!isActiveQueuesOpen) {
                    dispatch({
                        type: TRIGGER_ACTIVE_QUEUES,
                        payload: { transportOverlayId: TRANSPORT_OVERLAY_ACTIVE_QUEUES },
                    });
                }
                break;
            case PLAYBACK_SHORTCUTS.SPACE:
                if (mediaId) {
                    dispatch({ type: PLAYBACK_TOGGLE, payload: { mediaId } });
                }
                break;
            case PLAYBACK_SHORTCUTS.LEFT:
                if (mediaId) {
                    dispatch({ type: PLAY_PREVIOUS, payload: { mediaId } });
                }
                break;
            case PLAYBACK_SHORTCUTS.RIGHT:
                if (mediaId) {
                    dispatch({ type: PLAY_NEXT, payload: { mediaId } });
                }
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcuts);
        return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
    }, [isDialog, isVisualPlayQueueDisabled, mediaId]);
    return null;
}
