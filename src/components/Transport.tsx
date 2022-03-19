import withStyles from 'isomorphic-style-loader/withStyles';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { UAParser } from 'ua-parser-js';
import { debounce } from 'debounce';
import { JumpBackButton, JumpForwardButton } from 'dm-podcast-web-player';
import * as PlaybackActions from '../actions/Playback';
import { getInstance } from '../player';
import { PlaybackErrors } from '../types/playback/PlaybackErrorsEnum';
import { globals } from '../utils';
import { dispatchPlaybackMethods } from '../utils/dispatchPlaybackMethods';
import ContextMenuButton from './ContextMenuButton';
import ProgressBar from './ProgressBar';
import * as Styles from './Transport.scss';
import NextButton from './transport/NextButton';
import PlayButton from './transport/PlayButton';
import PreviousButton from './transport/PreviousButton';
import RepeatButton from './transport/RepeatButton';
import ShuffleButton from './transport/ShuffleButton';
import ThumbsUpButton from './transport/ThumbsUpButton';
import VolumeButton from './transport/VolumeButton';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
import Button from './widgets/items/Button';
import TransportOverlay from './TransportOverlay';
import TransportOverlayButton from './transport/TransportOverlayButton';
import { TRANSPORT_OVERLAY_PLAY_QUEUE, TRANSPORT_OVERLAY_ACTIVE_QUEUES, START_TRANSPORT_HOVERING, END_TRANSPORT_HOVERING, } from '../actions/TransportOverlay';
import { isDesktop } from '../utils/platform';
import VideoUITimeoutMS from '../utils/VideoUITimeoutMS';
import { getDeeplink } from '../utils/getDeeplink';
import { UPSELL_ON_PLAYBACK_ERROR_DEVICES } from '../utils/deviceTypes';
import { setSfnAudioQuality, setSfnSignalFlowAlert } from '../utils/hdHelpers';
const ua = new UAParser(navigator.userAgent);
const os = ua.getOS();
const browser = ua.getBrowser();
function convertToTimestamp(time) {
    const timestamp = new Date(time * 1000);
    // There's no hours, so only show MM:SS
    if (timestamp.getUTCHours() === 0) {
        // If no tens digit minutes, just display the singles digit, so M:SS.
        if (timestamp.getMinutes() >= 0 && timestamp.getMinutes() <= 9) {
            return timestamp.toISOString().substring(15, 19);
        }
        return timestamp.toISOString().substring(14, 19);
    }
    // There's hours, so show HH::MM:SS
    return timestamp.toISOString().substr(11, 8);
}
const Timestamps = ({ time, duration, displayAbove }) => (React.createElement("div", { className: [Styles.timestamps, displayAbove ? Styles.above : ''].join(' ') },
    React.createElement("span", null, convertToTimestamp(time)),
    duration ? React.createElement("span", null,
        " - ",
        convertToTimestamp(Math.max(duration - time, 0))) : null));
