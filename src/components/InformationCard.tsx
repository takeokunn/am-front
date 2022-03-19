import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Styles from './InformationCard.scss';
import SignalChain from './widgets/items/SignalChain';
import { useObserver } from '../utils/ObserverHooks';
import { dispatchSkyfireMethods } from '../utils/dispatchSkyfireMethods';
function InformationCard(props) {
    const { primaryTextObserver, secondaryTextObserver, icon, informationLink, imageObserver, signalChain, } = props.data;
    const dispatch = useDispatch();
    const primaryText = useObserver({ observer: primaryTextObserver });
    const secondaryText = useObserver({ observer: secondaryTextObserver });
    const image = useObserver({ observer: imageObserver });
    useStyles(Styles);
    function onIconSelected() {
        dispatchSkyfireMethods(dispatch, props.template, informationLink === null || informationLink === void 0 ? void 0 : informationLink.onItemSelected);
    }
    const iconLink = (React.createElement("music-link", { onClick: onIconSelected },
        React.createElement("music-icon", { className: Styles.primaryIcon, name: icon, size: "tiny" })));
    return (React.createElement("div", { className: Styles.informationCard },
        React.createElement("music-image", { className: Styles.image, src: image, alt: primaryText }),
        React.createElement("div", { className: Styles.spacerMini }),
        React.createElement("p", { className: "music-primary-text" },
            primaryText,
            " ",
            iconLink),
        React.createElement("p", { className: "music-secondary-text" }, secondaryText),
        React.createElement("div", { className: Styles.spacerLarge }),
        signalChain && React.createElement(SignalChain, { data: signalChain })));
}
export default InformationCard;
