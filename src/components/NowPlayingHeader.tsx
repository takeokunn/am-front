import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchSkyfireMethods } from '../utils';
import * as nowPlayingHeaderStyles from './NowPlayingHeader.scss';
import { getDeeplink } from '../utils/getDeeplink';
export default function NowPlayingHeader(props) {
    useStyles(nowPlayingHeaderStyles);
    const dispatch = useDispatch();
    const { title, subTitle, titleLink, subTitleLink, hasStreamingBadge, streamingBadge, } = useSelector((state) => state.Media);
    const onTitleClick = useCallback((e) => handleSelected(e, titleLink === null || titleLink === void 0 ? void 0 : titleLink.onItemSelected), [
        titleLink,
    ]);
    const onSubTitleClick = useCallback((e) => handleSelected(e, subTitleLink === null || subTitleLink === void 0 ? void 0 : subTitleLink.onItemSelected), [
        subTitleLink,
    ]);
    const handleSelected = (event, methods = []) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, props.template, methods);
    };
    return (React.createElement("header", { className: nowPlayingHeaderStyles.header },
        hasStreamingBadge && streamingBadge && (React.createElement("music-tag", { katanaColor: streamingBadge, variant: "outline" }, streamingBadge)),
        React.createElement("a", { href: getDeeplink(titleLink === null || titleLink === void 0 ? void 0 : titleLink.deeplink), onClick: onTitleClick, id: nowPlayingHeaderStyles.headline, className: ['music-headline-3', nowPlayingHeaderStyles.title].join(' ') }, title),
        React.createElement("a", { href: getDeeplink(subTitleLink === null || subTitleLink === void 0 ? void 0 : subTitleLink.deeplink), onClick: onSubTitleClick, className: ['music-primary-text', nowPlayingHeaderStyles.subTitle].join(' ') }, subTitle)));
}
