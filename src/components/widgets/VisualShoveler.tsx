import React from 'react';
import { useItemsInView } from '../../utils/useItemsInView';
import { RECTANGLE_VERTICAL_ITEM } from '../../types/templates/widgets/items/ISkyfireVerticalItem';
import VerticalItem, { getItemSize, VerticalItemSize } from './items/VerticalItem';
export default function VisualShoveler(props) {
    var _a;
    const { header, items, seeMoreItem, onEndOfWidget, isCompact } = props.data;
    const callbackRef = useItemsInView(props.onViewed);
    if (items === null || items === void 0 ? void 0 : items.length) {
        const sizes = items.map((item) => getItemSize(item));
        const maxSize = sizes.reduce((acc, size) => (size > acc ? size : acc), VerticalItemSize.Small);
        const rectangleItemCount = items.filter((item) => item.interface === RECTANGLE_VERTICAL_ITEM).length;
        const containsRectangleAndNonRectangleItems = items.length !== rectangleItemCount && rectangleItemCount > 0;
        return (React.createElement("div", null,
            React.createElement("music-shoveler", { key: header, "see-all": seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.text, "primary-text": header, onmusicSeeAllActivate: props.handleSelected.bind(null, (_a = seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected), onmusicScrolledToEndActivate: props.handleSelected.bind(null, onEndOfWidget), isCompact: isCompact }, items.map((item, i) => (React.createElement(VerticalItem, { ref: callbackRef, key: i, data: item, handleSelected: props.handleSelected, parentSize: maxSize, constraint: containsRectangleAndNonRectangleItems ? 'square' : undefined }))))));
    }
    return null;
}
