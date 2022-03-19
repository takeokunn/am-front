import React from 'react';
import { bindHandler } from '../../utils';
import { useObserver } from '../../utils/ObserverHooks';
import { useInView } from '../../utils/useItemsInView';
export default function FeaturedPlay(props) {
    const { actionIconLink, iconButton, image, label, header, primaryText, secondaryText, playText, playingText, pausedText, } = props.data;
    const callbackRef = useInView(props.onViewed);
    const bindHandlerHelper = (fn) => bindHandler(props.handleSelected, this, fn);
    const iconButtonElement = useObserver(iconButton);
    return (React.createElement("div", null,
        React.createElement("music-featured-play", { ref: callbackRef, image: image, label: label, header: header, "primary-text": primaryText, secondaryText: secondaryText, "play-text": playText, "playing-text": playingText, "paused-text": pausedText, "icon-name": iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon, onmusicActionButtonActivate: bindHandlerHelper((iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected) ||
                (actionIconLink ? actionIconLink.onItemSelected : [])) })));
}
