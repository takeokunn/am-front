import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindHandler, dispatchSkyfireMethods } from '../../../utils';
export default function RowItemButton(props) {
    const { button, slot } = props;
    const template = useSelector((state) => state.TemplateStack.currentTemplate);
    const dispatch = useDispatch();
    const debouncedClickHandler = bindHandler(() => {
        if (template) {
            dispatchSkyfireMethods(dispatch, template, button.primaryLink.onItemSelected);
        }
    }, null);
    const onClick = useCallback((event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        event === null || event === void 0 ? void 0 : event.stopPropagation();
        debouncedClickHandler();
    }, [dispatch]);
    return (React.createElement("music-button", { slot: slot, disabled: button.isDisabled, "icon-name": button.icon, onClick: onClick, size: "small", variant: "primary", "icon-only": true, title: button.text }, button.text));
}
