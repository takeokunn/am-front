import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchSkyfireMethods, globals } from '../utils';
import { useInView } from '../utils/useItemsInView';
import * as Styles from './Notification.scss';
import { getDeeplink } from '../utils/getDeeplink';
const nativeAppImageSrc = 'https://d5fx445wy2wpk.cloudfront.net/static/logo_native_app.png';
export default function Tooltip(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { tooltip } = useSelector((state) => state.Tooltip);
    const { mediaId } = useSelector((state) => state.Media);
    const { overlayTemplates } = useSelector((state) => state.TemplateStack);
    const { isSearchBoxFocused } = useSelector((state) => state.SearchSuggestions);
    const hasOverlay = overlayTemplates.length > 0;
    const { isNowPlaying } = props;
    const closeCallback = useCallback((event) => {
        if (!tooltip)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = tooltip.closeButton.primaryLink;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, tooltip]);
    const secondaryActionButtonCallback = useCallback((event) => {
        if (!(tooltip === null || tooltip === void 0 ? void 0 : tooltip.secondaryActionButton))
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = tooltip === null || tooltip === void 0 ? void 0 : tooltip.secondaryActionButton.primaryLink;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, tooltip]);
    const actionButtonCallback = useCallback((event) => {
        if (!tooltip)
            return;
        event.preventDefault();
        const { onItemSelected } = tooltip.actionButton.primaryLink;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, tooltip]);
    useEffect(() => {
        if (!tooltip)
            return () => { };
        const timer = setTimeout(() => {
            closeCallback();
        }, tooltip.timeoutMilliseconds);
        return () => clearTimeout(timer);
    }, [tooltip]);
    useEffect(() => {
        var _a, _b;
        const uiContentViewOnViewEnabled = (_b = (_a = globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.uiContentViewOnViewEnabled;
        if (!uiContentViewOnViewEnabled && (tooltip === null || tooltip === void 0 ? void 0 : tooltip.onViewed)) {
            dispatchSkyfireMethods(dispatch, props.template, tooltip === null || tooltip === void 0 ? void 0 : tooltip.onViewed);
        }
    }, [tooltip]);
    const onViewed = useCallback(() => {
        if (tooltip === null || tooltip === void 0 ? void 0 : tooltip.onViewed) {
            dispatchSkyfireMethods(dispatch, props.template, tooltip === null || tooltip === void 0 ? void 0 : tooltip.onViewed);
        }
    }, [dispatch, tooltip === null || tooltip === void 0 ? void 0 : tooltip.onViewed]);
    const callbackRef = useInView(onViewed);
    if (!tooltip || (hasOverlay && !isNowPlaying) || isSearchBoxFocused) {
        return null;
    }
    const actionButton = tooltip.actionButton && (React.createElement("music-button", { size: "small", href: getDeeplink(tooltip.actionButton.primaryLink.deeplink), onClick: actionButtonCallback, slot: "buttons", variant: "solid" }, tooltip.actionButton.text));
    const secondaryActionButton = tooltip.secondaryActionButton && (React.createElement("music-button", { size: "small", href: getDeeplink(tooltip.secondaryActionButton.primaryLink.deeplink), onClick: secondaryActionButtonCallback, slot: "buttons", variant: "outline" }, tooltip.secondaryActionButton.text));
    const image = tooltip.id === 'native-app-upsell' ? nativeAppImageSrc : null;
    return (React.createElement("music-tooltip", { ref: callbackRef, id: tooltip.id, "primary-text": tooltip.message, "secondary-text": tooltip.title, className: [
            Styles.tooltip,
            'hydrated',
            mediaId ? Styles.media : null,
            isNowPlaying ? Styles.nowPlayingView : null,
        ].join(' '), kind: "accent", closable: !!(tooltip === null || tooltip === void 0 ? void 0 : tooltip.closeButton), onmusicTooltipCloseButtonActivate: closeCallback, "image-src": image },
        secondaryActionButton,
        actionButton));
}
