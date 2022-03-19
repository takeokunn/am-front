import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import * as Styles from './Dropdown.scss';
import { useObserver } from '../utils/ObserverHooks';
import Template from '../Contexts/Template';
import { useItemSelectedState } from '../utils/MultiSelectHook';
import { dispatchSkyfireMethods } from '../utils';
function MultiSelectListItem(props) {
    const { item, template } = props;
    const dispatch = useDispatch();
    const contextTemplate = useContext(Template);
    const currTemplate = template || contextTemplate;
    const isItemSelected = useItemSelectedState(item.isSelected);
    const onSelected = useObserver({ observer: item.onPreferenceSelected });
    const handleSelectedChange = useCallback(() => {
        const methods = Array.isArray(onSelected) ? onSelected : [];
        if (currTemplate && methods.length > 0) {
            dispatchSkyfireMethods(dispatch, currTemplate, methods);
        }
    }, [dispatch, currTemplate, onSelected]);
    return (React.createElement("music-list-item", { size: "large", "has-border": "true", "primary-text": item.mainText, "secondary-text": item.subText, onmusicActivate: handleSelectedChange },
        React.createElement("music-button", { onmusicActivate: handleSelectedChange, slot: "right", variant: isItemSelected === 'on' ? 'accent' : 'primary', "icon-name": "like", "icon-only": true, size: "medium" })));
}
export default function MultiSelectList(props) {
    useStyles(Styles);
    return (React.createElement("ul", { className: Styles.multiselectList }, props.items.map((item, index) => (React.createElement(MultiSelectListItem, { key: index, item: item, template: props.template })))));
}
