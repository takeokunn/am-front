import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import { bindHandler } from '../../utils';
import { useInView } from '../../utils/useItemsInView';
import * as Styles from './ThumbnailNavigatorWidget.scss';
import { getDeeplink } from '../../utils/getDeeplink';
export default function ThumbnailNavigatorWidget(props) {
    const callbackRef = useInView(props.onViewed);
    useStyles(Styles);
    const { items, handleSelected } = props;
    return (React.createElement("div", { ref: callbackRef, className: Styles.thumbnailNavigator },
        props.header && (React.createElement("div", null,
            React.createElement("h1", { className: "music-headline-4" }, props.header))),
        React.createElement("div", { className: Styles.thumbnailGrid }, items.map((item, index) => (React.createElement("music-thumbnail-item", { id: `thumbnailNavigatorButton${index + 1}`, href: getDeeplink(item.primaryLink.deeplink), "background-image": item.backgroundImage, onClick: bindHandler(handleSelected, null, item.primaryLink.onItemSelected), "primary-text": item.mainText, role: "button" }))))));
}
