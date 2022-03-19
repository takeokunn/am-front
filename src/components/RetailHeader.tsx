import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import carouselStyles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import * as Styles from './RetailHeader.scss';
import { dispatchSkyfireMethods } from '../utils';
import Template from '../Contexts/Template';
import { useInView } from '../utils/useItemsInView';
export default function RetailHeader(props) {
    const { primaryText, secondaryText, tertiaryText, image, label, buttons, iconButtons, carouselImages, backgroundImage, placeHolder, primaryBadge, callToActionButton, } = props.data;
    const callbackRef = useInView(props.onViewed);
    useStyles(carouselStyles, Styles);
    const dispatch = useDispatch();
    const template = useContext(Template);
    const onClick = useCallback((onItemSelected, event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        if (template) {
            dispatchSkyfireMethods(dispatch, template, onItemSelected);
        }
    }, [dispatch, template]);
    return (React.createElement("div", { ref: callbackRef },
        React.createElement("div", { className: Styles.pageContainer },
            backgroundImage && (React.createElement("div", { className: Styles.headerBackgroundContainer, style: { background: `url(${backgroundImage})` } })),
            React.createElement("div", { className: Styles.retailHeaderContainer },
                React.createElement("div", { className: Styles.imageHolder, style: placeHolder ? { background: `url(${placeHolder}) center/contain` } : {} },
                    React.createElement(Carousel, { showArrows: true, infiniteLoop: true, showThumbs: false, useKeyboardArrows: true, autoPlay: false, swipeable: true, showStatus: false,
                        // fixes issue on mobile where autoplay is false, there is an auto slide
                        // https://github.com/leandrowd/react-responsive-carousel/issues/621
                        interval: 9999999 }, carouselImages.map((url, i) => (React.createElement("div", null,
                        React.createElement("img", { src: url, alt: `merch slide ${i + 1}` })))))),
                React.createElement("div", { className: Styles.header },
                    React.createElement("div", { className: Styles.artistHeader },
                        image && React.createElement("img", { className: Styles.artistIcon, src: image, alt: label }),
                        React.createElement("span", { className: "label-text" }, label)),
                    React.createElement("span", { className: "headline-4" }, primaryText),
                    React.createElement("div", { className: "flex" },
                        React.createElement("span", { className: "secondary-text" }, secondaryText),
                        primaryBadge && (React.createElement("div", { className: Styles.prime },
                            React.createElement("music-icon", { name: primaryBadge })))),
                    React.createElement("div", { className: Styles.btnHolder },
                        callToActionButton && (React.createElement("music-button", { class: "cta", slot: "buttons", variant: "glass", onClick: onClick.bind(this, callToActionButton === null || callToActionButton === void 0 ? void 0 : callToActionButton.onItemSelected) }, callToActionButton.text)),
                        iconButtons.map((btn) => (React.createElement("music-button", { key: btn.icon, iconName: btn.icon, slot: "buttons", iconOnly: true, variant: "glass", size: "small", onClick: onClick.bind(this, btn.onItemSelected), ariaLabelText: btn.icon }))))))),
        React.createElement("music-divider", null)));
}
