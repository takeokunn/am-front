import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindHandler, dispatchSkyfireMethods } from '../utils';
import ContextMenuButton from './ContextMenuButton';
import * as Styles from './RefinementHeader.scss';
export default function RefinementHeader(props) {
    const dispatch = useDispatch();
    const template = useSelector((state) => state.TemplateStack.currentTemplate);
    useStyles(Styles);
    const onItemSelected = useCallback((methods) => {
        if (template) {
            dispatchSkyfireMethods(dispatch, template, methods);
        }
    }, []);
    const classNames = [
        Styles.refinementWrapper,
        props.classNames || '',
        props.isDisabled ? Styles.invisible : '',
    ].join(' ');
    return (React.createElement("div", { className: classNames, "aria-hidden": props.isDisabled },
        React.createElement("music-refinement-bar", { text: props.text, isActive: props.isActive, open: props.isOpened }, props.refinementOptions.map((refinementOption) => {
            if (refinementOption.options) {
                return (React.createElement("span", { className: Styles.refinementOption },
                    React.createElement(ContextMenuButton, { options: refinementOption.options, variant: refinementOption.isActive ? 'solid' : 'glass', isRefinement: true, size: "medium", iconName: "caretdown", text: refinementOption.text, disabled: props.isDisabled })));
            }
            return (React.createElement("music-button", { className: Styles.refinementOption, variant: refinementOption.isActive ? 'solid' : 'glass', refinement: "static", size: "medium", onmusicActivate: bindHandler(onItemSelected, null, refinementOption.onItemSelected), disabled: props.isDisabled }, refinementOption.text));
        }))));
}
