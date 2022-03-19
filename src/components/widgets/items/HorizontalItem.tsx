import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { getLocalizedEventTime } from '../../../utils/liveEventDateTime';
import { CIRCLE_HORIZONTAL_ITEM, RECTANGLE_HORIZONTAL_ITEM, } from '../../../types/templates/widgets/items/ISkyfireHorizontalItem';
import { bindHandler, buildTags, globals, preventDefault } from '../../../utils';
import { getDeeplink } from '../../../utils/getDeeplink';
import { useObserver } from '../../../utils/ObserverHooks';
import ContextMenuButton from '../../ContextMenuButton';
import Button from './Button';
// eslint-disable-next-line no-shadow
export var HorizontalItemSize;
(function (HorizontalItemSize) {
    HorizontalItemSize[HorizontalItemSize["Small"] = 0] = "Small";
    HorizontalItemSize[HorizontalItemSize["Medium"] = 1] = "Medium";
    HorizontalItemSize[HorizontalItemSize["Large"] = 2] = "Large";
})(HorizontalItemSize || (HorizontalItemSize = {}));
const horizontalItemSizeProperties = {
    [HorizontalItemSize.Small]: 'small',
    [HorizontalItemSize.Medium]: 'medium',
    [HorizontalItemSize.Large]: 'large',
};
/**
 * Calculates horizontal item size based on internal content.
 * @param item horizontal item
 */
export function getItemSize(item) {
    // TODO account for tertiary text once we support this
    const hasSecondaryTextAndLabel = !!item.secondaryText && !!item.label;
    if (hasSecondaryTextAndLabel) {
        return getBottomTags(item).length ? HorizontalItemSize.Large : HorizontalItemSize.Medium;
    }
    return HorizontalItemSize.Small;
}
/**
 * Returns non-explicit tags, which are displayed on a separate row.
 * @param item horizontal item
 */
function getBottomTags(item) {
    if (!item.tags)
        return [];
    return item.tags.filter((t) => t !== 'E');
}
/**
 * Returns the horizontal item type based on the Interface returned from Skyfire.
 * Possible values are circle, rectangle and square
 * @param interfaceType String
 */
function getHorizontalItemType(interfaceType) {
    switch (interfaceType) {
        case CIRCLE_HORIZONTAL_ITEM:
            return 'circle';
        case RECTANGLE_HORIZONTAL_ITEM:
            return 'rectangle';
        default:
            return 'square';
    }
}
const getSecondaryTextForLiveEvent = (liveEventDate, Authentication) => {
    const tz = globals.timezone;
    const formattedLocaleString = Authentication.displayLanguageId.replace('_', '-');
    return getLocalizedEventTime(liveEventDate, formattedLocaleString, tz, Authentication);
};
function HorizontalItem(props, ref) {
    const { image, labelText, primaryText, primaryLink, secondaryText, secondaryLink, tertiaryText, tertiaryLink, badgeText, isDisabled, isFeatured, isLocked, label, actionIconName, actionIconLink, iconButton, tags, button, contextMenu, featured, liveEventDate, showNavigationIcon, } = props.data;
    const { position, role } = props;
    const { Authentication } = useSelector((state) => state);
    const bindHandlerHelper = (fn) => bindHandler(props.handleSelected, null, fn);
    const primaryTextElement = useObserver(primaryText);
    const iconButtonElement = useObserver(iconButton);
    const bottomTags = getBottomTags(props.data);
    const isActivityFeed = role === 'feeditem';
    const onActivityFeedClick = (e) => {
        e.preventDefault();
        bindHandlerHelper(primaryLink === null || primaryLink === void 0 ? void 0 : primaryLink.onItemSelected)();
    };
    const key = ((primaryTextElement === null || primaryTextElement === void 0 ? void 0 : primaryTextElement.text) || primaryText) + (secondaryText || '') + props.index;
    return (React.createElement("music-horizontal-item", { ref: ref, key: key, "data-key": key, role: role, style: props.style, disabled: isDisabled, featured: isFeatured, locked: isLocked, label: label, "image-src": image, onClick: isActivityFeed ? onActivityFeedClick : preventDefault, "label-text": labelText, "primary-text": `${position ? `${position}. ` : ''}${(primaryTextElement === null || primaryTextElement === void 0 ? void 0 : primaryTextElement.text) || primaryText}`, size: horizontalItemSizeProperties[props.size || HorizontalItemSize.Small], parentSize: horizontalItemSizeProperties[props.parentSize || HorizontalItemSize.Small], kind: getHorizontalItemType(props.data.interface), "primary-href": getDeeplink(primaryLink === null || primaryLink === void 0 ? void 0 : primaryLink.deeplink), "icon-name": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon) || actionIconName, "show-action-button": (iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected.length) > 0 || !!actionIconLink, onmusicPrimaryTextActivate: isActivityFeed ? preventDefault : bindHandlerHelper(primaryLink === null || primaryLink === void 0 ? void 0 : primaryLink.onItemSelected), "secondary-text": isFeatured && liveEventDate
            ? getSecondaryTextForLiveEvent(new Date(liveEventDate), Authentication)
            : secondaryText, "secondary-href": getDeeplink(secondaryLink === null || secondaryLink === void 0 ? void 0 : secondaryLink.deeplink), "tertiary-text": tertiaryText, "tertiary-href": getDeeplink(tertiaryLink === null || tertiaryLink === void 0 ? void 0 : tertiaryLink.deeplink), "badge-text": badgeText, "bottom-tags": bottomTags, onmusicSecondaryTextActivate: bindHandlerHelper(secondaryLink ? secondaryLink.onItemSelected : []), onmusicActionButtonActivate: bindHandlerHelper((iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected) ||
            (actionIconLink ? actionIconLink.onItemSelected : [])), alwaysShowButton: props.alwaysShowButton, showNavigationIcon: showNavigationIcon },
        tags.includes('E') ? buildTags(['E'], isDisabled, true) : null,
        button && (React.createElement(Button, { data: button, handleSelected: props.handleSelected, slot: "buttons", size: "small", updatedTrackPosition: props.updatedTrackPosition })),
        contextMenu && (React.createElement(ContextMenuButton, { options: contextMenu.options, disabled: contextMenu.disabled, slot: "buttons", variant: "primary", iconName: "more", size: "small", onItemSelected: contextMenu.onItemSelected }))));
}
export default forwardRef(HorizontalItem);
