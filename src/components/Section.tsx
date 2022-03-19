import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import Template from '../Contexts/Template';
import { dispatchSkyfireMethods } from '../utils';
import { FLEXIBLE_TEXT_CONTAINTER_ELEMENT, } from '../types/templates/widgets/ISkyfireFlexibleTextContainerElement';
import { TEXT_ELEMENT } from '../types/templates/widgets/ISkyfireTextElement';
import { useInView } from '../utils/useItemsInView';
import { BUTTON } from '../types/templates/widgets/ISkyfireButtonElement';
import { SELECTION_ELEMENT, } from '../types/templates/widgets/items/ISkyfireSelectionElement';
import { COLOR_OPTONS_ELEMENT, } from '../types/templates/widgets/items/ISkyfireColorOptionsElement';
import * as Styles from './Section.scss';
export default function Section(props) {
    const { primaryHeader, items } = props.data;
    const callbackRef = useInView(props.onViewed);
    useStyles(Styles);
    const dispatch = useDispatch();
    const template = useContext(Template);
    const onClick = useCallback((onItemSelected, event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        if (template) {
            dispatchSkyfireMethods(dispatch, template, onItemSelected);
        }
    }, [dispatch, template]);
    return (React.createElement("div", { ref: callbackRef, className: Styles.sectionContainer },
        primaryHeader && React.createElement("h2", { className: Styles.primaryHeader }, primaryHeader),
        React.createElement("div", null, items.map((item, index) => {
            switch (item.interface) {
                case TEXT_ELEMENT: {
                    const { text } = item;
                    return (React.createElement("p", { className: Styles.textElement, dangerouslySetInnerHTML: { __html: text } }));
                }
                case FLEXIBLE_TEXT_CONTAINTER_ELEMENT: {
                    const { content, richContent, expandLabelText, collapseLabelText, lineCountWhenCollapsed, } = item;
                    return (React.createElement("music-flexible-text", { content: content, "rich-content": richContent, "expand-label-text": expandLabelText, "collapse-label-text": collapseLabelText, "line-count": lineCountWhenCollapsed }));
                }
                case BUTTON: {
                    const { onItemSelected, text } = item;
                    return (React.createElement("div", { className: Styles.buttonContainer },
                        React.createElement("music-button", { onClick: onClick.bind(this, onItemSelected), variant: "glass", size: "medium" }, text)));
                }
                case SELECTION_ELEMENT: {
                    const { primaryText, secondaryText, isSelected, selectedIcon, unSelectedIcon, onItemSelected, } = item;
                    return (React.createElement("music-selection-item", { primaryText: primaryText, secondaryText: secondaryText, isSelected: isSelected, selectedIcon: selectedIcon, unSelectedIcon: unSelectedIcon, onClick: onClick.bind(this, onItemSelected) }));
                }
                case COLOR_OPTONS_ELEMENT: {
                    const { colors, text } = item;
                    return React.createElement("music-color-options", { colors: colors, text: text });
                }
                default:
                    return null;
            }
        }))));
}
