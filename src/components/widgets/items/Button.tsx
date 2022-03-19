import * as React from 'react';
import { useDispatch } from 'react-redux';
import { bindHandler } from '../../../utils';
import { useObserver } from '../../../utils/ObserverHooks';
import { UPDATE_RECOMMENDED_TRACK_POSITION } from '../../../actions';
export const placeholderSizeMap = {
    tiny: 28,
    small: 40,
    medium: 48,
    large: 64,
};
const handleMouseEvent = (event) => {
    event.stopPropagation();
};
export default function Button(props) {
    const dispatch = useDispatch();
    const button = useObserver(props.data);
    const { disabled, icon, iconHover, iconOnly, onItemSelected, text } = button;
    const { id, slot, usePlaceholder } = props;
    const size = props.size || 'medium';
    const variant = props.variant || 'primary';
    const onSelected = bindHandler(props.handleSelected, null, onItemSelected);
    const onActivate = (event) => {
        var _a;
        event.stopPropagation();
        (_a = event.detail) === null || _a === void 0 ? void 0 : _a.stopPropagation();
        onSelected();
        if (props.updatedTrackPosition !== undefined) {
            dispatch({
                type: UPDATE_RECOMMENDED_TRACK_POSITION,
                payload: { updatedTrackPosition: props.updatedTrackPosition },
            });
        }
    };
    return icon || text ? (React.createElement("music-button", { id: id, slot: slot, onmusicActivate: onActivate, variant: variant, size: size, "icon-only": iconOnly, "icon-name": icon, "icon-hover-name": iconHover, disabled: disabled, title: text, "aria-label": text, onMouseUp: handleMouseEvent, onMouseDown: handleMouseEvent }, !iconOnly && text)) : usePlaceholder ? (React.createElement("div", { style: { minWidth: placeholderSizeMap[size] || 0 }, slot: slot })) : null;
}