class Transport extends Component {
    constructor(props) {
        super(props);
        this.handleMouseOver = () => {
            const timestamp = Date.now();
            this.setState({ transportHoverTimestamp: timestamp }); // set the local timestamp
            this.props.dispatch({ type: START_TRANSPORT_HOVERING, payload: { timestamp } });
            this.debouncedEndHover();
        };
        this.handleMouseLeave = () => {
            this.props.dispatch({ type: END_TRANSPORT_HOVERING });
        };
        this.handleMouseEnter = (e) => {
            var _a, _b;
            if (!((_b = (_a = this.props.controls) === null || _a === void 0 ? void 0 : _a.visualPlayQueue) === null || _b === void 0 ? void 0 : _b.isDisabled) &&
                !this.props.media.playQueue &&
                !this.props.media.fetchingPlayQueue) {
                this.onSelected(e, this.props.media.onVisualPlayQueueDataRequired);
                this.props.dispatch({ type: PlaybackActions.AWAIT_PLAY_QUEUE });
            }
        };
        this.onSelected = (e, methods = []) => {
            var _a, _b, _c, _d, _e, _f;
            (_a = e === null || e === void 0 ? void 0 : e.preventDefault) === null || _a === void 0 ? void 0 : _a.call(e);
            (_c = (_b = e === null || e === void 0 ? void 0 : e.detail) === null || _b === void 0 ? void 0 : _b.preventDefault) === null || _c === void 0 ? void 0 : _c.call(_b);
            (_f = (_e = (_d = e === null || e === void 0 ? void 0 : e.detail) === null || _d === void 0 ? void 0 : _d.detail) === null || _e === void 0 ? void 0 : _e.preventDefault) === null || _f === void 0 ? void 0 : _f.call(_e);
            dispatchPlaybackMethods(this.props.dispatch, this.props.media.mediaId, methods);
        };
        this.handleSelected = (methods = []) => {
            this.onSelected(null, methods);
        };
        this.onPrimarySelected = (e) => {
            var _a;
            this.onSelected(e, (_a = this.props.media.miniTitleLink) === null || _a === void 0 ? void 0 : _a.onItemSelected);
        };
        this.onSecondaryArtistSelected = (e) => {
            var _a, _b;
            this.onSelected(e, (_b = (_a = this.props.media) === null || _a === void 0 ? void 0 : _a.miniSubTitleArtistLink) === null || _b === void 0 ? void 0 : _b.onItemSelected);
        };
        this.onSecondaryContainerSelected = (e) => {
            var _a, _b;
            this.onSelected(e, (_b = (_a = this.props.media) === null || _a === void 0 ? void 0 : _a.miniSubTitleContainerLink) === null || _b === void 0 ? void 0 : _b.onItemSelected);
        };
        this.onSecondarySelected = (e) => {
            var _a;
            this.onSelected(e, (_a = this.props.media.miniSubTitleLink) === null || _a === void 0 ? void 0 : _a.onItemSelected);
        };
        this.onArtworkSelected = (e) => {
            var _a;
            this.onSelected(e, (_a = this.props.media.miniArtworkLink) === null || _a === void 0 ? void 0 : _a.onItemSelected);
        };
        this.onQualityBadgeSelected = (e) => {
            var _a;
            this.onSelected(e, (_a = this.props.media) === null || _a === void 0 ? void 0 : _a.onStatsForNerdsRequired);
        };
        this.onBadgeClicked = (e) => {
            switch (e.detail) {
                case 'LYRICS':
                    this.onArtworkSelected(e);
                    break;
                case 'SD':
                case 'HD':
                    this.onQualityBadgeSelected(e);
                    break;
                default:
                    break;
            }
        };
        this.onTimeupdate = (time) => {
            const { currentTime, scrubbing } = this.state;
            const bufferTime = this.player.getBufferedTime();
            if (!scrubbing) {
                // Only update current time when playback stream has moved a whole second forward
                const roundedTime = Math.floor(time);
                if (roundedTime === currentTime) {
                    return;
                }
                this.setState({
                    bufferTime,
                    currentTime: roundedTime,
                    seekingTime: undefined,
                });
            }
        };
        this.onSeekUpdate = (time) => {
            const roundedTime = Math.round(time);
            this.setState({
                seekingTime: roundedTime,
                currentTime: roundedTime,
            });
        };
        this.onScrubberDragStart = () => {
            this.setState({
                scrubbing: true,
            });
        };
        this.onScrubberDragEnd = () => {
            this.setState({
                scrubbing: false,
            });
        };
        this.onBuffertime = (time) => {
            this.setState({ bufferTime: Math.round(time) });
        };
        this.onReady = (mediaId) => {
            this.props.dispatch({ type: PlaybackActions.READY, payload: { mediaId } });
        };
        this.onStarted = () => {
            var _a;
            this.setState({
                bufferTime: 0,
                currentTime: (_a = this.player.getCurrentTime()) !== null && _a !== void 0 ? _a : 0,
                playbackStarted: true,
            });
            this.props.dispatch({ type: PlaybackActions.STARTED });
        };
        this.onEnded = () => {
            this.setState({
                bufferTime: 0,
                currentTime: 0,
                playbackStarted: false,
            });
            this.props.dispatch({ type: PlaybackActions.ENDED });
        };
        this.onPlayPause = (isPlaying) => {
            var _a, _b;
            const playPauseState = ((_b = (_a = this.props.controls) === null || _a === void 0 ? void 0 : _a.play) === null || _b === void 0 ? void 0 : _b.state) === 'PLAYING';
            if (isPlaying !== playPauseState) {
                if (isPlaying) {
                    this.props.dispatch({
                        type: PlaybackActions.RESUMED,
                        payload: this.props.playbackEvents.onResumed,
                    });
                }
                else {
                    this.props.dispatch({
                        type: PlaybackActions.PAUSED,
                        payload: this.props.playbackEvents.onPaused,
                    });
                }
            }
        };
        this.onError = (error) => {
            if (error === PlaybackErrors.PLAY_NOT_AUTHORIZED) {
                this.props.dispatch({ type: PlaybackActions.PAUSED });
                if (browser.name === 'Safari' ||
                    os.name === 'iOS' ||
                    UPSELL_ON_PLAYBACK_ERROR_DEVICES.includes(globals.amznMusic.appConfig.deviceType)) {
                    // dispatch error for Safari-specific error dialog and Android mshop
                    this.props.dispatch({ type: PlaybackActions.ERROR, payload: { error } });
                }
            }
            else {
                this.props.dispatch({ type: PlaybackActions.ERROR, payload: { error } });
            }
        };
        this.onStalled = (isStalled) => {
            if (!isStalled) {
                // Rebuffer ended
                this.props.dispatch({ type: PlaybackActions.REBUFFERED });
            }
            else {
                this.props.dispatch({ type: PlaybackActions.BUFFERING });
            }
        };
        /* Will set the badge according to playback quality once event is ready in Maestro */
        this.onPlaybackQualityChange = (e) => {
            var _a;
            this.props.dispatch({
                type: PlaybackActions.SET_STREAMING_BADGE,
                payload: { streamingBadge: e.newQuality.isHD ? 'HD' : 'SD' },
            });
            this.props.dispatch({
                type: PlaybackActions.SET_STREAMING_INFO,
                payload: { bitDepth: e.newQuality.bitDepth, sampleRate: e.newQuality.sampleRate },
            });
            this.props.dispatch(setSfnAudioQuality(e.newQuality));
            this.props.dispatch(setSfnSignalFlowAlert(e.reason, (_a = this.player.getConfig()) === null || _a === void 0 ? void 0 : _a.streamingQuality));
        };
        this.state = {
            currentTime: 0,
            bufferTime: 0,
            seekingTime: undefined,
            playerInitialized: false,
            playbackStarted: false,
            duration: 0,
            scrubbing: false,
            transportHoverTimestamp: 0,
        };
        this.debouncedEndHover = debounce(() => {
            this.props.dispatch({ type: END_TRANSPORT_HOVERING });
        }, VideoUITimeoutMS.Hover4s);
    }
    async componentDidMount() {
        const { media } = this.props;
        const { mediaId, onMiniTransportViewed } = media;
        this.setState({ mediaId });
        dispatchPlaybackMethods(this.props.dispatch, mediaId, onMiniTransportViewed);
    }
    async componentDidUpdate() {
        var _a, _b;
        const { media, overlayTemplates, lastHoverTimestamp } = this.props;
        const { mediaId, onMiniTransportViewed, onTrackRatingDataRequired } = media;
        const hasOverlay = overlayTemplates.length > 0;
        if (media && mediaId) {
            if (!this.state.playerInitialized) {
                this.player = await getInstance();
                this.player.addEventListener('timeupdate', this.onTimeupdate);
                this.player.addEventListener('buffertime', this.onBuffertime);
                this.player.addEventListener('canplay', this.onReady);
                this.player.addEventListener('started', this.onStarted);
                this.player.addEventListener('ended', this.onEnded);
                this.player.addEventListener('error', this.onError);
                this.player.addEventListener('stalled', this.onStalled);
                this.player.addEventListener('playpause', this.onPlayPause);
                this.player.addEventListener('playbackqualitychange', this.onPlaybackQualityChange);
                this.setState({
                    playerInitialized: true,
                    currentTime: (_a = this.player.getCurrentTime()) !== null && _a !== void 0 ? _a : 0,
                });
            }
            const isLiveStream = (media === null || media === void 0 ? void 0 : media.durationSeconds) === -1;
            const duration = !isLiveStream
                ? ((_b = this.player) === null || _b === void 0 ? void 0 : _b.getDuration()) || media.durationSeconds
                : undefined;
            if (duration !== this.state.duration && duration && duration > 0) {
                this.setState({ duration });
            }
        }
        if (mediaId !== this.state.mediaId) {
            if (!hasOverlay) {
                dispatchPlaybackMethods(this.props.dispatch, mediaId, onMiniTransportViewed);
            }
            dispatchPlaybackMethods(this.props.dispatch, mediaId, onTrackRatingDataRequired);
            this.setState({ mediaId });
        }
        if (this.state.transportHoverTimestamp &&
            lastHoverTimestamp !== this.state.transportHoverTimestamp) {
            this.debouncedEndHover.clear();
            this.setState({ transportHoverTimestamp: undefined });
        }
    }
    async componentWillUnmount() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.removeEventListener('timeupdate', this.debouncedTimeUpdate);
        (_b = this.player) === null || _b === void 0 ? void 0 : _b.removeEventListener('buffertime', this.onBuffertime);
        (_c = this.player) === null || _c === void 0 ? void 0 : _c.removeEventListener('canplay', this.onReady);
        (_d = this.player) === null || _d === void 0 ? void 0 : _d.removeEventListener('started', this.onStarted);
        (_e = this.player) === null || _e === void 0 ? void 0 : _e.removeEventListener('ended', this.onEnded);
        (_f = this.player) === null || _f === void 0 ? void 0 : _f.removeEventListener('error', this.onError);
        (_g = this.player) === null || _g === void 0 ? void 0 : _g.removeEventListener('stalled', this.onStalled);
        (_h = this.player) === null || _h === void 0 ? void 0 : _h.removeEventListener('playpause', this.onPlayPause);
        (_j = this.player) === null || _j === void 0 ? void 0 : _j.removeEventListener('playbackqualitychange', this.onPlaybackQualityChange);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const { media, isAudioNowPlaying, isVideoNowPlaying, isMusicExperienceNowPlaying, isTransportOverlayOpen, isTransportHovering, isDialogShowing, controls, windowWidth, windowHeight, videoNPV, transportBottomOverride, enableTransportBottomOverride, } = this.props;
        const isSmallSizeScreen = windowWidth >= WINDOW_SIZE_ENUM.SM && windowWidth < WINDOW_SIZE_ENUM.MD;
        const isNowPlaying = isAudioNowPlaying || isVideoNowPlaying || isMusicExperienceNowPlaying;
        const isNowPlayingOnly = isNowPlaying && !isTransportOverlayOpen;
        const isSmallTransport = !isNowPlayingOnly &&
            (windowWidth < WINDOW_SIZE_ENUM.LG || windowHeight < WINDOW_SIZE_ENUM.MD);
        const playButtonSize = isSmallTransport ? 'small' : isSmallSizeScreen ? 'large' : 'medium';
        const buttonSize = windowWidth < WINDOW_SIZE_ENUM.SM ? 'small' : 'medium';
        const hasOverlay = (this.props.overlayTemplates.length > 0 && !isNowPlaying) || isDialogShowing;
        const emptyClass = media.mediaId ? null : Styles.empty;
        const nowPlayingClass = isNowPlaying ? Styles.nowPlayingView : null;
        const transportOverlayOpen = isTransportOverlayOpen ? Styles.transportOverlayOpen : '';
        const overlayClass = hasOverlay ? Styles.overlay : null;
        const safariClass = browser.name === 'Safari' ? Styles.safari : null;
        const splitSubtitle = ((_a = media.subTitle) === null || _a === void 0 ? void 0 : _a.indexOf('-')) !== -1 ? (_b = media.subTitle) === null || _b === void 0 ? void 0 : _b.split('-')[1].trim() : '';
        const containerClassName = [
            media.mediaId && Styles.background,
            safariClass,
            emptyClass,
            nowPlayingClass,
            transportOverlayOpen,
            overlayClass,
            isMusicExperienceNowPlaying ? Styles.musicExperiencePlaying : '',
            isVideoNowPlaying &&
                !videoNPV.showControls &&
                ((_c = controls.content) === null || _c === void 0 ? void 0 : _c.state) === 'READY' &&
                !isTransportHovering &&
                !isTransportOverlayOpen
                ? Styles.hidden
                : '',
        ].join(' ');
        const isVideoPlaying = ((_d = controls.audioVideo) === null || _d === void 0 ? void 0 : _d.state) === 'VIDEO';
        const isVisualLikesEnabled = ((_f = (_e = media.button) === null || _e === void 0 ? void 0 : _e.observer) === null || _f === void 0 ? void 0 : _f.storageGroup) === 'RATINGS';
        const bottomTags = [];
        if (media.hasLyrics)
            bottomTags.push('LYRICS');
        if (media.hasStreamingBadge && media.streamingBadge)
            bottomTags.push(media.streamingBadge);
        const buttons = (_g = media === null || media === void 0 ? void 0 : media.musicExperienceActionButtons) === null || _g === void 0 ? void 0 : _g.map((button, idx) => !button.disabled && (React.createElement("div", { className: Styles.musicExperienceButtonContainer },
            button.icon === 'caretUp' ? (React.createElement(NextButton, { size: buttonSize, variant: "glass", icon: button.icon, id: `musicExperienceTransportButton${idx + 1}` })) : (React.createElement("music-button", { key: button.icon, "icon-name": button.icon, "icon-only": true, variant: "glass", size: buttonSize, onClick: this.handleSelected.bind(this, button.onItemSelected), id: `musicExperienceTransportButton${idx + 1}` })),
            React.createElement("div", { className: Styles.musicExperienceButtonText }, button.label))));
        const transportContainerStyle = enableTransportBottomOverride && !isNowPlaying
            ? { bottom: transportBottomOverride }
            : {};
        const transportClassname = [
            Styles.transport,
            isMusicExperienceNowPlaying ? Styles.musicExperiencePlaying : null,
            enableTransportBottomOverride ? Styles.iosMshopTransportOverride : '',
        ].join(' ');
        return (React.createElement("div", { className: containerClassName, onMouseOver: this.handleMouseOver, onMouseLeave: this.handleMouseLeave, style: transportContainerStyle },
            React.createElement("div", { className: [
                    Styles.baseline,
                    isMusicExperienceNowPlaying ? Styles.musicExperiencePlaying : null,
                ].join(' ') }),
            React.createElement("div", { className: transportClassname, id: "transport" },
                isMusicExperienceNowPlaying ? (React.createElement("div", { className: Styles.musicExperienceButtons }, buttons)) : (React.createElement(Fragment, null,
                    React.createElement("div", { className: [Styles.trackButtons, 'box'].join(' ') },
                        React.createElement("music-horizontal-item", { "icon-name": isTransportOverlayOpen ? 'goback' : 'maximize', "image-dimen": isVideoPlaying ? '16:9' : '1:1', "button-variant": "primary", class: [isTransportHovering ? 'hovered' : '', 'hydrated'].join(' '), "show-action-button": "true", "enable-badge-click": "true", "image-src": media.artwork, "primary-text": media.title, "secondary-text": media.artistName, "primary-href": getDeeplink((_h = media.miniTitleLink) === null || _h === void 0 ? void 0 : _h.deeplink), "secondary-href": getDeeplink((_j = media.miniSubTitleArtistLink) === null || _j === void 0 ? void 0 : _j.deeplink), "bottom-tags": bottomTags, onmusicPrimaryTextActivate: this.onPrimarySelected, onmusicSecondaryTextActivate: this.onSecondaryArtistSelected, onmusicActionButtonActivate: this.onArtworkSelected, "secondary-text-2": media.subTitleContainerType
                                ? media.subTitleContainerType
                                : splitSubtitle, "secondary-href-2": media.subTitleContainerType
                                ? getDeeplink((_k = media.miniSubTitleContainerLink) === null || _k === void 0 ? void 0 : _k.deeplink)
                                : null, onmusicSecondaryText2Activate: media.subTitleContainerType
                                ? this.onSecondaryContainerSelected
                                : null, onmusicBadgeActivate: this.onBadgeClicked }),
                        React.createElement("div", { className: [Styles.secondaryButtons, 'box'].join(' ') },
                            React.createElement("div", { className: Styles.addContainer }, (media === null || media === void 0 ? void 0 : media.button) &&
                                (isVisualLikesEnabled ? (
                                // eslint-disable-next-line react/jsx-indent
                                React.createElement(ThumbsUpButton, { data: media.button, size: buttonSize, handleSelected: this.handleSelected })) : (
                                // eslint-disable-next-line react/jsx-indent
                                React.createElement(Button, { data: media.button, handleSelected: this.handleSelected, slot: "buttons", size: buttonSize })))),
                            (media === null || media === void 0 ? void 0 : media.contextMenu) &&
                                Object.keys(media.contextMenu).length !== 0 && (React.createElement("div", { className: Styles.contextMenuContainer },
                                React.createElement(ContextMenuButton, { options: media.contextMenu.options, disabled: media.contextMenu.disabled, variant: "primary", iconName: "more", size: buttonSize }))))),
                    React.createElement("div", { className: [Styles.mainControls, 'box'].join(' ') },
                        controls.repeat && React.createElement(RepeatButton, { size: buttonSize }),
                        controls.previous && React.createElement(PreviousButton, { size: buttonSize }),
                        controls.rewind && React.createElement(JumpBackButton, { size: buttonSize }),
                        controls.play && (React.createElement(PlayButton, { size: playButtonSize, variant: isSmallTransport ? 'primary' : 'glass' })),
                        controls.fastForward && React.createElement(JumpForwardButton, { size: buttonSize }),
                        controls.next && React.createElement(NextButton, { size: buttonSize }),
                        controls.shuffle && React.createElement(ShuffleButton, { size: buttonSize })),
                    React.createElement("div", { onMouseEnter: this.handleMouseEnter, className: [Styles.secondaryControls, 'box'].join(' ') },
                        isDesktop(window) && (React.createElement("div", { className: Styles.volumeContainer },
                            React.createElement(VolumeButton, { isTransportOverlayOpen: isTransportOverlayOpen, size: buttonSize }))),
                        !!(controls === null || controls === void 0 ? void 0 : controls.visualPlayQueue) && (React.createElement("div", { className: Styles.playQueueContainer },
                            React.createElement(TransportOverlayButton, { id: TRANSPORT_OVERLAY_PLAY_QUEUE, action: PlaybackActions.TRIGGER_PLAY_QUEUE, disabled: (_l = controls === null || controls === void 0 ? void 0 : controls.visualPlayQueue) === null || _l === void 0 ? void 0 : _l.isDisabled, icon: "playqueue", size: buttonSize }))),
                        !!(controls === null || controls === void 0 ? void 0 : controls.activeQueues) && (React.createElement("div", { className: Styles.activeQueueContainer },
                            React.createElement(TransportOverlayButton, { id: TRANSPORT_OVERLAY_ACTIVE_QUEUES, action: PlaybackActions.TRIGGER_ACTIVE_QUEUES, icon: "speaker", size: buttonSize })))))),
                React.createElement("div", { className: Styles.progressBar },
                    !hasOverlay && this.state.duration ? (React.createElement(ProgressBar, { time: this.state.currentTime, bufferTime: this.state.bufferTime, duration: this.state.duration, mediaId: media.mediaId, displayScrubber: !((_m = controls === null || controls === void 0 ? void 0 : controls.scrub) === null || _m === void 0 ? void 0 : _m.isDisabled) &&
                            !!isTransportHovering &&
                            !isTransportOverlayOpen, scrubbing: this.state.scrubbing, onSeekUpdate: this.onSeekUpdate, onScrubberDragStart: this.onScrubberDragStart, onScrubberDragEnd: this.onScrubberDragEnd })) : null,
                    React.createElement(Timestamps, { time: this.state.seekingTime !== undefined
                            ? this.state.seekingTime
                            : this.state.currentTime, duration: this.state.duration, displayAbove: !isNowPlaying }))),
            !globals.amznMusic.ssr && React.createElement(TransportOverlay, null)));
    }
}
function mapStateToProps(state) {
    return {
        media: state.Media,
        actions: state.PlaybackActions,
        controls: state.PlaybackStates,
        playbackEvents: state.PlaybackEvents,
        overlayTemplates: state.TemplateStack.overlayTemplates,
        windowWidth: state.BrowserState.windowWidth,
        windowHeight: state.BrowserState.windowHeight,
        videoNPV: state.VideoNPVState,
        isTransportOverlayOpen: state.TransportOverlay.isTransportOverlayOpen,
        isTransportHovering: state.TransportOverlay.isTransportHovering,
        lastHoverTimestamp: state.TransportOverlay.lastHoverTimestamp,
        transportBottomOverride: state.MShop.transportBottomOverride,
        enableTransportBottomOverride: state.MShop.enableTransportBottomOverride,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default withStyles(Styles)(connect(mapStateToProps, mapDispatchToProps)(Transport));
