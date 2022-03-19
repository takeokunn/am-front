import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REPEAT_ALL, REPEAT_OFF, REPEAT_ONE } from '../../actions/Playback';
export default function RepeatButton(props) {
    const dispatch = useDispatch();
    const { repeat } = useSelector((state) => state.PlaybackStates);
    const text = repeat === null || repeat === void 0 ? void 0 : repeat.descriptions[repeat.state];
    const variant = (repeat === null || repeat === void 0 ? void 0 : repeat.state) !== 'OFF' ? 'accent' : 'primary';
    const icon = (repeat === null || repeat === void 0 ? void 0 : repeat.state) === 'ONE' ? 'repeatone' : 'repeat';
    return (React.createElement("music-button", { ariaLabelText: text, onClick: handleClick, variant: variant, "icon-name": icon, "icon-only": true, size: props.size || 'small' }));
    function handleClick(e) {
        if (!e.target.disabled && repeat) {
            if (repeat.state === 'OFF') {
                if (repeat === null || repeat === void 0 ? void 0 : repeat.isRepeatAllDisabled) {
                    dispatch({ type: REPEAT_ONE });
                }
                else {
                    dispatch({ type: REPEAT_ALL });
                }
            }
            else if (repeat.state === 'ALL') {
                dispatch({ type: REPEAT_ONE });
            }
            else {
                dispatch({ type: REPEAT_OFF });
            }
        }
    }
}
