import useStyles from 'isomorphic-style-loader/useStyles';
import * as React from 'react';
import { bindHandler } from '../../utils';
import { useObserver } from '../../utils/ObserverHooks';
import { getDeeplink } from '../../utils/getDeeplink';
import { useInView } from '../../utils/useItemsInView';
import * as Styles from './PillNavigatorWidget.scss';
export default function PillNavigatorWidget(props) {
    const { iconButton, header, items } = props.data;
    const callbackRef = useInView(props.onViewed);
    useStyles(Styles);
    const iconButtonElement = useObserver(iconButton);
    function renderIconButton() {
        return (iconButtonElement && (React.createElement("div", { className: Styles.pillNavigatorButtonWrapper },
            React.createElement("music-button", { id: "pillNavigatorIconButton", "icon-name": iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.icon, "icon-only": true, variant: "glass", size: "small", onClick: bindHandler(props.handleSelected, null, iconButtonElement === null || iconButtonElement === void 0 ? void 0 : iconButtonElement.onItemSelected) }))));
    }
    function renderItems() {
        return items.map((item, index) => {
            var _a;
            return (React.createElement("div", { className: Styles.pillNavigatorButtonWrapper },
                React.createElement("music-pill-item", { id: `pillNavigatorButton${index + 1}`, text: item.text, onClick: bindHandler(props.handleSelected, null, item.onItemSelected), href: getDeeplink((_a = item === null || item === void 0 ? void 0 : item.primaryLink) === null || _a === void 0 ? void 0 : _a.deeplink) }, item.text)));
        });
    }
    return props.data.isHorizontalScrollable ? (React.createElement("div", { ref: callbackRef, className: Styles.pillNavigator },
        React.createElement("music-shoveler", { key: header, "primary-text": header },
            renderIconButton(),
            renderItems()))) : (React.createElement("div", { ref: callbackRef, className: [Styles.pillNavigator, Styles.grid].join(' ') },
        React.createElement("h4", null, header),
        renderIconButton(),
        renderItems()));
}
