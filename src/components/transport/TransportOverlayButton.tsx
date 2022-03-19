import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
export default function TransportOverlayButton(props) {
    const dispatch = useDispatch();
    const { mediaId } = useSelector((state) => state.Media, shallowEqual);
    const { id, isTransportOverlayOpen } = useSelector((state) => state.TransportOverlay, shallowEqual);
    const triggerAction = () => dispatch({ type: props.action, payload: { transportOverlayId: props.id, mediaId } });
    const isOpen = id === props.id && isTransportOverlayOpen;
    return (React.createElement("music-button", { id: "transport-overlay-button", "icon-only": true, onmusicActivate: triggerAction, "icon-name": isOpen ? 'caretdown' : props.icon, disabled: !isOpen && props.disabled, variant: "primary", size: props.size || 'small', airaLabelText: isTransportOverlayOpen ? 'Close PlayQueue' : 'Open PlayQueue' }));
}
