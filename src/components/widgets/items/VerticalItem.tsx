import React, { forwardRef } from 'react';
import { CIRCLE_VERTICAL_ITEM, RECTANGLE_VERTICAL_ITEM, } from '../../../types/templates/widgets/items/ISkyfireVerticalItem';
import { bindHandler, buildTags, preventDefault } from '../../../utils';
import { getDeeplink } from '../../../utils/getDeeplink';
import { useObserver } from '../../../utils/ObserverHooks';
import ContextMenuButton from '../../ContextMenuButton';
import Button from './Button';
// eslint-disable-next-line no-shadow
export var VerticalItemSize;
(function (VerticalItemSize) {
    VerticalItemSize[VerticalItemSize["Small"] = 0] = "Small";
    VerticalItemSize[VerticalItemSize["Medium"] = 1] = "Medium";
})(VerticalItemSize || (VerticalItemSize = {}));
const verticalItemSizeProperties = {
    [VerticalItemSize.Small]: 'small',
    [VerticalItemSize.Medium]: 'medium',
};
/**
 * Calculates vertical item size based on internal content.
 * @param item vertical item
 */
export function getItemSize(item) {
    return item.secondaryText ? VerticalItemSize.Medium : VerticalItemSize.Small;
}
/**
 * Returns the vertical item type based on the Interface returned from Skyfire.
 * Possible values are circle, rectangle and square
 * @param interfaceType String
 */
export function getVerticalItemType(interfaceType) {
    switch (interfaceType) {
        case CIRCLE_VERTICAL_ITEM:
            return 'circle';
        case RECTANGLE_VERTICAL_ITEM:
            return 'rectangle';
        default:
            return 'square';
    }
}
function VerticalItem(props, ref) {
    const { image, placeHolder, primaryText, primaryLink, secondaryText, secondaryLink, tertiaryText, tertiaryLink, isDisabled, hintIconName, actionIconName, actionIconLink, iconButton, tags, leftButton, label, contextMenu, rating, reviewCount, } = props.data;
    const { position } = props;
    const bindHandlerHelper = (fn) => bindHandler(props.handleSelected, this, fn);
    const primaryTextElement = useObserver(primaryText);
    const iconButtonElement = useObserver(iconButton);
    const finalPrimaryText = (primaryTextElement === null || primaryTextElement === void 0 ? void 0 : primaryTextElement.text) || (primaryTextElement === null || primaryTextElement === void 0 ? void 0 : primaryTextElement.text) === ''
        ? primaryTextElement.text
        : primaryText;
    const key = finalPrimaryText + (secondaryText || '') + position;
    return (React.createElement("music-vertical-item", { ref: ref, key: key, "data-key": key, style: props.role === 'editProfile' ? 'padding: 0' : props.style, disabled: isDisabled, "image-src": image, "place-holder-src": placeHolder, onClick: preventDefault, "primary-text": `${position ? `${position}. ` : ''}${finalPrimaryText}`, "primary-href": getDeeplink(primaryLink.deeplink), kind: getVerticalItemType(props.data.interface), constraint: props.constraint, "parent-size": verticalItemSizeProperties[props.parentSize || VerticalItemSize.Small], "hint-icon-name": hintIconName, "icon-name": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon) || actionIconName, showActionButton: !!actionIconLink, onmusicPrimaryTextActivate: bindHandlerHelper(primaryLink.onItemSelected), role: props.role || 'gridcell', label: label || '', "secondary-text": secondaryText, "secondary-href": getDeeplink(secondaryLink === null || secondaryLink === void 0 ? void 0 : secondaryLink.deeplink), onmusicSecondaryTextActivate: bindHandlerHelper(secondaryLink ? secondaryLink.onItemSelected : []), "tertiary-text": tertiaryText, "tertiary-href": getDeeplink(tertiaryLink === null || tertiaryLink === void 0 ? void 0 : tertiaryLink.deeplink), onmusicTertiaryTextActivate: bindHandlerHelper(tertiaryLink ? tertiaryLink.onItemSelected : []), onmusicActionButtonActivate: bindHandlerHelper((iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected) ||
            (actionIconLink ? actionIconLink.onItemSelected : [])), rating: rating, "review-count": reviewCount },
        buildTags(tags, isDisabled),
        leftButton && (React.createElement(Button, { data: leftButton, handleSelected: props.handleSelected, slot: "leftButton" })),
        contextMenu && (React.createElement(ContextMenuButton, { options: contextMenu.options, disabled: contextMenu.disabled, slot: "rightButton", variant: "primary", iconName: "more", onItemSelected: contextMenu.onItemSelected }))));
}
export default forwardRef(VerticalItem);
