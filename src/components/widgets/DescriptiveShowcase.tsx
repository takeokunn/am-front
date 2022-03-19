import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useItemsInView } from '../../utils/useItemsInView';
import HorizontalItem, { getItemSize, HorizontalItemSize } from './items/HorizontalItem';
import { dispatchSkyfireMethods } from '../../utils';
export default function DescriptiveShowcase(props) {
    var _a;
    const { header, items, seeMoreItem, onEndOfWidget, maxViewItemCount } = props.data;
    const dispatch = useDispatch();
    // When props.onViewed is not null, we will emit the events in props.onViewed.
    // When props.onViewed is null, we want to double check if there are
    // any left events in props.data.onViewed which also need to be emitted.
    const callbackRef = useItemsInView(props.onViewed);
    useEffect(() => {
        if (props.onViewed === undefined && props.currTemplate && props.data.onViewed.length > 0) {
            dispatchSkyfireMethods(dispatch, props.currTemplate, props.data.onViewed);
        }
    }, [props.data]);
    const maxViewableItemIndex = Number.isInteger(maxViewItemCount)
        ? maxViewItemCount
        : Math.max(0, items.length);
    const viewableItems = items.slice(0, maxViewableItemIndex);
    if (viewableItems === null || viewableItems === void 0 ? void 0 : viewableItems.length) {
        const sizes = viewableItems.map((item) => getItemSize(item));
        const maxSize = sizes.reduce((acc, size) => (size > acc ? size : acc), HorizontalItemSize.Small);
        return (React.createElement("div", null,
            React.createElement("music-shoveler", { key: header, "see-all": seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.text, "primary-text": header, wrap: "1", onmusicSeeAllActivate: props.handleSelected.bind(null, (_a = seeMoreItem === null || seeMoreItem === void 0 ? void 0 : seeMoreItem.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected), onmusicScrolledToEndActivate: props.handleSelected.bind(null, onEndOfWidget) }, viewableItems.map((item, i) => (React.createElement(HorizontalItem, { ref: callbackRef, key: i, data: item, handleSelected: props.handleSelected, size: sizes[i], parentSize: maxSize, alwaysShowButton: props.alwaysShowButtonForHorizontalItem, updatedTrackPosition: props.shouldUpdateTrackPosition ? i : undefined }))))));
    }
    return null;
}
