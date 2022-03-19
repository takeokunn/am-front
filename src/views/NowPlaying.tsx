import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import BackgroundImage from '../components/BackgroundImage';
import NowPlayingHeader from '../components/NowPlayingHeader';
import Lyrics from '../components/Lyrics';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
import { dispatchSkyfireMethods, globals } from '../utils';
import { dispatchPlaybackMethods } from '../utils/dispatchPlaybackMethods';
import * as dialogStyles from './Dialog.scss';
import * as nowPlayingStyles from './NowPlaying.scss';
import { getDeeplink } from '../utils/getDeeplink';
import PlayButton from '../components/transport/PlayButton';
import * as NowPlayingHeaderStyles from '../components/NowPlayingHeader.scss';
import { PLAYBACK_TOGGLE } from '../actions';
const { window } = globals;
export default function NowPlaying(props) {
    var _a, _b, _c;
    useStyles(dialogStyles, nowPlayingStyles);
    const dispatch = useDispatch();
    const { npvBackground, artwork, artistName, lyrics, onBackgroundImageRequired, artworkLink, onLyricsRequired, onMediaViewed, mediaId, isForMusicExperience, title, subTitle, } = useSelector((state) => state.Media);
    const controls = useSelector((state) => state.PlaybackStates);
    const playbackToggle = useCallback(() => {
        if (isForMusicExperience) {
            dispatch({ type: PLAYBACK_TOGGLE, payload: { mediaId } });
        }
    }, [mediaId]);
    const { isTransportOverlayOpen } = useSelector((state) => state.TransportOverlay);
    const { windowWidth, windowHeight } = useSelector((state) => state.BrowserState, shallowEqual);
    const { enableTransportBottomOverride } = useSelector((state) => state.MShop);
    // Only hide lyrics if we have received a lyrics object back from skyfire and it is empty
    // or the currently playing media does not have a method to retrieve lyrics
    const [shouldShowLyrics, setShouldshowLyrics] = useState(onLyricsRequired.length > 0 && (!lyrics || Object.keys(lyrics.lines).length > 0));
    const [fetchingNpvBackground, setFetchingNpvBackground] = useState(false);
    const [fetchingLyrics, setFetchingLyrics] = useState(false);
    useEffect(() => {
        if (onLyricsRequired.length === 0 && shouldShowLyrics) {
            setShouldshowLyrics(false);
        }
        if (onLyricsRequired.length > 0 && lyrics !== undefined) {
            setShouldshowLyrics(Object.keys(lyrics.lines).length > 0);
        }
    }, [lyrics, mediaId]);
    useEffect(() => {
        setFetchingNpvBackground(false);
    }, [npvBackground, mediaId]);
    useEffect(() => {
        setFetchingLyrics(false);
    }, [lyrics, mediaId]);
    useEffect(() => {
        fetchRequireMedia();
    }, [lyrics, npvBackground, mediaId]);
    useEffect(() => {
        dispatchSkyfireMethods(dispatch, props.template, onMediaViewed);
    }, [mediaId]);
    useEffect(() => {
        dispatchSkyfireMethods(dispatch, props.template, props.template.onViewed);
    }, []);
    useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isTransportOverlayOpen]);
    const handleEscape = (e) => {
        if (e.key === 'Escape' && !isTransportOverlayOpen) {
            handleSelected(e, props.template.closeButton.onItemSelected);
        }
    };
    const onClose = useCallback((e) => handleSelected(e, props.template.closeButton.onItemSelected), [props.template.closeButton]);
    const onArtworkClick = useCallback((e) => handleSelected(e, artworkLink === null || artworkLink === void 0 ? void 0 : artworkLink.onItemSelected), [
        artworkLink,
    ]);
    const handleSelected = (event, methods = []) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, props.template, methods);
    };
    // NPV margin top 15px, close icon 48px, header 100px, large transport 200px
    const albumArtHeight = windowHeight - (15 + 48 + 100 + 200);
    const npvSides = windowWidth > WINDOW_SIZE_ENUM.MD ? 36 : 20;
    const albumArtWidth = windowWidth - 2 * npvSides;
    const needRectangleBackground = windowWidth < WINDOW_SIZE_ENUM.LG && albumArtHeight < albumArtWidth;
    const rectangleClass = needRectangleBackground ? nowPlayingStyles.rectangle : null;
    const artClass = [nowPlayingStyles.album, rectangleClass].join(' ');
    const musicExperiencePlayButtonSize = windowWidth <= WINDOW_SIZE_ENUM.MD ? 'large' : 'xl';
    const viewClassname = [
        nowPlayingStyles.view,
        isForMusicExperience ? nowPlayingStyles.isMusicExperiencePlaying : null,
        enableTransportBottomOverride ? nowPlayingStyles.iosMshopNowplayingOverride : '',
    ].join(' ');
    return (React.createElement("div", { className: [
            dialogStyles.modal,
            nowPlayingStyles.npv,
            isForMusicExperience ? nowPlayingStyles.isMusicExperiencePlaying : null,
        ].join(' '), id: "npv", onClick: playbackToggle },
        React.createElement("div", { className: viewClassname },
            React.createElement(BackgroundImage, { isNowPlaying: true, isMusicExperiencePlaying: isForMusicExperience, src: isForMusicExperience || windowWidth <= WINDOW_SIZE_ENUM.XL2
                    ? artwork
                    : npvBackground }),
            React.createElement("div", { className: [
                    nowPlayingStyles.gradientOverlay,
                    isForMusicExperience && ((_a = controls.play) === null || _a === void 0 ? void 0 : _a.state) === 'PAUSED'
                        ? nowPlayingStyles.musicExperiencePlayingPaused
                        : null,
                ].join(' ') }),
            React.createElement("div", { className: [
                    nowPlayingStyles.navbar,
                    isForMusicExperience ? nowPlayingStyles.isMusicExperiencePlaying : null,
                ].join(' ') },
                React.createElement("music-button", { className: nowPlayingStyles.closeButton, onmusicActivate: onClose, variant: isForMusicExperience ? 'glass' : 'primary', size: "medium", "icon-name": isForMusicExperience ? 'cancel' : 'goback', "icon-only": true, id: "npvCloseButton", ariaLabelText: "Close" })),
            React.createElement("div", { className: [
                    nowPlayingStyles.content,
                    isForMusicExperience ? nowPlayingStyles.isMusicExperiencePlaying : null,
                ].join(' ') }, !isForMusicExperience ? (React.createElement("div", { className: nowPlayingStyles.artContainer },
                React.createElement("div", { className: artClass,
                    // @ts-ignore
                    style: { '--artWidth': `${albumArtHeight}px` } },
                    needRectangleBackground ? (React.createElement("div", { className: nowPlayingStyles.albumBackground, style: { backgroundImage: `url(${artwork})` } })) : null,
                    (artworkLink === null || artworkLink === void 0 ? void 0 : artworkLink.deeplink) ? (React.createElement("a", { href: getDeeplink(artworkLink === null || artworkLink === void 0 ? void 0 : artworkLink.deeplink), onClick: onArtworkClick, className: nowPlayingStyles.linkArt, style: { backgroundImage: `url(${artwork})` } })) : (React.createElement("music-image", { className: nowPlayingStyles.art, src: artwork }))),
                React.createElement(NowPlayingHeader, { template: props.template }))) : (React.createElement("div", { className: nowPlayingStyles.captionContainer },
                React.createElement("h2", { className: [
                        nowPlayingStyles.caption,
                        ((_b = controls.play) === null || _b === void 0 ? void 0 : _b.state) === 'PAUSED'
                            ? nowPlayingStyles.musicExperiencePlayingPaused
                            : null,
                    ].join(' ') }, title),
                React.createElement("div", { className: [
                        nowPlayingStyles.musicExperiencePlayButtonContainer,
                        ((_c = controls.play) === null || _c === void 0 ? void 0 : _c.state) === 'PAUSED'
                            ? nowPlayingStyles.musicExperiencePlayingPaused
                            : null,
                    ].join(' ') }, controls.play && (React.createElement(PlayButton, { size: musicExperiencePlayButtonSize, variant: "glass" }))),
                React.createElement("div", { className: NowPlayingHeaderStyles.header },
                    React.createElement("div", { className: ['label-text', NowPlayingHeaderStyles.title].join(' ') }, subTitle),
                    React.createElement("div", { className: [
                            'music-headline-3',
                            NowPlayingHeaderStyles.subTitle,
                        ].join(' ') }, artistName))))),
            !isForMusicExperience &&
                window.matchMedia('(orientation: landscape)').matches &&
                shouldShowLyrics && (React.createElement("div", { className: nowPlayingStyles.lyricsContainer },
                React.createElement(Lyrics, { lyrics: lyrics }))))));
    function fetchRequireMedia() {
        if (!npvBackground && !fetchingNpvBackground) {
            dispatchPlaybackMethods(dispatch, mediaId, onBackgroundImageRequired);
            setFetchingNpvBackground(true);
        }
        if (!lyrics && !fetchingLyrics) {
            dispatchPlaybackMethods(dispatch, mediaId, onLyricsRequired);
            setFetchingLyrics(true);
        }
    }
}
