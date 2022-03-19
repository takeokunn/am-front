import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isDesktop } from '../utils/platform';
import { dispatchSkyfireMethods } from '../utils';
import { useInView } from '../utils/useItemsInView';
import useTimeout from '../utils/useTimeout';
import * as Styles from './Notification.scss';
export default function NotificationToast(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { toast } = useSelector((state) => state.Toast);
    const { mediaId } = useSelector((state) => state.Media);
    const { overlayTemplates } = useSelector((state) => state.TemplateStack);
    const { transportBottomOverride, enableTransportBottomOverride } = useSelector((state) => state.MShop);
    const [mobileTransportBottom, setMobileTransportBottom] = useState(85);
    const timerRef = useRef(null);
    const hasOverlay = overlayTemplates.length > 0;
    const closeCallback = useCallback((event) => {
        if (!toast)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, props.template, toast.onClosed);
    }, [dispatch, toast]);
    const onItemSelectedCallback = useCallback((event) => {
        if (!toast)
            return;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        const { onItemSelected } = toast;
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }, [dispatch, toast]);
    useEffect(() => {
        if (enableTransportBottomOverride) {
            const bottomValue = transportBottomOverride + 85;
            setMobileTransportBottom(bottomValue);
        }
        else {
            setMobileTransportBottom(85);
        }
    }, [enableTransportBottomOverride]);
    useTimeout(toast, timerRef, closeCallback, toast === null || toast === void 0 ? void 0 : toast.timeoutMilliseconds);
    const onViewed = useCallback(() => {
        if (toast === null || toast === void 0 ? void 0 : toast.onViewed) {
            dispatchSkyfireMethods(dispatch, props.template, toast.onViewed);
        }
    }, [dispatch, toast === null || toast === void 0 ? void 0 : toast.onViewed]);
    const callbackRef = useInView(onViewed);
    if (!toast ||
        (hasOverlay &&
            overlayTemplates[0].interface !== props.template.interface &&
            !props.isNowPlaying)) {
        return null;
    }
    let transportHeight;
    if (!isDesktop(window)) {
        transportHeight = props.isNowPlaying ? 0 : mobileTransportBottom;
    }
    else {
        transportHeight = props.isNowPlaying ? 125 : 85;
    }
    const bottomPosition = mediaId ? transportHeight : 0;
    return (React.createElement("music-notification-toast", { className: ['hydrated', toast.navigationIcon ? Styles.linkNotification : null].join(' '), onClick: onItemSelectedCallback, onMouseEnter: () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }, onMouseLeave: () => {
            timerRef.current = setTimeout(() => {
                closeCallback();
            }, toast.timeoutMilliseconds);
        }, ref: callbackRef, style: {
            bottom: `${bottomPosition}px`,
        }, kind: "accent", statusIconName: toast.statusIcon, navigationIconName: toast.navigationIcon }, toast === null || toast === void 0 ? void 0 : toast.message));
}
