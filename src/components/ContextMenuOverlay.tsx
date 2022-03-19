import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CONTEXT_MENU } from '../actions/ContextMenu';
import { globals } from '../utils/globals';
import { isRetailPlayerRequest } from '../utils/retailPlayerHelper';
import * as Styles from './ContextMenuOverlay.scss';
import ContextMenuItem from './widgets/items/ContextMenuItem';
import ContextMenuWidget from './widgets/ContextMenuWidget';
const CONTEXT_MENU_WIDTH = 300;
const CONTEXT_MENU_HEIGHT = 300;
const WINDOW_PADDING = 24;
export const CONTEXT_MENU_OVERLAY_ID = 'contextMenuOverlay';
export const CONTEXT_MENU_HOVER_BUTTON_ID = 'contextMenuHoverButton';
function computeStyle(xOffset, yOffset, width = CONTEXT_MENU_WIDTH, height = CONTEXT_MENU_HEIGHT) {
    const styles = {
        left: `${xOffset}px`,
        top: `${yOffset}px`,
        opacity: 1,
    };
    // Does the right side of the context menu overflow the window width, so move the menu left,
    // positioning from the right
    if (xOffset + width + WINDOW_PADDING > globals.window.innerWidth) {
        delete styles.left;
        const contextRightFromLeftOfScreen = xOffset + width;
        const contextRightFromRightOfScreen = globals.window.innerWidth - contextRightFromLeftOfScreen;
        // It must be at least WINDOW_PADDING from the right
        const rightPosition = Math.max(contextRightFromRightOfScreen, WINDOW_PADDING);
        // @ts-ignore
        styles.right = `${rightPosition}px`;
    }
    // Does the bottom of the context menu overflow the bottom of the window, so move the menu up,
    // positioning from the bottom
    if (yOffset + height + WINDOW_PADDING > globals.window.innerHeight) {
        delete styles.top;
        const contextBottomFromTopofScreen = yOffset + height;
        const contextBottomFromBottomOfScreen = globals.window.innerHeight - contextBottomFromTopofScreen;
        // It must be at least WINDOW_PADDING from the bottom
        const bottomPosition = Math.max(contextBottomFromBottomOfScreen, WINDOW_PADDING);
        // @ts-ignore
        styles.bottom = `${bottomPosition}px`;
    }
    return styles;
}
function SignInButton({ signInButtonText }) {
    return (React.createElement("music-button", { variant: "solid", href: isRetailPlayerRequest(globals.location.hostname)
            ? '/music/player/forceSignIn'
            : '/forceSignIn?useHorizonte=true', id: "signInButton", style: { width: 'calc(100% - 20px)', margin: '0 10px' } }, signInButtonText));
}
export default function ContextMenuOverlay() {
    useStyles(Styles);
    const { buttonId, openedWithKeyboard, open, options, widget, xOffset, yOffset, refinement, hover, header, label, showSignInButton, signInButtonText, } = useSelector((state) => state.ContextMenu);
    const [positionStyles, setPositionStyles] = useState({ opacity: 0 });
    const [resized, setResized] = useState(0);
    const contextMenu = useRef(null);
    const dispatch = useDispatch();
    const closeContextMenu = () => {
        dispatch({ type: CLOSE_CONTEXT_MENU });
    };
    const getFirstAndLastOptions = () => {
        var _a;
        const menuOptions = (_a = contextMenu.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        return menuOptions && menuOptions.length
            ? {
                firstOption: menuOptions[0],
                lastOption: menuOptions[menuOptions.length - 1],
            }
            : {
                firstOption: undefined,
                lastOption: undefined,
            };
    };
    // Recompute layout based on context menu size after each context row item renders
    // TODO: Only do once after all render
    const onComponentDidRender = () => {
        var _a, _b, _c;
        const menuHeight = (_a = contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.current) === null || _a === void 0 ? void 0 : _a.offsetHeight;
        const menuWidth = (_b = contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.current) === null || _b === void 0 ? void 0 : _b.offsetWidth;
        setPositionStyles(computeStyle(xOffset, yOffset, menuWidth, menuHeight));
        if (openedWithKeyboard) {
            const menuOptions = getFirstAndLastOptions();
            (_c = menuOptions.firstOption) === null || _c === void 0 ? void 0 : _c.focus();
        }
    };
    const handleKeyDown = (event) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const menuOptions = getFirstAndLastOptions();
        switch (event.key) {
            case 'Escape':
                closeContextMenu();
                (_a = document.getElementById(buttonId)) === null || _a === void 0 ? void 0 : _a.focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                (_c = (_b = event.target) === null || _b === void 0 ? void 0 : _b.previousSibling) === null || _c === void 0 ? void 0 : _c.focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                (_e = (_d = event.target) === null || _d === void 0 ? void 0 : _d.nextSibling) === null || _e === void 0 ? void 0 : _e.focus();
                break;
            case 'Tab':
                if (event.target === menuOptions.lastOption && !event.shiftKey) {
                    event.preventDefault();
                    (_f = menuOptions.firstOption) === null || _f === void 0 ? void 0 : _f.focus();
                    break;
                }
                if (event.target === menuOptions.firstOption && event.shiftKey) {
                    event.preventDefault();
                    (_g = menuOptions.lastOption) === null || _g === void 0 ? void 0 : _g.focus();
                    break;
                }
                break;
            default:
                break;
        }
    };
    const handleOnMouseLeave = (event) => {
        var _a, _b;
        if (((_a = event === null || event === void 0 ? void 0 : event.toElement) === null || _a === void 0 ? void 0 : _a.id) !== CONTEXT_MENU_HOVER_BUTTON_ID &&
            ((_b = event === null || event === void 0 ? void 0 : event.relatedTarget) === null || _b === void 0 ? void 0 : _b.id) !== CONTEXT_MENU_HOVER_BUTTON_ID) {
            closeContextMenu();
        }
    };
    const hoverProps = (isRefContextMenu) => {
        var _a;
        if (positionStyles.right) {
            const menuWidth = ((_a = contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 0;
            positionStyles.left = `calc(100% - ${positionStyles.right} - ${menuWidth}px)`;
            delete positionStyles.right;
        }
        return hover
            ? {
                onMouseLeave: handleOnMouseLeave,
                id: CONTEXT_MENU_OVERLAY_ID,
                style: isRefContextMenu ? {} : positionStyles,
            }
            : isRefContextMenu
                ? { style: positionStyles }
                : { id: CONTEXT_MENU_OVERLAY_ID };
    };
    return open ? (React.createElement("div", Object.assign({ className: open ? Styles.modal : Styles.hidden, role: "dialog", "aria-modal": "true", "aria-label": "menu", onClick: closeContextMenu, onKeyDown: handleKeyDown }, hoverProps(false)),
        React.createElement("div", Object.assign({ className: Styles.modalContent, ref: contextMenu }, hoverProps(true)),
            !widget && header && (React.createElement("music-context-menu-header", { "primary-text": header, "label-text": label })),
            React.createElement("div", { role: "menu", className: Styles.menuOptions },
                widget && widget.items.length && (React.createElement(ContextMenuWidget, { data: widget, onContextMenuRender: onComponentDidRender, closeContextMenu: closeContextMenu })),
                showSignInButton && React.createElement(SignInButton, { signInButtonText: signInButtonText }),
                (options || []).map((option, idx) => (React.createElement(ContextMenuItem, { data: option, refinement: refinement, index: idx, onContextMenuRender: onComponentDidRender, closeContextMenu: closeContextMenu, link: option.link }))))))) : null;
}
