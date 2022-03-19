import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CONTEXT_MENU, OPEN_CONTEXT_MENU } from '../actions/ContextMenu';
import { CONTEXT_MENU_HOVER_BUTTON_ID, CONTEXT_MENU_OVERLAY_ID } from './ContextMenuOverlay';
import { executeMethods } from '../actions';
export default function ContextMenuButton(props) {
    const { slot, id, options, widget, handleSelected, isRefinement, size, variant, iconName, postFixIconName, disabled, text, hover, header, label, showSignInButton, signInButtonText, ariaLabelText, } = props;
    const [active, setActive] = useState(false);
    const { open } = useSelector((state) => state.ContextMenu);
    const buttonRef = useRef(null);
    const dispatch = useDispatch();
    const openContextMenu = (event) => {
        var _a;
        event.stopPropagation();
        if (event.detail.stopPropagation) {
            event.detail.stopPropagation();
        }
        setActive(true);
        const buttonOffsets = ((_a = buttonRef === null || buttonRef === void 0 ? void 0 : buttonRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || new DOMRect();
        const buttonHeight = buttonOffsets.height;
        const padding = 14;
        const xOffset = document.documentElement.dir === 'rtl'
            ? event.detail.clientX || -1 * (window.innerWidth - buttonOffsets.left) + 170
            : buttonOffsets.left || event.detail.clientX;
        const yOffset = buttonOffsets.top
            ? buttonOffsets.top + buttonHeight + padding
            : event.detail.clientY + padding;
        if (props.onItemSelected) {
            dispatch(executeMethods(props.onItemSelected));
        }
        // This indicate how many times the mouse was clicked in the same area
        const mouseClickedTimes = event.detail.detail;
        const openedWithKeyboard = mouseClickedTimes === 0;
        const buttonId = hover ? CONTEXT_MENU_HOVER_BUTTON_ID : id;
        dispatch({
            type: OPEN_CONTEXT_MENU,
            payload: {
                buttonId,
                openedWithKeyboard,
                widget,
                handleSelected,
                options,
                xOffset,
                yOffset,
                refinement: true,
                hover,
                header,
                label,
                showSignInButton,
                signInButtonText,
            },
        });
    };
    const closeContextMenu = (event) => {
        var _a, _b;
        if (((_a = event === null || event === void 0 ? void 0 : event.toElement) === null || _a === void 0 ? void 0 : _a.id) !== CONTEXT_MENU_OVERLAY_ID &&
            ((_b = event === null || event === void 0 ? void 0 : event.relatedTarget) === null || _b === void 0 ? void 0 : _b.id) !== CONTEXT_MENU_OVERLAY_ID) {
            dispatch({ type: CLOSE_CONTEXT_MENU });
        }
    };
    const handleMouseEvent = (event) => {
        event.stopPropagation();
    };
    const hoverProps = hover
        ? {
            onMouseEnter: openContextMenu,
            onMouseLeave: closeContextMenu,
            id: CONTEXT_MENU_HOVER_BUTTON_ID,
        }
        : {};
    useEffect(() => {
        if (!open) {
            setActive(false);
        }
    }, [open]);
    const postFixIconStyle = {
        paddingInlineStart: '8px',
        verticalAlign: 'middle',
        lineHeight: 'normal',
    };
    return (React.createElement("music-button", Object.assign({ id: id, slot: slot, onmusicActivate: openContextMenu, "icon-name": iconName, "icon-only": !text, variant: variant, refinement: isRefinement ? (active ? 'open' : 'static') : 'none', size: size, disabled: disabled, onMouseUp: handleMouseEvent, onMouseDown: handleMouseEvent, ref: buttonRef, ariaLabelText: ariaLabelText }, hoverProps),
        text || '',
        postFixIconName ? (React.createElement("music-icon", { name: postFixIconName, size: "tiny", style: postFixIconStyle })) : null));
}
