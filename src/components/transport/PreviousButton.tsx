import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PLAY_PREVIOUS } from '../../actions/Playback';
export default function PreviousButton(props) {
    useEffect(() => { var _a; return (_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaSession) === null || _a === void 0 ? void 0 : _a.setActionHandler('previoustrack', triggerPrevious); }, []);
    const dispatch = useDispatch();
    const { previous } = useSelector((state) => state.PlaybackStates);
    const { mediaId } = useSelector((state) => state.Media);
    const triggerPrevious = () => dispatch({ type: PLAY_PREVIOUS, payload: { mediaId } });
    return (React.createElement("music-button", { ariaLabelText: previous === null || previous === void 0 ? void 0 : previous.description, disabled: false, className: (previous === null || previous === void 0 ? void 0 : previous.isDisabled)
            ? 'disabled hydrated sc-music-button-h'
            : 'hydrated sc-music-button-h', onmusicActivate: triggerPrevious, variant: "primary", "icon-name": "previous", "icon-only": true, size: props.size || 'small' }, previous === null || previous === void 0 ? void 0 : previous.description));
}
