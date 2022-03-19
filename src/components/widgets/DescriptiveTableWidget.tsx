import React from 'react';
import { useItemsInView } from '../../utils/useItemsInView';
import InfiniteList from './items/InfiniteList';
import TextRow from './items/TextRow';
export default function DescriptiveTableWidget(props) {
    const callbackRef = useItemsInView(props.onViewed);
    const scrollToIndex = props.data.items.findIndex((item) => item.shouldScrollTo);
    return (React.createElement(InfiniteList, { data: props.data, handleSelected: props.handleSelected, componentType: TextRow, rowHeight: 80, isTextRow: true, itemsViewedRef: callbackRef, scrollToIndex: scrollToIndex }));
}
