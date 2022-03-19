import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchSkyfireMethods } from '../utils';
import * as Styles from './DialogRow.scss';
export default function DialogRow(props) {
    useStyles(Styles);
    const { header, body, selectorItems } = props.row;
    const { audioQuality, enableABR } = useSelector((state) => state.Setting);
    let selectedItem;
    switch (props.row.variant) {
        case 'AUDIO_QUALITY':
            selectedItem = audioQuality;
            break;
        case 'ABR':
            selectedItem = enableABR ? 'ON' : 'OFF';
            break;
        default:
            break;
    }
    const dispatch = useDispatch();
    const handleSelected = (onItemSelected, event) => {
        var _a, _b, _c;
        (_b = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
        (_c = event === null || event === void 0 ? void 0 : event.preventDefault) === null || _c === void 0 ? void 0 : _c.call(event);
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    };
    return (React.createElement("div", { className: Styles.dialogRow },
        header && React.createElement("h1", { className: "music-headline-4" }, header),
        React.createElement("p", null, body),
        React.createElement("div", null, selectorItems &&
            selectorItems.map((item) => {
                const isSelected = selectedItem === item.value;
                return (React.createElement("music-list-item", { key: item.value, size: "large", "has-border": "true", "primary-text": item.mainText, "secondary-text": item.subText, disabled: item.isDisabled, onmusicActivate: () => handleSelected(item.onItemSelected) },
                    React.createElement("music-icon", { name: isSelected ? 'radiocheck' : 'radiouncheck', variant: isSelected ? 'accent' : 'solid', slot: "left", size: "small" }),
                    item.icon && (React.createElement("music-icon", { name: item.icon, slot: "right", size: "small" }))));
            }))));
}
