import { getAudioInstance, getInstance } from '../player';
import { globals } from './globals';
import { VIDEO_NOW_PLAYING_TEMPLATE } from '../types/templates/videoNowPlaying';
import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { getParameterByName, getSkyfireEnvironment } from './getSkyfireEnvironment';
import { INVOKE_DELEGATE_HTTP } from '../types/ISkyfireInvokeDelegateHttpMethod';
export async function getClientInformation(method, store) {
    const player = await getAudioInstance();
    const avPlayer = await getInstance();
    const videoPlayer = avPlayer.getVideoPlayer();
    const LYRICS_VIEWED = [0];
    const LYRICS_NOT_VIEWED = null;
    let url;
    if (method.interface === INVOKE_DELEGATE_HTTP) {
        url = new URL(getSkyfireEnvironment() + method.path);
    }
    else {
        const prefix = method.url.startsWith('/') ? globals.location.origin : '';
        url = new URL(prefix + method.url);
    }
    if (!method.clientInformation)
        return null;
    const clientInformation = {};
    method.clientInformation.forEach((clientInfo) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.PlaylistTemplateInterface.PlaylistClientInformation') {
            const name = store.getState().Dialog.textInput;
            const playlistInfo = {
                interface: clientInfo,
                name,
                path: globals.location.pathname,
            };
            Object.assign(clientInformation, { playlistInfo });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.SettingsTemplateInterface.SendSmsOrEmailClientInformation') {
            const { smsOrEmail } = store.getState().Dialog;
            const smsOrEmailInfo = {
                interface: clientInfo,
                smsOrEmail,
            };
            Object.assign(clientInformation, { smsOrEmailInfo });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.SearchTemplateInterface.SearchKeywordClientInformation') {
            const keyword = method.keyword || store.getState().SearchSuggestions.searchTerm.text || '';
            const searchKeyword = {
                interface: clientInfo,
                keyword,
            };
            Object.assign(clientInformation, { keyword: searchKeyword });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.TrackTemplateInterface.RecommendedTrackPositionClientInformation') {
            const trackPosition = method.updatedTrackPosition ||
                ((_a = store.getState().PlaylistRecommendations) === null || _a === void 0 ? void 0 : _a.updatedTrackPosition);
            const updatedTrackPosition = {
                interface: clientInfo,
                updatedTrackPosition: trackPosition,
            };
            Object.assign(clientInformation, {
                updatedTrackPosition,
            });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.UpdateProfileClientInformation') {
            const profileName = store.getState().Dialog.textInput || '';
            const { profileStatus } = store.getState().Dialog;
            const profileInfo = {
                interface: clientInfo,
                profileName,
                profileStatus,
            };
            Object.assign(clientInformation, { profileInfo });
        }
        if (clientInfo === 'PageViewedMetricInterface.v1_0.LoadTimeClientInformation') {
            const loadTimeMilliseconds = window.sessionStorage.getItem(method.owner);
            if (loadTimeMilliseconds != null) {
                const loadTimeClientInformation = {
                    interface: clientInfo,
                    loadTimeMilliseconds,
                };
                Object.assign(clientInformation, {
                    loadTimeMilliseconds: loadTimeClientInformation,
                });
            }
        }
        if (clientInfo === 'PlaybackInterface.v1_0.MediaStateClientInformation') {
            const { mediaId } = store.getState().Media;
            const { startedAt, stalledAt } = player.getPlaybackTimestamps();
            const playbackState = ((_b = store.getState().PlaybackStates.play) === null || _b === void 0 ? void 0 : _b.state) ||
                (player.isPaused() && 'PAUSED') ||
                'STOPPED';
            const previousPlaybackState = store.getState().PreviousPlaybackState.state || 'STOPPED';
            const { terminationTime, previousTerminationTime, } = store.getState().TerminationTimestamp;
            const mediaState = {
                interface: clientInfo,
                mediaPlayerName: 'MAESTRO',
                playbackState,
                previousPlaybackState,
                playbackInitiationDelayMilliSeconds: 0,
                streamFormat: (_d = (_c = player.metricsReporter) === null || _c === void 0 ? void 0 : _c.tracks[mediaId]) === null || _d === void 0 ? void 0 : _d.getMetricsStreamOrDRMTech(),
                bitrate: (_f = (_e = player.metricsReporter) === null || _e === void 0 ? void 0 : _e.tracks[mediaId]) === null || _f === void 0 ? void 0 : _f.getMetricsBitrates(player),
                cacheHitStatus: (_h = (_g = player.metricsReporter) === null || _g === void 0 ? void 0 : _g.tracks[mediaId]) === null || _h === void 0 ? void 0 : _h.getMetricsCacheHitStatus(player),
                rebufferCount: (_k = (_j = player.metricsReporter) === null || _j === void 0 ? void 0 : _j.tracks[mediaId]) === null || _k === void 0 ? void 0 : _k.rebufferCount,
                cdnType: (_m = (_l = player.metricsReporter) === null || _l === void 0 ? void 0 : _l.tracks[mediaId]) === null || _m === void 0 ? void 0 : _m.cdnType,
                playbackStartedAtTimeStampMilliSeconds: startedAt,
                // playbackResumedAtTimeStampMilliSeconds: resumedAt,
                progressInMilliSeconds: Math.round(player.getCurrentTime() * 1000),
                transferBytesPerSecond: `${player.getLatestBandwidthBPS()}`,
                terminationDurationSeconds: Math.round(terminationTime - previousTerminationTime),
                isNPVShowing: !!((_o = store
                    .getState()
                    .TemplateStack) === null || _o === void 0 ? void 0 : _o.overlayTemplates.find((template) => template.interface === VIDEO_NOW_PLAYING_TEMPLATE ||
                    template.interface === NOW_PLAYING_TEMPLATE)),
            };
            if (stalledAt) {
                mediaState.rebufferDurationMilliSeconds = Date.now() - stalledAt;
                // Same as rebufferDurationMilliSeconds
                mediaState.playbackInterruptionMilliSeconds = Date.now() - stalledAt;
            }
            Object.assign(clientInformation, { mediaState });
        }
        if (videoPlayer &&
            clientInfo === 'VideoPlaybackInterface.v1_0.VideoMediaStateClientInformation') {
            const playbackAttributes = videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.getVideoPlaybackMetricAttributes((_p = url === null || url === void 0 ? void 0 : url.pathname) === null || _p === void 0 ? void 0 : _p.includes('/videoPlaybackStopped'));
            const trackProgress = (playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.trackProgress)
                ? Math.round((playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.trackProgress) * 1000)
                : 0;
            const videoMediaState = {
                interface: 'VideoPlaybackInterface.v1_0.VideoMediaStateClientInformation',
                progressInMilliSeconds: trackProgress,
                playbackStartedAtTimeStampMilliSeconds: playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.playbackStartedAtTimeStampMilliSeconds,
                playbackResumedAtTimeStampMilliSeconds: playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.playbackResumedAtTimeStampMilliSeconds,
                playbackInitiationDelayMilliSeconds: playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.playbackInitiationDelayMilliSeconds,
                playbackDurationMilliSeconds: Math.round((playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.playbackDurationMilliSeconds) * 1000),
                totalPlaybackDurationMilliSeconds: Math.round((playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.totalPlaybackDurationMilliSeconds) * 1000),
                playbackInstanceIdPerPlayback: playbackAttributes === null || playbackAttributes === void 0 ? void 0 : playbackAttributes.playbackInstanceIdPerPlayback,
                audioVideoState: 'VIDEO',
            };
            Object.assign(clientInformation, { audioVideoState: videoMediaState });
        }
        if (clientInfo === 'PlaybackInterface.v1_0.LyricLinesClientInformation') {
            const { lyricsViewed } = store.getState().LyricsViewed;
            const lyricsInfo = {
                interface: clientInfo,
                viewedLines: lyricsViewed === true ? LYRICS_VIEWED : LYRICS_NOT_VIEWED,
            };
            Object.assign(clientInformation, { lines: lyricsInfo });
        }
        if (clientInfo === 'PlaybackInterface.v1_0.PlaybackErrorClientInformation') {
            let message;
            let context;
            if (method.clientInformation.includes('VideoPlaybackInterface.v1_0.VideoMediaStateClientInformation')) {
                message = videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.getLatestError();
            }
            else {
                const error = player.getLatestError();
                message = error.error;
                context = (_r = (_q = error.extra) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.__type; // DMLS error response type
            }
            const errorInfo = {
                interface: clientInfo,
                message,
                context,
            };
            Object.assign(clientInformation, { error: errorInfo });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.LanguageSettingClientInformation') {
            const { displayLanguageId } = store.getState().Authentication;
            const languageInfo = {
                interface: clientInfo,
                languageId: displayLanguageId,
            };
            Object.assign(clientInformation, { displayLanguage: languageInfo });
        }
        if (clientInfo === 'HDPlaybackInterface.v1_0.AudioQualitySettingClientInformation') {
            const { audioQuality } = store.getState().Setting;
            const audioQualityInfo = {
                interface: clientInfo,
                audioQuality,
            };
            Object.assign(clientInformation, { audioQuality: audioQualityInfo });
        }
        if (clientInfo === 'HDPlaybackInterface.v1_0.AudioABRSettingClientInformation') {
            const { enableABR } = store.getState().Setting;
            const ABRInfo = {
                interface: clientInfo,
                enableABR,
            };
            Object.assign(clientInformation, { enableABR: ABRInfo });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.DialogTemplateInterface.TimeZoneClientInformation') {
            const timeZoneInfo = {
                interface: clientInfo,
                timeZoneName: globals.timezone,
            };
            Object.assign(clientInformation, { displayTimeZone: timeZoneInfo });
        }
        if (clientInfo === 'PlaybackInterface.v1_0.VolumeClientInformation') {
            const volumeInfo = {
                interface: clientInfo,
                volume: player.getVolume(),
            };
            Object.assign(clientInformation, { volume: volumeInfo });
        }
        if (clientInfo === 'PageViewedMetricInterface.v1_0.RefMarkerClientInformation') {
            const refMarker = getParameterByName('ref', globals.location.href) ||
                getParameterByName('_ref', globals.location.href) ||
                getParameterByName('refMarker', globals.location.href) ||
                '';
            const refMarkerInfo = {
                interface: clientInfo,
                refMarker,
            };
            Object.assign(clientInformation, { refMarker: refMarkerInfo });
        }
        if (clientInfo === 'Web.PageInterface.v1_0.SelectedItemsClientInformation') {
            const items = [];
            const multiSelect = store.getState().Storage.MULTISELECT || {};
            const keys = Object.keys(multiSelect).filter((k) => !k.startsWith('_'));
            for (const key of keys) {
                // @ts-ignore
                items.push(multiSelect[key]);
            }
            const selectedItemInfo = {
                interface: clientInfo,
                ids: items,
            };
            Object.assign(clientInformation, { selectedIds: selectedItemInfo });
        }
        if (clientInfo === 'Web.PageInterface.v1_0.DownloadSelectedItemsClientInformation') {
            const items = [];
            const downloadSelect = store.getState().Storage.DOWNLOAD_SELECT || {};
            const keys = Object.keys(downloadSelect).filter((k) => !k.startsWith('_'));
            for (const key of keys) {
                // @ts-ignore
                items.push(downloadSelect[key]);
            }
            const downloadSelectedItemInfo = {
                interface: clientInfo,
                ids: items,
            };
            Object.assign(clientInformation, {
                downloadSelectedIds: downloadSelectedItemInfo,
            });
        }
        if (clientInfo === 'PlaybackInterface.v1_0.ScrubClientInformation') {
            const scrubInfo = store.getState().ScrubInfo;
            const scrubClientInfo = {
                interface: clientInfo,
                currentTime: scrubInfo.currentTime,
                scrubTime: scrubInfo.scrubTime,
            };
            Object.assign(clientInformation, { scrub: scrubClientInfo });
        }
        if (clientInfo ===
            'Web.TemplatesInterface.v1_0.Touch.PlaylistTemplateInterface.MoveTrackInPlaylistClientInformation' ||
            clientInfo === 'PlaybackInterface.v1_0.MoveQueueEntitiesClientInformation') {
            if (sessionStorage.getItem('dropIndex') && sessionStorage.getItem('moveTrackIndex')) {
                const moveTrackClientInformation = {
                    interface: clientInfo,
                    // @ts-ignore
                    dropIndex: +sessionStorage.getItem('dropIndex'),
                    // @ts-ignore
                    entryIndex: +sessionStorage.getItem('moveTrackIndex'),
                };
                if (clientInfo === 'PlaybackInterface.v1_0.MoveQueueEntitiesClientInformation') {
                    const dropId = sessionStorage.getItem('dropId') || '';
                    const entryId = sessionStorage.getItem('moveTrackId') || '';
                    moveTrackClientInformation.dropId = dropId;
                    moveTrackClientInformation.entryId = entryId;
                }
                Object.assign(clientInformation, {
                    reorder: moveTrackClientInformation,
                });
            }
        }
        if (clientInfo === 'PageViewedMetricInterface.v1_0.ContentViewedIndexClientInformation') {
            const contentViewedInfo = store.getState().ContentViewedInfo;
            const firstViewableIndex = (_s = contentViewedInfo.firstViewableIndex) !== null && _s !== void 0 ? _s : null;
            const lastViewableIndex = (_t = contentViewedInfo.lastViewableIndex) !== null && _t !== void 0 ? _t : null;
            const contentViewedIndexClientInformation = {
                interface: clientInfo,
                firstViewableIndex,
                lastViewableIndex,
            };
            Object.assign(clientInformation, {
                contentViewedIndex: contentViewedIndexClientInformation,
            });
        }
        if (clientInfo === 'PlaybackInterface.v1_0.StatsForNerdsClientInformation') {
            const { bitDepth, sampleRate } = store.getState().Media;
            const statsForNerdsClientInformation = {
                interface: clientInfo,
                bitDepth,
                sampleRate,
            };
            Object.assign(clientInformation, {
                statsForNerds: statsForNerdsClientInformation,
            });
        }
    });
    return clientInformation;
}
