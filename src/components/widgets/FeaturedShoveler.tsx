import React from 'react';
import { useItemsInView } from '../../utils/useItemsInView';
import HorizontalItem, { getItemSize, HorizontalItemSize } from './items/HorizontalItem';
export default function FeaturedShoveler(props) {
    const { header, items, seeMoreItem } = props.data;
    const callbackRef = useItemsInView(props.onViewed);
    if (items === null || items === void 0 ? void 0 : items.length) {
        const sizes = items.map((item) => getItemSize(item));
        const maxSize = sizes.reduce((acc, size) => (size > acc ? size : acc), HorizontalItemSize.Small);
        return (React.createElement("div", null,
            React.createElement("music-shoveler", { key: header, "see-all": seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.text, "primary-text": header, onmusicSeeAllActivate: props.handleSelected.bind(null, seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.primaryLink.onItemSelected) }, items.map((item, i) => (React.createElement(HorizontalItem, { ref: callbackRef, key: i, data: item, handleSelected: props.handleSelected, size: sizes[i], parentSize: maxSize }))))));
    }
    return null;
}
