import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'debounce';
import { UAParser } from 'ua-parser-js';
import BackgroundImage from '../components/BackgroundImage';
import ContextMenuButton from '../components/ContextMenuButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RefinementHeader from '../components/RefinementHeader';
import Button, { placeholderSizeMap } from '../components/widgets/items/Button';
import WidgetList from '../components/widgets/WidgetList';
import { dispatchSkyfireMethods, dispatchTemplateRendered, globals, preventDefault, } from '../utils';
import { useObserver, useObservers } from '../utils/ObserverHooks';
import * as Styles from './View.scss';
import * as detailStyles from './Detail.scss';
import { computeContainerWidth } from '../utils/gridHelpers';
import { useSourceCasing } from '../utils/globals';
import { spacersSizeMap } from '../utils/webUIVariables';
import { checkTouch } from '../utils/platform';
import { getDeeplink } from '../utils/getDeeplink';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
export default function Detail(props) {
    const dispatch = useDispatch();
    const targetRef = useRef(null);
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        if (targetRef.current) {
            const { offsetWidth } = targetRef.current;
            setWidth(offsetWidth);
        }
    }, []);
    useEffect(() => {
        const debouncedResize = debounce(() => {
            setWidth(window.innerWidth);
        }, 10);
        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
        };
    });
    const { widgets, headerImage, headerImageKind, headerImageDimension, backgroundImage, contextMenu, headerText, headerButtons, headerIsEmptyTemplate, headerEmptyTemplatePrimaryText, purchaseOptions, headerPrimaryText, headerSecondaryText, headerTertiaryText, headerPrimaryTextLink, headerSecondaryTextLink, headerNavigationTexts, headerNavigationTextLinks, headerBadges, headerLabel, id, footer, isSmallHeaderCentered, updatedAt, refinementHeader, } = props.template;
    const key = [id, updatedAt].join('-');
    useStyles(detailStyles, Styles);
    const headerTextElement = useObserver(headerText);
    const ua = new UAParser(globals.navigator.userAgent);
    const browser = ua.getBrowser();
    const isMobileSafariWebView = browser.name === 'Mobile Safari' && !globals.navigator.standalone;
    const headerButtonsRow1 = [];
    const headerButtonsRow2 = [];
    const detailHeaderWidth = Math.max(0, computeContainerWidth(Math.max(width, 320)));
    let currentWidth = 0;
    if (purchaseOptions) {
        // image container size is calculated for button placement
        // not calculated for breakpoint LG devices as the image and detail breaks to 2 rows
        const imageContainerWidth = width > WINDOW_SIZE_ENUM.LG ? computeImageContainerSize() : 0;
        currentWidth += imageContainerWidth;
    }
    const spacerSize = spacersSizeMap.small;
    const isMobile = checkTouch(window);
    const textButtonsIndexes = [];
    const textButtons = [];
    const textButtonsMap = {};
    headerButtons.forEach((button, idx) => {
        if (!button.iconOnly) {
            textButtonsIndexes.push(idx);
            textButtons.push(button);
        }
    });
    const textButtonsProps = useObservers(textButtons);
    for (let i = 0; i < textButtonsIndexes.length; i++) {
        // map text button indexes to their properties
        textButtonsMap[textButtonsIndexes[i]] = textButtonsProps[i];
    }
    headerButtons.forEach((button, idx) => {
        var _a;
        let buttonSize;
        let textSize = 0;
        if (button.iconOnly) {
            buttonSize = isMobile ? 'medium' : 'small';
        }
        else {
            const text = ((_a = textButtonsMap[idx]) === null || _a === void 0 ? void 0 : _a.text) || '';
            // Approximating px size per character is ~7.2-7.5, so rounding up to 8 to be safe
            textSize = text.length * 8;
            buttonSize = isMobile ? 'large' : 'medium';
        }
        const buttonElement = (React.createElement("span", { className: detailStyles.detailButtonSlot },
            React.createElement(Button, { data: button, handleSelected: handleSelected, id: `detailHeaderButton${idx + 1}`, slot: "icons", size: buttonSize, variant: button.outline ? 'outline' : 'glass' })));
        currentWidth +=
            placeholderSizeMap[button.iconOnly ? 'medium' : 'large'] + spacerSize + textSize;
        if (currentWidth >= detailHeaderWidth) {
            headerButtonsRow2.push(buttonElement);
        }
        else {
            headerButtonsRow1.push(buttonElement);
        }
        if (idx === 0 && purchaseOptions) {
            const purchaseTextSize = (purchaseOptions === null || purchaseOptions === void 0 ? void 0 : purchaseOptions.text) ? purchaseOptions.text.length * 8 : 0;
            const purchaseButtonSize = isMobile ? 'large' : 'medium';
            const purchaseOptionsButton = (React.createElement("span", { className: detailStyles.detailButtonSlot },
                React.createElement(ContextMenuButton, { id: "purchaseOptionsButton", text: purchaseOptions === null || purchaseOptions === void 0 ? void 0 : purchaseOptions.text, isRefinement: true, postFixIconName: purchaseOptions === null || purchaseOptions === void 0 ? void 0 : purchaseOptions.postfixIcon, options: purchaseOptions === null || purchaseOptions === void 0 ? void 0 : purchaseOptions.options, disabled: purchaseOptions === null || purchaseOptions === void 0 ? void 0 : purchaseOptions.disabled, slot: "icons", variant: "glass", size: purchaseButtonSize })));
            currentWidth += placeholderSizeMap.large + spacerSize + purchaseTextSize;
            if (currentWidth >= detailHeaderWidth) {
                headerButtonsRow2.push(purchaseOptionsButton);
            }
            else {
                headerButtonsRow1.push(purchaseOptionsButton);
            }
        }
    });
    if (contextMenu) {
        const contextMenuElement = (React.createElement(ContextMenuButton, { id: "detailHeaderContextButton", options: contextMenu.options, disabled: contextMenu.disabled, slot: "icons", variant: "glass", iconName: "more", size: checkTouch(window) ? 'medium' : 'small' }));
        currentWidth += placeholderSizeMap.medium + spacerSize;
        if (currentWidth >= detailHeaderWidth) {
            headerButtonsRow2.push(contextMenuElement);
        }
        else {
            headerButtonsRow1.push(contextMenuElement);
        }
    }
    return (React.createElement("div", { className: Styles.viewContent, ref: targetRef },
        !isMobileSafariWebView && React.createElement(BackgroundImage, { src: backgroundImage }),
        React.createElement("div", { style: { minHeight: '40px', marginTop: '10px' } }, refinementHeader && (React.createElement(RefinementHeader, { text: refinementHeader.text, refinementOptions: refinementHeader.refinementOptions, isActive: refinementHeader.isActive, isDisabled: refinementHeader.isDisabled, isOpened: refinementHeader.isOpened }))),
        React.createElement("music-detail-header", { key: headerImage, style: {
                contain: 'layout',
                marginTop: spacersSizeMap.large,
                display: 'block',
            }, "image-src": headerImage, "image-dimen": headerImageDimension || '1:1', label: headerLabel, headline: headerTextElement.text || headerText, "primary-text": headerPrimaryText, "primary-text-href": getDeeplink(headerPrimaryTextLink === null || headerPrimaryTextLink === void 0 ? void 0 : headerPrimaryTextLink.deeplink), onmusicPrimaryTextActivate: handleSelected.bind(this, headerPrimaryTextLink === null || headerPrimaryTextLink === void 0 ? void 0 : headerPrimaryTextLink.onItemSelected), "secondary-text": headerSecondaryText, "secondary-text-href": getDeeplink(headerSecondaryTextLink === null || headerSecondaryTextLink === void 0 ? void 0 : headerSecondaryTextLink.deeplink), onmusicSecondaryTextActivate: handleSelected.bind(this, headerSecondaryTextLink === null || headerSecondaryTextLink === void 0 ? void 0 : headerSecondaryTextLink.onItemSelected), "tertiary-text": headerTertiaryText, badges: headerBadges, onClick: preventDefault, useSourceCasing: useSourceCasing(), isSmallHeaderCentered: isSmallHeaderCentered, "image-kind": headerImageKind },
            React.createElement("div", { slot: "icons" }, headerButtonsRow1),
            headerButtonsRow2.length > 0 && (React.createElement("div", { slot: "icons", className: detailStyles.detailButtonsSecondaryRow }, headerButtonsRow2)),
            headerNavigationTexts && (React.createElement("div", { className: "nav-container", slot: "navLinks" }, headerNavigationTexts === null || headerNavigationTexts === void 0 ? void 0 : headerNavigationTexts.map((item, idx) => {
                var _a, _b, _c;
                return (React.createElement("music-link", { disabled: !(headerNavigationTextLinks &&
                        getDeeplink((_a = headerNavigationTextLinks[idx]) === null || _a === void 0 ? void 0 : _a.deeplink)), title: item, href: headerNavigationTextLinks
                        ? getDeeplink((_b = headerNavigationTextLinks[idx]) === null || _b === void 0 ? void 0 : _b.deeplink)
                        : undefined, onClick: handleSelected.bind(this, headerNavigationTextLinks
                        ? (_c = headerNavigationTextLinks[idx]) === null || _c === void 0 ? void 0 : _c.onItemSelected
                        : undefined) },
                    React.createElement("span", { className: "fakeLink" }, item)));
            })))),
        (widgets === null || widgets === void 0 ? void 0 : widgets.length) ? (React.createElement("music-container", { id: id, key: key, onrendered: widgetsRendered },
            headerIsEmptyTemplate && (React.createElement(Fragment, null,
                React.createElement("div", { className: detailStyles.emptyTexts },
                    React.createElement("div", { className: `primary-text ${detailStyles.primaryText}` }, headerEmptyTemplatePrimaryText)),
                React.createElement("div", { className: detailStyles.emptyTextsVertical },
                    React.createElement("div", { className: `secondary-text ${detailStyles.secondaryText}` }, headerEmptyTemplatePrimaryText)))),
            React.createElement(WidgetList, { list: widgets, handleSelected: handleSelected }))) : (React.createElement(LoadingSpinner, null)),
        footer && (React.createElement("div", { className: Styles.footer },
            React.createElement("span", { className: "music-tertiary-text" }, footer)))));
    function handleSelected(onItemSelected) {
        if (!onItemSelected) {
            return;
        }
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }
    function widgetsRendered(event) {
        if (event.target.id === props.template.id) {
            dispatchTemplateRendered(dispatch, props.template, event.detail);
            dispatchSkyfireMethods(dispatch, props.template, props.template.onViewed);
        }
    }
    function computeImageContainerSize() {
        // Image container size from detail-header component CSS declaration
        let containerWidth;
        if (width <= WINDOW_SIZE_ENUM.MD) {
            containerWidth = 192;
        }
        else if (width <= WINDOW_SIZE_ENUM.XL) {
            containerWidth = 256;
        }
        else {
            containerWidth = 280;
        }
        return containerWidth;
    }
}
