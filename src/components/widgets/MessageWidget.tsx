import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment, useEffect, useRef, useState, useCallback, useContext } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Template from '../../Contexts/Template';
import { bindHandler, computeElementOffsetFromPage, dispatchSkyfireMethods } from '../../utils';
import { globals } from '../../utils/globals';
import { getDeeplink } from '../../utils/getDeeplink';
import { useInView } from '../../utils/useItemsInView';
import * as messageStyles from '../../views/Message.scss';
export default function MessageWidget(props) {
    // Grab data from props and Redux store.
    const { message, subMessage, subMessageLink, subMessageLinkText, subMessageSuffix, buttonText, buttonPrimaryLink, image, header, } = props.data;
    const callbackRef = useInView(props.onViewed);
    const { windowHeight } = useSelector((state) => state.BrowserState, shallowEqual);
    const messageWidgetRef = useRef(null);
    const [topMarginStyles, setTopMarginStyles] = useState({ marginTop: 0, opacity: 0 });
    const [hasRendered, setHasRendered] = useState(false);
    useStyles(messageStyles);
    const computeTopMargin = () => {
        let marginTop;
        if (messageWidgetRef === null || messageWidgetRef === void 0 ? void 0 : messageWidgetRef.current) {
            const { offsetTop } = computeElementOffsetFromPage(messageWidgetRef.current);
            const elementHeight = messageWidgetRef.current.offsetHeight;
            const parent = messageWidgetRef.current.parentElement || globals.window.document.body;
            const parentOffset = parent.offsetTop;
            const containerHeight = globals.window.document.body.offsetHeight - parentOffset;
            // If we compute again when img loads, add back the existing marginTop
            // since we subtracted in computeElementOffsetFromPage
            marginTop = Math.max(0, Math.min(Math.max(0, containerHeight / 2 -
                offsetTop -
                elementHeight / 2 +
                topMarginStyles.marginTop), windowHeight / 3 - elementHeight)); // safeguard against multiple callbacks
            setTopMarginStyles({ marginTop, opacity: 1 });
        }
    };
    useEffect(() => {
        if (!hasRendered) {
            setHasRendered(true);
            return;
        }
        computeTopMargin();
    }, [hasRendered]);
    const dispatch = useDispatch();
    const currTemplate = useContext(Template);
    const onItemSelected = useCallback(() => {
        if (currTemplate) {
            dispatchSkyfireMethods(dispatch, currTemplate, buttonPrimaryLink === null || buttonPrimaryLink === void 0 ? void 0 : buttonPrimaryLink.onItemSelected);
        }
    }, []);
    const subMessageLinkElement = subMessageLink && subMessageLinkText ? (React.createElement(Fragment, { key: subMessageLinkText },
        ' ',
        React.createElement("music-link", { className: messageStyles.subMessageLink, href: getDeeplink(subMessageLink === null || subMessageLink === void 0 ? void 0 : subMessageLink.deeplink), onClick: bindHandler(props.handleSelected, null, subMessageLink === null || subMessageLink === void 0 ? void 0 : subMessageLink.onItemSelected) }, subMessageLinkText))) : null;
    const buttonElement = buttonText && buttonPrimaryLink ? (React.createElement(Fragment, { key: buttonText },
        ' ',
        React.createElement("music-button", { id: buttonText, variant: "glass", size: "medium", onClick: bindHandler(onItemSelected, null) }, buttonText))) : null;
    return (React.createElement("div", { ref: messageWidgetRef, style: topMarginStyles },
        React.createElement("div", { ref: callbackRef, className: messageStyles.messageContainer },
            image && (React.createElement("img", { className: messageStyles.messageImage, src: image, onLoad: computeTopMargin })),
            header && React.createElement("h1", { className: "music-headline-4" }, header),
            React.createElement("p", { className: messageStyles.messageBody },
                React.createElement("p", { className: "music-primary-text" }, message)),
            subMessage && (React.createElement("p", { className: messageStyles.messageBody },
                React.createElement("p", { className: "music-primary-text" },
                    subMessage,
                    subMessageLinkElement,
                    subMessageSuffix))),
            buttonElement && React.createElement("span", null, buttonElement))));
}
