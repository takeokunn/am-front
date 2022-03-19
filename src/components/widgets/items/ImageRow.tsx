import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WINDOW_SIZE_ENUM } from '../../../types/IWindowSize';
import { SHIFT_CLICK } from '../../../actions';
import Template from '../../../Contexts/Template';
import { bindHandler, buildTags, preventDefault } from '../../../utils';
import { getDeeplink } from '../../../utils/getDeeplink';
import { useItemSelectedState } from '../../../utils/MultiSelectHook';
import { useObserver } from '../../../utils/ObserverHooks';
import useKeyPress from '../../../utils/useKeyPress';
import ContextMenuButton from '../../ContextMenuButton';
import Button from './Button';
import RowItemButton from './RowItemButton';
import { parseHtml } from '../../../utils/textParsingHelpers';
function ImageRow(props, ref) {
    const { image, imageDimension, primaryText, primaryLink, secondaryText1, secondaryText1Link, secondaryText2, secondaryText2Link, secondaryText3, isDisabled, isDisabledObserver, primaryBadges, secondaryBadges, buttons, icon, iconButton, contextMenu, button, isSelected, onCheckboxSelected, shouldFocus, focusDuration, } = props.data;
    const dispatch = useDispatch();
    const contextTemplate = useContext(Template);
    const template = props.template || contextTemplate;
    const isRowSelected = useItemSelectedState(isSelected, !!props.disableSelection);
    const onSelected = useObserver({ observer: onCheckboxSelected });
    const { windowWidth } = useSelector((state) => state.BrowserState);
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
    const disabledByObserver = useObserver({ observer: isDisabledObserver });
    // ImageRow should be disabled if either
    // isDisabledObserver object exists and useObserver hook returns true or
    // isDisabled boolean field is true
    const disabled = (isDisabledObserver && !!disabledByObserver) || isDisabled;
    const shiftKeyPressed = useKeyPress('Shift');
    const renderSecondaryTextInline = !props.disableSecondaryTextInline &&
        windowWidth > WINDOW_SIZE_ENUM.LG &&
        windowWidth <= WINDOW_SIZE_ENUM.XL2;
    const hasMultiSelectMethods = onSelected && onSelected.length > 0 && Array.isArray(onSelected);
    const bindHandlerHelper = (fn) => bindHandler(props.handleSelected, null, fn);
    const handleSelectedChange = useCallback(() => {
        const methods = hasMultiSelectMethods ? onSelected : primaryLink.onItemSelected;
        if (template && methods.length > 0) {
            dispatch({
                type: SHIFT_CLICK,
                payload: {
                    methods,
                    shiftKeyPressed,
                    template: hasMultiSelectMethods ? template : template.innerTemplate,
                    index: props.index,
                },
            });
        }
    }, [dispatch, template, onSelected, shiftKeyPressed]);
    if (props === null || props === void 0 ? void 0 : props.loading) {
        return (React.createElement("music-image-row", { loading: true, index: props.data.isIndexable && props.index !== undefined
                ? props.index + 1
                : undefined }));
    }
    const key = primaryText + secondaryText1 + secondaryText2 + props.index;
    return (React.createElement("music-image-row", { ref: ref || defaultRef, key: key, "data-key": key, style: props.style, index: props.data.isIndexable && props.index !== undefined ? props.index + 1 : undefined, onKeyPress: onEnterPress, onClick: preventDefault, "icon-name": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon) || icon, "show-action-button": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected.length) > 0, onmusicIconActivate: bindHandlerHelper(iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected), disabled: disabled, selected: isRowSelected, onmusicSelectedChange: handleSelectedChange, "primary-text": primaryText, "primary-href": getDeeplink(primaryLink.deeplink), onmusicPrimaryTextActivate: bindHandlerHelper(primaryLink.onItemSelected), "secondary-text-1": props.data.shouldParseTextAsHTML ? parseHtml(secondaryText1) : secondaryText1, "secondary-href-1": getDeeplink(secondaryText1Link === null || secondaryText1Link === void 0 ? void 0 : secondaryText1Link.deeplink), onmusicSecondaryText1Activate: bindHandlerHelper(secondaryText1Link === null || secondaryText1Link === void 0 ? void 0 : secondaryText1Link.onItemSelected), "secondary-text-2": secondaryText2, "secondary-href-2": getDeeplink(secondaryText2Link === null || secondaryText2Link === void 0 ? void 0 : secondaryText2Link.deeplink), onmusicSecondaryText2Activate: bindHandlerHelper(secondaryText2Link === null || secondaryText2Link === void 0 ? void 0 : secondaryText2Link.onItemSelected), "render-secondary-text-inline": renderSecondaryTextInline, duration: secondaryText3, "image-src": image, "image-dimen": imageDimension, "show-border": hasMultiSelectMethods, focused: isFocused, "secondary-tags": secondaryBadges },
        buildTags(primaryBadges, isDisabled),
        buttons.map((element) => (React.createElement(RowItemButton, { slot: "buttons", button: element }))),
        button && (React.createElement(Button, { data: button, handleSelected: props.handleSelected, slot: "buttons", size: "small", usePlaceholder: buttons.length === 0 })),
        contextMenu && (React.createElement(ContextMenuButton, { options: contextMenu.options, disabled: disabled || contextMenu.disabled, slot: "contextMenu", variant: "primary", iconName: "more", size: "small" }))));
}
export default forwardRef(ImageRow);
