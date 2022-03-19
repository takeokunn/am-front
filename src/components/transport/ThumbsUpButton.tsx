import React from 'react';
import { useSelector } from 'react-redux';
import { bindHandler } from '../../utils';
import { useObserver } from '../../utils/ObserverHooks';
export default function ThumbsUpButton(props) {
    const { RATINGS } = useSelector((state) => state.Storage);
    const button = useObserver(props.data);
    const { icon, disabled, onItemSelected, text } = button;
    const trackRating = RATINGS === null || RATINGS === void 0 ? void 0 : RATINGS.TRACK_RATING;
    const onSelected = bindHandler(props.handleSelected, null, onItemSelected);
    const onActivate = (event) => {
        var _a;
        event.stopPropagation();
        (_a = event.detail) === null || _a === void 0 ? void 0 : _a.stopPropagation();
        onSelected();
    };
    return (React.createElement("music-button", { ariaLabelText: text, onmusicActivate: onActivate, variant: trackRating === 'THUMBS_UP' ? 'accent' : 'primary', "icon-name": icon, "icon-only": true, disabled: disabled, size: props.size || 'small' }));
}
