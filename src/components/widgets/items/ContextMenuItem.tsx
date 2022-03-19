import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useObserver } from '../../../../src/utils/ObserverHooks';
import { bindHandler, dispatchSkyfireMethods } from '../../../utils';
import { selectedRowCount } from '../../../utils/DownloadSelectHook';
import * as Styles from './ContextMenuItem.scss';
const noop = () => true;
export default function ContextMenuItem(props) {
    const contextMenuItem = useObserver(props.data);
    const downloadSelectCount = useSelector(selectedRowCount());
    const { downloadLimit } = contextMenuItem;
    const dispatch = useDispatch();
    const template = useSelector((state) => state.TemplateStack.currentTemplate);
    useStyles(Styles);
    const onItemSelected = useCallback(() => {
        var _a;
        if (template) {
            dispatchSkyfireMethods(dispatch, template, contextMenuItem.onItemSelected || ((_a = props.link) === null || _a === void 0 ? void 0 : _a.onItemSelected));
        }
        props.closeContextMenu();
    }, []);
    const onEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            onItemSelected();
        }
    };
    const text = () => {
        if (downloadLimit) {
            return `${contextMenuItem.text} (${downloadSelectCount})`;
        }
        return contextMenuItem.text;
    };
    const disabled = downloadLimit
        ? downloadSelectCount === 0 || downloadSelectCount > downloadLimit
        : !!contextMenuItem.disabled;
    // For now we will only show the filter icons in context menus
    // Plus caretRight for RWP use-case
    const isSupportedIcons = {
        radiouncheck: true,
        radiocheck: true,
        caretright: true,
    };
    const iconSlot = props.refinement ? 'right' : 'left';
    const icon = contextMenuItem.icon && isSupportedIcons[contextMenuItem.icon] && (React.createElement("music-icon", { className: contextMenuItem.isActive ? Styles.activeIcon : '', slot: iconSlot, size: "small", variant: contextMenuItem.isActive ? 'accent' : 'glass', name: contextMenuItem.icon }));
    if (contextMenuItem.hidden) {
        return null;
    }
    if (contextMenuItem.isHeader) {
        return (React.createElement("music-list-item-header", { headerText: contextMenuItem.headerText, slot: props.slot },
            React.createElement("music-button", { slot: "right", variant: "glass", size: "small", onClick: bindHandler(onItemSelected, null) }, contextMenuItem.text)));
    }
    const onComponentDidRender = props.onContextMenuRender ? props.onContextMenuRender : noop;
    return (React.createElement("music-list-item", { tabIndex: 0, role: "menuItem", className: contextMenuItem.isHeader ? Styles.headerItem : '', id: `contextMenuOption${props.index + 1}`, slot: props.slot, onClick: bindHandler(onItemSelected, null), onKeyPress: bindHandler(onEnterKeyPress, null), "primary-text": text(), "secondary-text": contextMenuItem.secondaryText ? contextMenuItem.secondaryText : null, variant: contextMenuItem.isActive ? 'accent' : 'primary', size: "medium", onmusicComponentDidRender: onComponentDidRender, disabled: disabled }, icon));
}
