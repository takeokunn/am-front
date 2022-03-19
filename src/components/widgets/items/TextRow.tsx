import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState, } from 'react';
import { useDispatch } from 'react-redux';
import Template from '../../../Contexts/Template';
import { bindHandler, buildTags, dispatchSkyfireMethods, preventDefault } from '../../../utils';
import { getDeeplink } from '../../../utils/getDeeplink';
import { useItemSelectedState } from '../../../utils/MultiSelectHook';
import { useObserver } from '../../../utils/ObserverHooks';
import ContextMenuButton from '../../ContextMenuButton';
import Button from './Button';
import RowItemButton from './RowItemButton';
function TextRow(props, ref) {
    const { popularity, primaryText, primaryLink, secondaryText1, secondaryText1Link, secondaryText2, secondaryText2Link, secondaryText3, isDisabled, primaryBadges, secondaryBadges, buttons, icon, iconButton, rowIndex, contextMenu, button, isSelected, onCheckboxSelected, shouldFocus, focusDuration, } = props.data;
    const dispatch = useDispatch();
    const contextTemplate = useContext(Template);
    const template = props.template || contextTemplate;
    const isRowSelected = useItemSelectedState(isSelected, !!props.disableSelection);
    const onSelected = useObserver({ observer: onCheckboxSelected });
    const [isFocused, setIsFocused] = useState(shouldFocus && (props.isInitialRender || !focusDuration));
    const defaultRef = useRef(null);
    useEffect(() => {
        if (isFocused && focusDuration) {
            setTimeout(() => {
                setIsFocused(false);
            }, focusDuration);
        }
    }, [isFocused, focusDuration]);
    const onEnterPress = (event) => {
        if (event.key === 'Enter') {
            props.handleSelected(primaryLink.onItemSelected);
        }
    };
    const iconButtonElement = useObserver(iconButton);
    const bindHandlerHelper = (fn) => bindHandler(props.handleSelected, null, fn);
    const handleSelectedChange = useCallback(() => {
        const methods = Array.isArray(onSelected) ? onSelected : primaryLink.onItemSelected;
        if (template && methods.length > 0) {
            dispatchSkyfireMethods(dispatch, template, methods);
        }
    }, [dispatch, template, onSelected]);
    const key = primaryText + secondaryText1 + secondaryText2 + props.index;
    return (React.createElement("music-text-row", { ref: ref || defaultRef, key: key, "data-key": key, style: props.style, index: rowIndex || props.index + 1, onClick: preventDefault, onKeyPress: onEnterPress, "icon-name": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon) || icon, onmusicIconActivate: bindHandlerHelper(iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected), "primary-text": primaryText, selected: isRowSelected, onmusicSelectedChange: handleSelectedChange, onmusicPrimaryTextActivate: bindHandlerHelper(primaryLink.onItemSelected), disabled: isDisabled, "secondary-text-1": secondaryText1, "secondary-href-1": getDeeplink(secondaryText1Link === null || secondaryText1Link === void 0 ? void 0 : secondaryText1Link.deeplink), onmusicSecondaryText1Activate: bindHandlerHelper(secondaryText1Link === null || secondaryText1Link === void 0 ? void 0 : secondaryText1Link.onItemSelected), "secondary-text-2": secondaryText2, "secondary-href-2": getDeeplink(secondaryText2Link === null || secondaryText2Link === void 0 ? void 0 : secondaryText2Link.deeplink), onmusicSecondaryText2Activate: bindHandlerHelper(secondaryText2Link === null || secondaryText2Link === void 0 ? void 0 : secondaryText2Link.onItemSelected), duration: secondaryText3, rating: popularity, focused: isFocused, "secondary-tags": secondaryBadges },
        buildTags(primaryBadges, isDisabled),
        buttons.map((element) => (React.createElement(RowItemButton, { slot: "buttons", button: element }))),
        button && (React.createElement(Button, { data: button, handleSelected: props.handleSelected, slot: "buttons", size: "small", usePlaceholder: buttons.length === 0 })),
        contextMenu && (React.createElement(ContextMenuButton, { options: contextMenu.options, disabled: contextMenu.disabled, slot: "contextMenu", variant: "primary", iconName: "more", size: "small" }))));
}
export default forwardRef(TextRow);
