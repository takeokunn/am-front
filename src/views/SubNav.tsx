import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RefinementHeader from '../components/RefinementHeader';
import Widget from '../components/widgets';
import { dispatchSkyfireMethods, dispatchTemplateRendered } from '../utils';
import * as menuStyles from './Menu.scss';
import Message from './Message';
import { PILL_NAVIGATOR_WIDGET } from '../types/templates/widgets/ISkyfirePillNavigatorWidget';
export default function SubNav({ template }) {
    const { widgets, id, updatedAt, header, button, emptyTemplateImage, emptyTemplateText, emptyTemplateTitle, emptyTemplateButtonText, emptyTemplateButtonPrimaryLink, refinementHeader, shouldHideSubNav, } = template;
    useStyles(menuStyles);
    const dispatch = useDispatch();
    const handleSelected = useCallback((onItemSelected, event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        dispatchSkyfireMethods(dispatch, template, onItemSelected);
    }, [dispatch, template]);
    const widgetsRendered = useCallback((event) => {
        if (event.target.id === template.id) {
            dispatchTemplateRendered(dispatch, template, event.detail);
            dispatchSkyfireMethods(dispatch, template, template.onViewed);
        }
    }, [dispatch, template]);
    const key = [id, updatedAt].join('-');
    const emptyMessageTemplate = {
        header: emptyTemplateTitle,
        message: emptyTemplateText,
        image: emptyTemplateImage,
        buttonText: emptyTemplateButtonText,
        buttonPrimaryLink: emptyTemplateButtonPrimaryLink,
    };
    const onButtonClick = button ? () => handleSelected(button.onItemSelected) : null;
    return (React.createElement("div", { className: shouldHideSubNav
            ? [menuStyles.menuViewContent, menuStyles.noSubNav].join(' ')
            : menuStyles.menuViewContent },
        refinementHeader && (React.createElement(RefinementHeader, { text: refinementHeader.text, refinementOptions: refinementHeader.refinementOptions, isActive: refinementHeader.isActive, isDisabled: refinementHeader.isDisabled, isOpened: refinementHeader.isOpened })),
        (header || button) && (React.createElement("div", { className: !refinementHeader
                ? [menuStyles.topMargin, menuStyles.headers].join(' ')
                : menuStyles.headers },
            header && React.createElement("div", { className: "music-headline-2" }, header),
            button && (React.createElement("div", { className: menuStyles.buttons },
                React.createElement("music-button", { "icon-name": button.icon, size: "medium", onmusicActivate: onButtonClick }, button.text))))),
        widgets.length > 0 ||
            emptyTemplateTitle ||
            emptyTemplateText ||
            emptyTemplateImage ||
            (emptyTemplateButtonText && emptyTemplateButtonPrimaryLink) ? (React.createElement("music-container", { id: id, key: key, onrendered: widgetsRendered },
            widgets.map((widget) => widget.interface === PILL_NAVIGATOR_WIDGET && (React.createElement(Widget, { data: widget, handleSelected: handleSelected }))),
            widgets
                .filter((widget) => widget.interface !== PILL_NAVIGATOR_WIDGET)
                .find((widget) => { var _a; return ((_a = widget.items) === null || _a === void 0 ? void 0 : _a.length) > 0; }) ? (widgets
                .filter((widget) => widget.interface !== PILL_NAVIGATOR_WIDGET)
                .map((widget) => (React.createElement(Widget, { data: widget, handleSelected: handleSelected })))) : (React.createElement("div", { className: menuStyles.messageContainer },
                React.createElement(Message, { template: emptyMessageTemplate }))))) : (React.createElement(LoadingSpinner, null))));
}
