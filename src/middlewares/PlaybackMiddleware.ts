import { VIDEO_NOW_PLAYING_TEMPLATE } from '../types/templates/videoNowPlaying';
import { TEMPLATE_RENDERED, HIDE_TRANSPORT_OVERLAY, TOGGLE_TRANSPORT_OVERLAY, SHOW_TRANSPORT_OVERLAY, TRANSPORT_OVERLAY_ACTIVE_QUEUES, TRANSPORT_OVERLAY_PLAY_QUEUE, CLEAR_TERMINATION_TIMESTAMP, SET_TERMINATION_TIMESTAMP, SET_AUDIO_QUALITY, UPDATE_ABR_SETTING, initTrackPerformanceData, updatePlaybackSessionPerformanceData, updateTrackPerformanceData, } from '../actions';
import { BUFFER, READY, CLEAR, CLEAR_VIDEO, ENDED, STOPPED, PAUSED, PLAY, PLAY_VIDEO, PLAY_NEXT, PLAY_PREVIOUS, PLAYBACK_NOT_SUPPORTED, PLAYBACK_TOGGLE, RESUMED, SCRUBBED, SET_VOLUME, TRIGGER_PLAY_QUEUE, CHANGE_VOLUME, TRIGGER_ACTIVE_QUEUES, } from '../actions/Playback';
import { getInstance, getInstanceSync, isEMESupported, isEMESupportCheckComplete, isVideoPlaybackSupported, setPlayerConfig, } from '../player';
import { globals } from '../utils';
import { reportClientMetric, PlaybackPerformanceMetricType } from '../utils/reportClientMetrics';
import { dispatchPlaybackMethods } from '../utils/dispatchPlaybackMethods';
import { reportFlexEvent } from '../utils/reportFlexEvent';
let player;
export const PlaybackMiddleware = (store) => (nextAction) => async (action) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (URLSearchParams && new URLSearchParams(location.search).get('debug') === 'true') {
        // eslint-disable-next-line no-console
        console.log(action.type, action.payload, new Date().toTimeString());
    }
    const auth = store.getState().Authentication;
    const setting = store.getState().Setting;
    const { onPlaybackNotSupported } = store.getState().Media;
    const { activeQueues, audioVideo } = store.getState().PlaybackStates;
    const TransportOverlayState = store.getState().TransportOverlay;
    const isVideoNPVShowing = !!((_a = store
        .getState()
        .TemplateStack) === null || _a === void 0 ? void 0 : _a.overlayTemplates.find((template) => template.interface === VIDEO_NOW_PLAYING_TEMPLATE));
    const isVideoRequested = (audioVideo === null || audioVideo === void 0 ? void 0 : audioVideo.state) === 'VIDEO';
    player === null || player === void 0 ? void 0 : player.setMediaType((audioVideo === null || audioVideo === void 0 ? void 0 : audioVideo.state) || 'AUDIO');
    let actionType;
    switch (action.type) {
        case TEMPLATE_RENDERED:
            player = await getInstance();
            // load video player after template is rendered
            player.initiateVideoPlayerLoading();
            setPlayerConfig(player, auth, setting);
            break;
        case BUFFER:
            try {
                if (isVideoRequested && !globals.amznMusic.appConfig.isStarlightEnabled) {
                    // simply return if starlight is not enabled and tried to play video
                    return;
                }
                const playbackRequestedTime = window.performance.now();
                const isAudioPlayerColdstart = !isVideoRequested && !getInstanceSync();
                const uri = isVideoRequested ? action.payload.videoUri : action.payload.audioUri;
                if (isVideoRequested) {
                    await isVideoPlaybackSupported();
                }
                else {
                    const isEMECheckColdStart = !isEMESupportCheckComplete();
                    if (isEMECheckColdStart) {
                        const t0 = window.performance.now();
                        await isEMESupported();
                        const emeCheckLatency = window.performance.now() - t0;
                        store.dispatch(updatePlaybackSessionPerformanceData({ emeCheckLatency }));
                    }
                    else {
                        await isEMESupported();
                    }
                    store.dispatch(initTrackPerformanceData(uri, playbackRequestedTime, isAudioPlayerColdstart, isEMECheckColdStart));
                }
                player = await getInstance();
                setPlayerConfig(player, auth, setting);
                if (isVideoRequested) {
                    player.load(uri);
                }
                else {
                    const { PlaybackPerformance } = store.getState();
                    if (!PlaybackPerformance.sessionPerformance.audioPlayerLoadLatency) {
                        const audioPlayerLoadLatency = player.getAudioPlayerLoadLatency();
                        store.dispatch(updatePlaybackSessionPerformanceData({
                            audioPlayerLoadLatency,
                        }));
                    }
                    const trackLoadT0 = window.performance.now();
                    player.load(uri).then(async () => {
                        try {
                            const trackLoadLatency = window.performance.now() - trackLoadT0;
                            const Orchestra = await import(
                            /* webpackChunkName: "orchestra" */ '@amzn/Orchestrajs');
                            const isHLSClient = Orchestra.Player.isHLSClient();
                            store.dispatch(updateTrackPerformanceData(action.payload.mediaId, {
                                trackLoadLatency,
                                isHLSClient,
                            }));
                        }
                        catch (e) {
                            // ignore
                        }
                    });
                }
            }
            catch (e) {
                if (!isVideoRequested) {
                    dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, onPlaybackNotSupported);
                }
                const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
                const ua = new UAParser(globals.navigator.userAgent);
                reportFlexEvent(isVideoRequested ? 'WebPlayerVideoLoadFailure' : 'WebPlayerMaestroNotSupported', [['', ua.getOS().name, ua.getBrowser().name, ua.getBrowser().major], []], store.getState().Authentication);
            }
            break;
        case READY: {
            const playbackReadyTime = window.performance.now();
            const { PlaybackPerformance, Setting } = store.getState();
            const { mediaId } = action.payload;
            const trackPerformance = PlaybackPerformance.trackPerformanceMap[mediaId];
            if (!trackPerformance)
                break;
            let initialMediaFragmentLatency;
            const fragmentLatencies = (_e = (_d = (_c = (_b = getInstanceSync()) === null || _b === void 0 ? void 0 : _b.getAudioPlayer()) === null || _c === void 0 ? void 0 : _c.getNetworkMetrics()) === null || _d === void 0 ? void 0 : _d.currentTrack) === null || _e === void 0 ? void 0 : _e.latencies;
            if (fragmentLatencies && fragmentLatencies[0] && fragmentLatencies[0].success) {
                initialMediaFragmentLatency = fragmentLatencies[0].latency;
            }
            const clientPlaybackInitLatency = playbackReadyTime - trackPerformance.playbackRequestedTime;
            store.dispatch(updateTrackPerformanceData(mediaId, {
                playbackReadyTime,
                clientPlaybackInitLatency,
                initialMediaFragmentLatency,
                initialMediaFragmentAudioQuality: Setting.audioQuality,
            }));
            reportPlaybackPerformance(mediaId);
            break;
        }
        case PLAYBACK_TOGGLE: {
            const { play } = store.getState().PlaybackStates;
            if (!play) {
                break;
            }
            if (play.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, play.onDisabledPlayControlSelected);
            }
            else {
                if (player === null || player === void 0 ? void 0 : player.isPlaying()) {
                    store.dispatch({ type: PAUSED, payload: action.payload });
                }
                else {
                    store.dispatch({ type: RESUMED, payload: action.payload });
                }
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, play.onEnabledPlayControlSelected);
            }
            break;
        }
        case PLAY:
        case PLAY_VIDEO:
            try {
                if (isVideoRequested && !globals.amznMusic.appConfig.isStarlightEnabled) {
                    // simply return if starlight is not enabled and tried to play video
                    return;
                }
                if (isVideoRequested) {
                    await isVideoPlaybackSupported();
                }
                else {
                    await isEMESupported();
                }
                player = await getInstance();
                player.play(action.payload.mediaId);
                clearTerminationTimestamp();
                if (isVideoRequested) {
                    if (isVideoNPVShowing && TransportOverlayState.isTransportOverlayOpen) {
                        store.dispatch({ type: HIDE_TRANSPORT_OVERLAY });
                    }
                }
            }
            catch (_h) {
                store.dispatch({ type: PLAYBACK_NOT_SUPPORTED });
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, onPlaybackNotSupported);
            }
            break;
        case CLEAR:
        case CLEAR_VIDEO:
            player === null || player === void 0 ? void 0 : player.unload();
            setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
            break;
        case ENDED:
        case STOPPED:
            setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
            break;
        case PAUSED:
            player === null || player === void 0 ? void 0 : player.pause();
            setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
            break;
        case RESUMED:
            // For uploaded or ad content, the mediaId has the format "https://stuff.cloudfront.net/morestuff/song.mp3".
            // Maestro records this as the id: stuff.cloudfront.net/morestuff/song.mp3.
            // By using includes, we can check if the song Maestro is aware of is the same
            // as the incoming uploaded / ad content. Includes() by default works for the
            // equals case, so "ASIN1".includes("ASIN1") will return true.
            // Case 2: In cases like the playback indicator,
            // we don't send a mediaId when we click play. So,
            // we need to explicitly check for the abscence of
            // the property to confirm this is that case.
            if (!('mediaId' in (action === null || action === void 0 ? void 0 : action.payload)) ||
                ((_g = (_f = action === null || action === void 0 ? void 0 : action.payload) === null || _f === void 0 ? void 0 : _f.mediaId) === null || _g === void 0 ? void 0 : _g.includes(player === null || player === void 0 ? void 0 : player.getCurrentTrackId()))) {
                player === null || player === void 0 ? void 0 : player.resume();
            }
            else if (player) {
                store.dispatch({ type: PLAY, payload: action.payload });
                // Prevent extra videoResumed metric when video is started after soft refresh
                if (isVideoRequested) {
                    return;
                }
            }
            break;
        case SCRUBBED: {
            const { scrub } = store.getState().PlaybackStates;
            if (!scrub) {
                break;
            }
            if (scrub.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, scrub.onDisabledScrubControlSelected);
            }
            else {
                setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
                player === null || player === void 0 ? void 0 : player.seekTo(action.payload.position);
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, scrub === null || scrub === void 0 ? void 0 : scrub.onEnabledScrubControlSelected);
            }
            break;
        }
        case PLAY_NEXT: {
            const { next } = store.getState().PlaybackStates;
            if (!next) {
                break;
            }
            if (next.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, next.onDisabledNextControlSelected);
            }
            else {
                setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
                player === null || player === void 0 ? void 0 : player.pause();
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, next.onEnabledNextControlSelected);
            }
            break;
        }
        case PLAY_PREVIOUS: {
            const { previous } = store.getState().PlaybackStates;
            if (!previous) {
                break;
            }
            if (previous.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, previous.onDisabledPreviousControlSelected);
            }
            else {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, previous.onEnabledPreviousControlSelected);
                if (player && player.getCurrentTime() < 4) {
                    player.pause();
                    setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
                }
                else {
                    // For video, emit Playback metrics
                    if (isVideoRequested) {
                        dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, store.getState().PlaybackEvents.onStopped);
                    }
                    player === null || player === void 0 ? void 0 : player.reload();
                    setTerminationTimestamp(player === null || player === void 0 ? void 0 : player.getCurrentTime());
                    return;
                }
            }
            break;
        }
        case SET_VOLUME:
            player = await getInstance();
            player.volume(action.payload.volume);
            break;
        case CHANGE_VOLUME: {
            const { volume } = store.getState().PlaybackStates;
            if (volume && !volume.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, volume.onEnabledVolumeControlSelected);
            }
            break;
        }
        case TRIGGER_PLAY_QUEUE: {
            const { visualPlayQueue } = store.getState().PlaybackStates;
            const { onVisualPlayQueueDataRequired } = store.getState().Media;
            if (!visualPlayQueue) {
                break;
            }
            if (visualPlayQueue === null || visualPlayQueue === void 0 ? void 0 : visualPlayQueue.isDisabled) {
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, visualPlayQueue.onDisabledVisualPlayQueueControlSelected);
                store.dispatch({ type: HIDE_TRANSPORT_OVERLAY });
            }
            else {
                actionType = TOGGLE_TRANSPORT_OVERLAY;
                if (TransportOverlayState.isTransportOverlayOpen &&
                    TransportOverlayState.id !== TRANSPORT_OVERLAY_PLAY_QUEUE) {
                    actionType = SHOW_TRANSPORT_OVERLAY;
                }
                dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, visualPlayQueue.onEnabledVisualPlayQueueControlSelected);
                store.dispatch({
                    type: actionType,
                    payload: {
                        id: action.payload.transportOverlayId,
                        onDataRequired: onVisualPlayQueueDataRequired,
                    },
                });
            }
            break;
        }
        case TRIGGER_ACTIVE_QUEUES:
            if (!activeQueues) {
                break;
            }
            actionType = TOGGLE_TRANSPORT_OVERLAY;
            if (TransportOverlayState.isTransportOverlayOpen &&
                TransportOverlayState.id !== TRANSPORT_OVERLAY_ACTIVE_QUEUES) {
                actionType = SHOW_TRANSPORT_OVERLAY;
            }
            dispatchPlaybackMethods(store.dispatch, action.payload.mediaId, activeQueues.activeDevices);
            store.dispatch({
                type: actionType,
                payload: {
                    id: action.payload.transportOverlayId,
                },
            });
            break;
        case SET_AUDIO_QUALITY:
            player = await getInstance();
            player.setAudioPlayerConfig({
                streamingQuality: action.payload.audioQuality,
            });
            break;
        case UPDATE_ABR_SETTING:
            player = await getInstance();
            player.setAudioPlayerConfig({
                enableABR: action.payload.enableABR,
            });
            break;
        default:
            break;
    }
    nextAction(action);
    function setTerminationTimestamp(terminationTime) {
        store.dispatch({
            type: SET_TERMINATION_TIMESTAMP,
            payload: terminationTime,
        });
    }
    function clearTerminationTimestamp() {
        store.dispatch({
            type: CLEAR_TERMINATION_TIMESTAMP,
            payload: {},
        });
    }
    function reportPlaybackPerformance(id) {
        const { Authentication, PlaybackPerformance } = store.getState();
        const trackPerformance = PlaybackPerformance.trackPerformanceMap[id];
        if (trackPerformance) {
            const data = {
                track: trackPerformance,
                session: PlaybackPerformance.sessionPerformance,
            };
            reportClientMetric(PlaybackPerformanceMetricType, data, Authentication);
        }
    }
};
