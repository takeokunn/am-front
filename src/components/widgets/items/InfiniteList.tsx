import withStyles from 'isomorphic-style-loader/withStyles';
import React from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { InfiniteLoader, List, WindowScroller } from 'react-virtualized';
import { computeContainerWidth } from '../../../utils/gridHelpers';
import LoadingWidget from '../../LoadingWidget';
import * as infiniteListStyles from './InfiniteList.scss';
import { globals } from '../../../utils/globals';
const Item = SortableElement((props) => {
    const { track, handleSelected, TagType, loading, isInitialRender } = props;
    const { index, rowIndex, key, style, itemsViewedRef } = props;
    return (React.createElement(TagType, { ref: itemsViewedRef, style: style, loading: loading, data: track, handleSelected: handleSelected, index: index || rowIndex, key: key, isInitialRender: isInitialRender }));
});
class InfiniteList extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = (props) => {
            const { index } = props;
            const track = Object.assign({}, (this.props.data.items[index] || { placeholder: true }));
            const isInitialRender = index > this.state.maxIndex;
            if (isInitialRender) {
                this.setState({ maxIndex: index });
            }
            const allProps = Object.assign(Object.assign({ track, rowIndex: props.index, TagType: this.props.componentType, disabled: !this.props.isDragAndDropEnabled, isInitialRender }, props), this.props);
            return React.createElement(Item, Object.assign({}, allProps));
        };
        this.setState({
            maxIndex: -1,
        });
    }
    render() {
        var _a, _b, _c;
        // Grab data from props and Redux store.
        const { windowWidth } = this.props;
        const { items, onEndOfWidget } = this.props.data;
        const width = computeContainerWidth(windowWidth || 0);
        // Find the number of items to render.
        const count = items.length;
        // Functions to check when to load more items.
        const loadMore = () => this.props.handleSelected(onEndOfWidget);
        // InfiniteLoader will call loadMoreRows callback when isRowLoaded returns false.
        // We now say the last row is "not loaded" so InfiniteLoader will call loadMoreRows
        // when we get to the last row, if we know onEndOfWidget exists.
        const isItemLoaded = ({ index }) => index < ((onEndOfWidget === null || onEndOfWidget === void 0 ? void 0 : onEndOfWidget.length) ? items.length - 1 : items.length);
        const rootScroller = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.isVisualPlayQueue)
            ? document.getElementById('transport-overlay')
            : globals.window;
        const showLoader = (onEndOfWidget === null || onEndOfWidget === void 0 ? void 0 : onEndOfWidget.length) > 0;
        const visualPlayQueueClass = ((_b = this.props) === null || _b === void 0 ? void 0 : _b.isVisualPlayQueue)
            ? infiniteListStyles.visualPlayQueue
            : '';
        const textRowClass = ((_c = this.props) === null || _c === void 0 ? void 0 : _c.isTextRow) ? infiniteListStyles.isTextRow : '';
        const infiniteListStyle = [
            infiniteListStyles.infiniteList,
            visualPlayQueueClass,
            textRowClass,
        ].join(' ');
        return (React.createElement("div", { className: infiniteListStyle },
            React.createElement(InfiniteLoader, { isRowLoaded: isItemLoaded, loadMoreRows: loadMore, rowCount: count }, ({ onRowsRendered }) => (React.createElement(WindowScroller, { scrollElement: rootScroller }, ({ height, scrollTop, registerChild, onChildScroll }) => {
                var _a;
                return (
                // Here's some documentation as to why this works:
                // https://github.com/bvaughn/react-virtualized/issues/1324
                // https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md#render-props
                React.createElement("div", { ref: (el) => registerChild(el), className: infiniteListStyles.removeOutline },
                    React.createElement(List, { items: items, componentType: this.props.componentType, loading: (_a = this.props) === null || _a === void 0 ? void 0 : _a.loading, onRowsRendered: onRowsRendered, handleSelected: this.props.handleSelected, autoHeight: true, height: height, rowCount: count, rowHeight: this.props.rowHeight, rowRenderer: this.renderRow, scrollTop: scrollTop, scrollToAlignment: "start", scrollToIndex: this.props.scrollToIndex, onScroll: onChildScroll, width: width, overscanRowCount: 5,
                        // https://github.com/bvaughn/react-virtualized/issues/1582
                        overscanIndicesGetter: ({ cellCount, overscanCellsCount, startIndex, stopIndex, }) => ({
                            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
                            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
                        }) })));
            }))),
            showLoader && React.createElement(LoadingWidget, null)));
    }
}
function mapStateToProps(state) {
    return {
        windowWidth: state.BrowserState.windowWidth,
    };
}
function mapDispatchToProps(dispatch) {
    return {};
}
const SortableVirtualList = withStyles(infiniteListStyles)(SortableContainer(connect(mapStateToProps, mapDispatchToProps)(InfiniteList)));
export default class SortableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.registerListRef = function (sortableList, listInstance) {
            if (this) {
                this.List = listInstance;
            }
            if (sortableList) {
                // TODO refactor this
                // eslint-disable-next-line no-param-reassign
                sortableList.List = listInstance;
            }
        };
        this.isDragAndDropEnabled = () => !!(this.props.handleReorder && this.props.handleReorder.length > 0);
        this.setState({ isDragging: false });
    }
    render() {
        var _a, _b, _c, _d, _e;
        if ((_a = this.state) === null || _a === void 0 ? void 0 : _a.isDragging) {
            (_c = (_b = this.List) === null || _b === void 0 ? void 0 : _b.container) === null || _c === void 0 ? void 0 : _c.classList.add(infiniteListStyles.isDragging);
        }
        else {
            (_e = (_d = this.List) === null || _d === void 0 ? void 0 : _d.container) === null || _e === void 0 ? void 0 : _e.classList.remove(infiniteListStyles.isDragging);
        }
        return (React.createElement(SortableVirtualList, Object.assign({ ref: this.registerListRef.bind(null, this) }, this.props, { transitionDuration: 100, onSortStart: this.dragStart.bind(this), onSortEnd: this.dragEnd.bind(this), helperClass: infiniteListStyles.dragHelper, distance: 15,
            // @ts-ignore
            isDragAndDropEnabled: this.isDragAndDropEnabled(), useWindowAsScrollContainer: true, hideSortableGhost: true, lockAxis: "y" })));
    }
    dragStart() {
        this.setState({ isDragging: true });
    }
    dragEnd({ oldIndex, newIndex }) {
        var _a, _b, _c;
        this.setState({ isDragging: false });
        if (newIndex === oldIndex) {
            return;
        }
        (_b = (_a = this.props).handleReorder) === null || _b === void 0 ? void 0 : _b.call(_a, newIndex, oldIndex);
        (_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.blur();
    }
}
