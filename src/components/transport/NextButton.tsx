import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PLAY_NEXT } from '../../actions/Playback';
export default function NextButton(props) {
    useEffect(() => { var _a; return (_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaSession) === null || _a === void 0 ? void 0 : _a.setActionHandler('nexttrack', triggerNext); }, []);
    const dispatch = useDispatch();
    const { next } = useSelector((state) => state.PlaybackStates);
    const { mediaId } = useSelector((state) => state.Media);
    const triggerNext = () => dispatch({ type: PLAY_NEXT, payload: { mediaId } });
    return (React.createElement("music-button", { ariaLabelText: next === null || next === void 0 ? void 0 : next.description, disabled: false, className: (next === null || next === void 0 ? void 0 : next.isDisabled)
            ? 'disabled hydrated sc-music-button-h'
            : 'hydrated sc-music-button-h', onmusicActivate: triggerNext, variant: props.variant || 'primary', "icon-name": props.icon || 'next', id: props.id || 'nextButton', "icon-only": true, size: props.size || 'small' }, next === null || next === void 0 ? void 0 : next.description));
}
