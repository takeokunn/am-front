import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CONTEXT_MENU } from '../actions/ContextMenu';
import { SET_STORAGE } from '../actions/Storage';
import ContextMenuButton from '../components/ContextMenuButton';
import Button from '../components/widgets/items/Button';
import Template from '../Contexts/Template';
import { dispatchSkyfireMethods } from '../utils';
import { useSelectedRowCount } from '../utils/MultiSelectHook';
import * as Styles from './MultiSelectBar.scss';
export default function MultiSelectBar() {
    var _a;
    useStyles(Styles);
    const dispatch = useDispatch();
    const template = useContext(Template);
    const multiSelectBar = (_a = template === null || template === void 0 ? void 0 : template.innerTemplate) === null || _a === void 0 ? void 0 : _a.multiSelectBar;
    const multiSelectCount = useSelectedRowCount();
    const actionButton1 = multiSelectBar === null || multiSelectBar === void 0 ? void 0 : multiSelectBar.actionButton1;
    const actionButton2 = multiSelectBar === null || multiSelectBar === void 0 ? void 0 : multiSelectBar.actionButton2;
    const allSelected = useSelector((state) => { var _a, _b; return ((_b = (_a = state === null || state === void 0 ? void 0 : state.Storage) === null || _a === void 0 ? void 0 : _a.MULTISELECT) === null || _b === void 0 ? void 0 : _b._all) === 'true'; });
    if (!allSelected && multiSelectCount === (multiSelectBar === null || multiSelectBar === void 0 ? void 0 : multiSelectBar.itemCount) && multiSelectCount > 0) {
        dispatch({
            type: SET_STORAGE,
            payload: {
                group: 'MULTISELECT',
                key: '_all',
                value: 'true',
            },
        });
    }
    const onClose = useCallback((methods) => {
        dispatchSkyfireMethods(dispatch, template, methods);
        dispatch({ type: CLOSE_CONTEXT_MENU });
    }, [dispatch, template]);
    const onButton1 = useCallback((methods) => !(actionButton1 === null || actionButton1 === void 0 ? void 0 : actionButton1.disabled) && dispatchSkyfireMethods(dispatch, template, methods), [actionButton1 === null || actionButton1 === void 0 ? void 0 : actionButton1.disabled, dispatch, template]);
    const onButton2 = useCallback((methods) => !(actionButton2 === null || actionButton2 === void 0 ? void 0 : actionButton2.disabled) && dispatchSkyfireMethods(dispatch, template, methods), [actionButton2 === null || actionButton2 === void 0 ? void 0 : actionButton2.disabled, dispatch, template]);
    if (!multiSelectBar || multiSelectCount <= 0) {
        return null;
    }
    const { selectedText, contextMenu, closeButton } = multiSelectBar;
    return (React.createElement("div", { className: Styles.multiSelectBar, style: { display: multiSelectCount ? 'block' : 'none' } },
        React.createElement("section", null,
            React.createElement("div", { className: "music-headline-4" }, selectedText.replace('0', `${multiSelectCount}`)),
            React.createElement("div", null,
                actionButton1 && (React.createElement(Button, { variant: "glass", data: actionButton1, handleSelected: onButton1 })),
                actionButton2 && (React.createElement(Button, { variant: "glass", data: actionButton2, handleSelected: onButton2 })),
                contextMenu && (React.createElement(ContextMenuButton, { size: "small", iconName: "more", variant: "glass", disabled: contextMenu.disabled, options: contextMenu.options })),
                React.createElement(Button, { variant: "glass", size: "small", data: closeButton, handleSelected: onClose })))));
}
