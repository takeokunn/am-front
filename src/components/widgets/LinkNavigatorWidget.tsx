import useStyles from 'isomorphic-style-loader/useStyles';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { WINDOW_SIZE_ENUM } from '../../types/IWindowSize';
import { bindHandler } from '../../utils';
import * as Styles from './LinkNavigatorWidget.scss';
import { getDeeplink } from '../../utils/getDeeplink';
import { useInView } from '../../utils/useItemsInView';
function onEnterKeyPress(handleSelected, event) {
    if (event.key === 'Enter') {
        handleSelected();
    }
}
function hasBottomBorder(windowWidth, index, items) {
    let isItemBottomRow;
    let bottomRowItemCount;
    const FOUR_COLUMNS = windowWidth >= WINDOW_SIZE_ENUM.XL3 && windowWidth < WINDOW_SIZE_ENUM.TV;
    const TWO_COLUMNS = windowWidth >= WINDOW_SIZE_ENUM.LG || windowWidth >= WINDOW_SIZE_ENUM.TV;
    if (FOUR_COLUMNS) {
        bottomRowItemCount = items.length % 4;
        isItemBottomRow = index > items.length - 1 - bottomRowItemCount;
    }
    else if (TWO_COLUMNS) {
        bottomRowItemCount = items.length % 2;
        isItemBottomRow = index > items.length - 1 - bottomRowItemCount;
    }
    else {
        /* ONE_COLUMN */
        bottomRowItemCount = 1;
        isItemBottomRow = index > items.length - 1 - bottomRowItemCount;
    }
    return !isItemBottomRow;
}
export default function LinkNavigatorWidget(props) {
    const callbackRef = useInView(props.onViewed);
    useStyles(Styles);
    const { windowWidth } = useSelector((state) => state.BrowserState);
    return (React.createElement("div", { ref: callbackRef, className: Styles.linkNavigator },
        React.createElement("h2", null, props.header),
        props.items.map((item, index, items) => (React.createElement("music-list-item", { id: `linkNavigatorItem${index + 1}`, size: "large", href: getDeeplink(item.primaryLink.deeplink), "has-border": hasBottomBorder(windowWidth, index, items), "primary-text": item.text, "show-chevron": true, onmusicActivate: bindHandler(props.handleSelected, null, item.primaryLink.onItemSelected), onKeyPress: bindHandler(onEnterKeyPress, null, item.primaryLink.onItemSelected) })))));
}
