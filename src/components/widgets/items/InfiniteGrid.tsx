import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, InfiniteLoader, WindowScroller } from 'react-virtualized';
import { computeContainerWidth } from '../../../utils/gridHelpers';
import * as Styles from './InfiniteGrid.scss';
import LoadingWidget from '../../LoadingWidget';
export default function InfiniteGrid(props) {
    useStyles(Styles);
    // Grab data from props and Redux store.
    const { data, handleSelected, gridSizes, isEnumerated, itemsViewedRef } = props;
    const { onEndOfWidget, items } = data;
    const { colCount, colWidth, rowHeight } = gridSizes;
    // Calculate grid sizing.
    const scrollbarWidth = 8;
    const { windowWidth } = useSelector((state) => state.BrowserState);
    const width = computeContainerWidth(windowWidth - scrollbarWidth);
    // Functions to check when to load more items.
    const loadMoreItems = () => handleSelected(onEndOfWidget);
    const isRowLoaded = ({ index }) => index < ((onEndOfWidget === null || onEndOfWidget === void 0 ? void 0 : onEndOfWidget.length) ? items.length - 1 : items.length);
    let renderRows;
    const onSectionRendered = ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex, }) => {
        const startIndex = rowStartIndex * colCount + columnStartIndex;
        const stopIndex = rowStopIndex * colCount + columnStopIndex;
        renderRows({ startIndex, stopIndex });
    };
    const showLoader = (onEndOfWidget === null || onEndOfWidget === void 0 ? void 0 : onEndOfWidget.length) > 0;
    const Item = ({ columnIndex, key, rowIndex, parent, style }) => {
        const { columnCount, data: itemData } = parent.props;
        const TagType = parent.props.componentType;
        const index = rowIndex * columnCount + columnIndex;
        return itemData.items.length > index ? (React.createElement(TagType, { ref: itemsViewedRef, data: itemData.items[index], handleSelected: itemData.handleSelected, key: key, style: style, position: isEnumerated ? index + 1 : undefined })) : null;
    };
    return (React.createElement("div", null,
        React.createElement(InfiniteLoader, { isRowLoaded: isRowLoaded, loadMoreRows: loadMoreItems, rowCount: items.length, threshold: 1 }, ({ onRowsRendered, registerChild }) => {
            renderRows = onRowsRendered;
            return (React.createElement(WindowScroller, null, ({ height, scrollTop }) => (React.createElement(Grid, { className: Styles.grid, autoHeight: true, componentType: props.componentType, data: { items, handleSelected }, width: width, height: height, scrollTop: scrollTop, ref: registerChild, columnCount: colCount, columnWidth: colWidth, rowCount: Math.ceil(items.length / colCount), rowHeight: rowHeight, cellRenderer: Item, onSectionRendered: onSectionRendered, containerRole: "row" }))));
        }),
        showLoader && React.createElement(LoadingWidget, null)));
}
