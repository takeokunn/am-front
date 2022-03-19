import { easeExpInOut } from 'd3-ease';
import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { useIsVisualPlayQueueDisabled, useIsTransportOverlayLoaded, } from '../utils/TransportOverlayHook';
import { HIDE_TRANSPORT_OVERLAY, TRANSPORT_OVERLAY_ACTIVE_QUEUES, TRANSPORT_OVERLAY_PLAY_QUEUE, } from '../actions';
import { VISUAL_TABLE_WIDGET } from '../types/templates/widgets/ISkyfireVisualTableWidget';
import { dispatchPlaybackMethods } from '../utils/dispatchPlaybackMethods';
import * as Styles from './TransportOverlay.scss';
import Widget from './widgets';
import VisualTableWidget from './widgets/VisualTableWidget';
const headerStyles = {
    contain: 'layout',
    paddingTop: '20px',
    display: 'block',
    marginBottom: '0px',
};
export default function TransportOverlay() {
    var _a, _b, _c;
    useStyles(Styles);
    const dispatch = useDispatch();
    const { playQueue } = useSelector((state) => state.Media, shallowEqual);
    const { activeQueuesData } = useSelector((state) => state.Media, shallowEqual);
    const { id, isTransportOverlayOpen, onDataRequired } = useSelector((state) => state.TransportOverlay, shallowEqual);
    const overlayTemplate = id === TRANSPORT_OVERLAY_ACTIVE_QUEUES ? activeQueuesData : playQueue;
    const { windowHeight } = useSelector((state) => state.BrowserState, shallowEqual);
    const { mediaId } = useSelector((state) => state.Media);
    const playQueueDisabled = useIsVisualPlayQueueDisabled();
    const hasLoaded = useIsTransportOverlayLoaded();
    const emptyFunction = () => true;
    const hasNoUpcomingWidgets = ((_c = (_b = (_a = overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.widgets) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.length) === 0;
    const trackCountClassName = !hasLoaded ? Styles.countLoading : '';
    const durationClassName = !hasLoaded ? Styles.durationLoading : '';
    const TransportOverlayAnimationValues = useSpring({
        opacity: isTransportOverlayOpen ? 1 : 0,
        height: isTransportOverlayOpen ? windowHeight - 80 : 0,
        config: { easing: easeExpInOut },
    });
    let timeoutHandle;
    // Check if Transport Overlay is open, disable root scroller to use Transport Overlay scroller.
    useEffect(() => {
        const windowScrollElement = document.documentElement;
        if (isTransportOverlayOpen) {
            timeoutHandle === null || timeoutHandle === void 0 ? void 0 : timeoutHandle.clear();
            windowScrollElement.style['overflow-y'] = 'hidden';
        }
        else {
            timeoutHandle = setTimeout(() => {
                windowScrollElement.style['overflow-y'] = 'scroll';
            }, 500);
        }
    }, [isTransportOverlayOpen]);
    // If there's no data, fetch some. We need to fetch data, even if
    // the Transport Overlay isn't open for the time being to show the
    // disabled state for the Transport Overlay Button until UX has a better
    // solution.
    useEffect(() => {
        if (!overlayTemplate) {
            dispatchPlaybackMethods(dispatch, mediaId, onDataRequired);
        }
    }, [mediaId, overlayTemplate]);
    // Handle Escape key shortcut.
    useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);
    // If there's no upcoming widgets, hide the Play Queue
    // We don't need to hide Active Queues as there will be an empty state screen
    useEffect(() => {
        if (id === TRANSPORT_OVERLAY_PLAY_QUEUE && hasNoUpcomingWidgets && hasLoaded) {
            dispatch({ type: HIDE_TRANSPORT_OVERLAY });
        }
    }, [dispatch, hasLoaded, hasNoUpcomingWidgets, id]);
    useEffect(() => {
        if (isTransportOverlayOpen && playQueueDisabled && id === TRANSPORT_OVERLAY_PLAY_QUEUE) {
            dispatch({ type: HIDE_TRANSPORT_OVERLAY });
        }
    }, [dispatch, id, isTransportOverlayOpen, playQueueDisabled]);
    const widgets = overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.widgets;
    return (React.createElement(animated.div, { style: TransportOverlayAnimationValues, className: Styles.transportOverlay, id: "transport-overlay" },
        React.createElement("music-detail-header", { style: headerStyles, headline: overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.title, className: hasLoaded ? '' : Styles.hidden }),
        React.createElement("header", { className: hasLoaded ? Styles.hidden : Styles.headerLoading }),
        React.createElement("b", { className: Styles.subtitle },
            (overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.subTitle) && (React.createElement("span", { className: Styles.subtitleText }, overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.subTitle)),
            (overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.trackCount) && (React.createElement("span", { className: trackCountClassName }, overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.trackCount)),
            isTransportOverlayOpen && (overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.totalDuration) ? React.createElement("span", null, "\u2022") : null,
            isTransportOverlayOpen && (React.createElement("span", { className: durationClassName }, convertToReadableTime(overlayTemplate === null || overlayTemplate === void 0 ? void 0 : overlayTemplate.totalDuration)))),
        React.createElement("div", { className: hasLoaded ? '' : Styles.hidden }, renderWidgets(widgets)),
        React.createElement("div", { className: hasLoaded ? Styles.hidden : '' },
            React.createElement(VisualTableWidget, { data: {
                    interface: VISUAL_TABLE_WIDGET,
                    items: Array(20).fill(1),
                    onEndOfWidget: [],
                    onTrackReorder: [],
                    onViewed: [],
                }, handleSelected: emptyFunction, loading: true }))));
    function handleEscape(e) {
        if (e.keyCode === 27) {
            dispatch({ type: HIDE_TRANSPORT_OVERLAY });
        }
    }
    function convertToReadableTime(durationString) {
        if (!durationString) {
            return undefined;
        }
        const minutes = Number(durationString.substr(0, durationString.indexOf(':')));
        if (minutes) {
            return `${String(Math.floor(minutes / 60))}hr ${String(minutes % 60)} min`;
        }
        return undefined;
    }
    function renderWidgets(widgetsToRender) {
        return widgetsToRender === null || widgetsToRender === void 0 ? void 0 : widgetsToRender.map((widget) => {
            if (widget.interface === VISUAL_TABLE_WIDGET) {
                return (React.createElement(VisualTableWidget, { data: widget, handleSelected: handleSelected, isVisualPlayQueue: true }));
            }
            return React.createElement(Widget, { data: widget, handleSelected: handleSelected });
        });
    }
    function handleSelected(onItemSelected) {
        if (!(onItemSelected === null || onItemSelected === void 0 ? void 0 : onItemSelected.length)) {
            return;
        }
        dispatchPlaybackMethods(dispatch, mediaId, onItemSelected);
        if (!(playQueue === null || playQueue === void 0 ? void 0 : playQueue.widgets)) {
            dispatchPlaybackMethods(dispatch, mediaId, onDataRequired);
        }
    }
}
