import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from 'isomorphic-style-loader/useStyles';
import { dispatchSkyfireMethods } from '../../utils';
import HorizontalItem from './items/HorizontalItem';
import * as Styles from './ContextMenuWidget.scss';
export default function ContextMenuWidget(props) {
    var _a;
    const [calledRender, setCalledRender] = useState(false);
    const dispatch = useDispatch();
    const template = useSelector((state) => state.TemplateStack.currentTemplate);
    useStyles(Styles);
    if (!calledRender) {
        (_a = props.onContextMenuRender) === null || _a === void 0 ? void 0 : _a.call(props);
        setCalledRender(true);
    }
    const handleSelected = useCallback((methods) => {
        if (template) {
            dispatchSkyfireMethods(dispatch, template, methods);
        }
    }, [template]);
    return (React.createElement("div", { className: Styles.contextMenuWidget }, props.data.items.map((item, idx) => (React.createElement(HorizontalItem, { data: item, handleSelected: handleSelected, role: "feeditem", index: idx, key: idx })))));
}
