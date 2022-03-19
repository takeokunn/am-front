import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SHUFFLE_OFF, SHUFFLE_ON } from '../../actions/Playback';
export default function ShuffleButton(props) {
    const dispatch = useDispatch();
    const { shuffle } = useSelector((state) => state.PlaybackStates);
    const variant = (shuffle === null || shuffle === void 0 ? void 0 : shuffle.state) === 'ON' ? 'accent' : 'primary';
    const text = shuffle === null || shuffle === void 0 ? void 0 : shuffle.descriptions[shuffle.state];
    return (React.createElement("music-button", { ariaLabelText: text, onClick: handleClick, variant: variant, "icon-name": "shuffle", "icon-only": true, size: props.size || 'small', disabled: shuffle === null || shuffle === void 0 ? void 0 : shuffle.isDisabled }, text));
    function handleClick(e) {
        if (!e.target.disabled && shuffle) {
            if (shuffle.state === 'ON') {
                dispatch({ type: SHUFFLE_OFF });
            }
            else {
                dispatch({ type: SHUFFLE_ON });
            }
        }
    }
}
