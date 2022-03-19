import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import * as Styles from './SignalChain.scss';
import { useObserver } from '../../../utils/ObserverHooks';
function ChainNode(props) {
    const { primaryText, secondaryText, icon } = useObserver(props.data);
    return (React.createElement("div", { className: Styles.chainNode },
        icon && (React.createElement("div", { className: Styles.chainNodeIcon },
            React.createElement("music-icon", { name: icon, size: "small" }))),
        (primaryText || secondaryText) && (React.createElement("div", { className: Styles.chainNodeText },
            React.createElement("div", { className: "music-primary-text" }, primaryText),
            React.createElement("div", { className: "music-secondary-text" }, secondaryText)))));
}
function ChainLink(props) {
    const { text, icon } = useObserver(props.data);
    return (React.createElement("div", { className: Styles.chainLink },
        React.createElement("div", { className: Styles.chainLinkLine }),
        icon && (React.createElement("div", { className: Styles.chainLinkIcon },
            React.createElement("music-icon", { name: icon, size: "tiny" }))),
        text && React.createElement("div", { className: `music-secondary-text ${Styles.chainLinkText}` }, text)));
}
function SignalChain(props) {
    const { chainNodeElements, chainLinkElements } = props.data;
    useStyles(Styles);
    if (!(chainNodeElements === null || chainNodeElements === void 0 ? void 0 : chainNodeElements.length))
        return null;
    const elements = [];
    for (let i = 0; i < chainNodeElements.length; i++) {
        elements.push(React.createElement(ChainNode, { data: chainNodeElements[i] }));
        if (chainLinkElements === null || chainLinkElements === void 0 ? void 0 : chainLinkElements[i]) {
            elements.push(React.createElement(ChainLink, { data: chainLinkElements[i] }));
        }
    }
    return React.createElement("div", null, elements);
}
export default SignalChain;
