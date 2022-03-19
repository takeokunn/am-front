import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isDesktop } from '../utils/platform';
import { dispatchSkyfireMethods, globals } from '../utils';
import { useInView } from '../utils/useItemsInView';
import * as Styles from './Notification.scss';
import TextWithLink from './widgets/items/TextWithLink';
export default function NotificationRibbon(props) {
    var _a, _b, _c, _d;
    useStyles(Styles);
    const dispatch = useDispatch();
    const { ribbon } = useSelector((state) => state.Ribbon);
    const { mediaId } = useSelector((state) => state.Media);
    const { overlayTemplates } = useSelector((state) => state.TemplateStack);
    const { transportBottomOverride, enableTransportBottomOverride } = useSelector((state) => state.MShop);
    const [mobileTransportBottom, setMobileTransportBottom] = useState(85);
    const hasOverlay = overlayTemplates.length > 0;
    const closeCallback = useCallback((event) => {
        if (!ribbon)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = ribbon.closeButton;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, ribbon]);
    const leftButtonCallback = useCallback((event) => {
        if (!ribbon)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = ribbon.leftButton.primaryLink;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, ribbon]);
    const rightButtonCallback = useCallback((event) => {
        if (!ribbon)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = ribbon.rightButton.primaryLink;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, ribbon]);
    useEffect(() => {
        if (!ribbon)
            return () => { };
        const timer = setTimeout(() => {
            closeCallback();
        }, ribbon.timeoutMilliseconds);
        return () => clearTimeout(timer);
    }, [ribbon]);
    useEffect(() => {
        var _a, _b;
        const uiContentViewOnViewEnabled = (_b = (_a = globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.uiContentViewOnViewEnabled;
        if (!uiContentViewOnViewEnabled && (ribbon === null || ribbon === void 0 ? void 0 : ribbon.onViewed)) {
            dispatchSkyfireMethods(dispatch, props.template, ribbon.onViewed);
        }
    }, [ribbon]);
    useEffect(() => {
        if (enableTransportBottomOverride) {
            const bottomValue = transportBottomOverride + 85;
            setMobileTransportBottom(bottomValue);
        }
        else {
            setMobileTransportBottom(85);
        }
    }, [enableTransportBottomOverride]);
    const onViewed = useCallback(() => {
        if (ribbon === null || ribbon === void 0 ? void 0 : ribbon.onViewed) {
            dispatchSkyfireMethods(dispatch, props.template, ribbon.onViewed);
        }
    }, [dispatch, ribbon === null || ribbon === void 0 ? void 0 : ribbon.onViewed]);
    const callbackRef = useInView(onViewed);
    if (!ribbon ||
        (hasOverlay &&
            overlayTemplates[0].interface !== props.template.interface &&
            !props.isNowPlaying)) {
        return null;
    }
    const leftButton = ribbon.leftButton && (React.createElement("music-button", { href: ribbon.leftButton.primaryLink.deeplink, onClick: leftButtonCallback, slot: "buttons", variant: "outline" }, ribbon.leftButton.text));
    const rightButton = ribbon.rightButton && (React.createElement("music-button", { href: ribbon.rightButton.primaryLink.deeplink, onClick: rightButtonCallback, slot: "buttons", variant: "solid" }, ribbon.rightButton.text));
    let transportHeight;
    if (!isDesktop(window)) {
        transportHeight = props.isNowPlaying ? 0 : mobileTransportBottom;
    }
    else {
        transportHeight = props.isNowPlaying ? 125 : 85;
    }
    const bottomPosition = mediaId ? transportHeight : 0;
    return (React.createElement("music-notification-ribbon", { ref: callbackRef, style: {
            bottom: `${bottomPosition}px`,
        }, kind: "accent", closable: !!(ribbon === null || ribbon === void 0 ? void 0 : ribbon.closeButton), onmusicRibbonCloseButtonActivate: closeCallback }, (_b = (_a = ribbon.message) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_d = (_c = ribbon.message) === null || _c === void 0 ? void 0 : _c.textWithLinks) === null || _d === void 0 ? void 0 : _d.map((textWithLinkElement) => (React.createElement(TextWithLink, { data: textWithLinkElement, template: props.template }))),
        leftButton,
        rightButton));
}
