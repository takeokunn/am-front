import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'debounce';
import NowPlayingHeader from '../components/NowPlayingHeader';
import { dispatchSkyfireMethods } from '../utils';
import * as dialogStyles from './Dialog.scss';
import * as Styles from './VideoNowPlaying.scss';
import { getInstance } from '../player';
import VideoUITimeoutMS from '../utils/VideoUITimeoutMS';
import { END_TRANSPORT_HOVERING, HIDE_VIDEO_CONTROL, SHOW_VIDEO_CONTROL, START_TRANSPORT_HOVERING, } from '../actions';
export default function VideoNowPlaying(props) {
    useStyles(dialogStyles, Styles);
    const dispatch = useDispatch();
    const { template } = props;
    const [transportHoverTimestamp, setTransportHoverTimestamp] = useState();
    const { onMediaViewed } = useSelector((state) => state.Media);
    const { content } = useSelector((state) => state.PlaybackStates);
    const { showControls } = useSelector((state) => state.VideoNPVState);
    const { isTransportHovering, lastHoverTimestamp } = useSelector((state) => state.TransportOverlay);
    useEffect(() => {
        if (template) {
            handleSelected(undefined, onMediaViewed);
        }
    }, [template]);
    useEffect(() => {
        if (template) {
            handleSelected(undefined, template.onViewed);
        }
    }, [template]);
    useEffect(() => {
        if (transportHoverTimestamp && transportHoverTimestamp !== lastHoverTimestamp) {
            debouncedEndHover.clear();
            setTransportHoverTimestamp(undefined);
        }
    }, [lastHoverTimestamp]);
    const onClose = useCallback((e) => {
        if (template) {
            handleSelected(e, template.closeButton.onItemSelected);
        }
        dispatch({ type: SHOW_VIDEO_CONTROL }); // to reset state of transport on close
    }, [template]);
    const onMouseMove = useCallback((event) => {
        const moveEvent = event.nativeEvent;
        if (moveEvent.movementX === 0 && moveEvent.movementY === 0) {
            return;
        }
        dispatch({ type: SHOW_VIDEO_CONTROL });
        debouncedHideControl();
    }, []);
    const onClick = useCallback((event) => {
        dispatch({ type: SHOW_VIDEO_CONTROL });
        debouncedHideControlOnClick();
    }, []);
    const onMouseOver = useCallback(() => {
        const timestamp = Date.now();
        setTransportHoverTimestamp(timestamp); // set the local timestamp
        dispatch({ type: START_TRANSPORT_HOVERING, payload: { timestamp } });
        debouncedEndHover();
    }, []);
    const onMouseLeave = useCallback(() => {
        dispatch({ type: END_TRANSPORT_HOVERING });
    }, []);
    const handleSelected = (event, methods = []) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        if (template) {
            dispatchSkyfireMethods(dispatch, template, methods);
        }
    };
    const debouncedHideControl = useCallback(debounce(() => {
        dispatch({ type: HIDE_VIDEO_CONTROL });
    }, VideoUITimeoutMS.Standard), []);
    const debouncedHideControlOnClick = useCallback(debounce(() => {
        dispatch({ type: HIDE_VIDEO_CONTROL });
    }, VideoUITimeoutMS.ClickToToggle), []);
    const debouncedEndHover = useCallback(debounce(() => {
        dispatch({ type: END_TRANSPORT_HOVERING });
    }, VideoUITimeoutMS.Hover4s), []);
    // Load Player and attach close listener
    useEffect(() => {
        let videoPlayer;
        async function attachCloseListener() {
            try {
                const player = await getInstance();
                videoPlayer = player.getVideoPlayer();
                videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.addEventListener('close', onClose);
            }
            catch (_a) {
                // Do nothing
            }
        }
        function detachCloseListener() {
            videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.removeEventListener('close', onClose);
        }
        attachCloseListener();
        return () => detachCloseListener();
    }, [template]);
    return (React.createElement("div", { id: "vnpv", className: [dialogStyles.modal, Styles.vnpv, template ? '' : Styles.hidden].join(' '), onMouseMove: onMouseMove, onClick: onClick },
        React.createElement("div", { className: [
                Styles.videoPlaybackControls,
                !showControls && (content === null || content === void 0 ? void 0 : content.state) === 'READY' && !isTransportHovering
                    ? Styles.hidden
                    : '',
            ].join(' '), onMouseOver: onMouseOver, onMouseLeave: onMouseLeave },
            isTransportHovering ? React.createElement("div", { className: Styles.videoContainerOverlay }) : undefined,
            template && React.createElement(NowPlayingHeader, { template: template })),
        React.createElement("div", { id: "videoPlaybackContainer", className: Styles.videoPlaybackContainer })));
}
