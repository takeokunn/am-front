import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { getVisualListingGridSizes } from '../../utils/gridHelpers';
import { useItemsInView } from '../../utils/useItemsInView';
import InfiniteGrid from './items/InfiniteGrid';
import VerticalItem from './items/VerticalItem';
import * as Styles from './VisualListing.scss';
import { CIRCLE_VERTICAL_ITEM, RECTANGLE_VERTICAL_ITEM, } from '../../types/templates/widgets/items/ISkyfireVerticalItem';
/**
 * Returns the Visual Listing Grid Item type based on the Interface returned from Skyfire.
 * Possible values are circle, rectangle and square
 * @param items Array
 */
export function getVisualListingGridItemType(items) {
    if (items.every((item) => item.interface === CIRCLE_VERTICAL_ITEM)) {
        return 'circle';
    }
    if (items.every((item) => item.interface === RECTANGLE_VERTICAL_ITEM)) {
        return 'rectangle';
    }
    return 'square';
}
export default function VisualListing(props) {
    useStyles(Styles);
    const callbackRef = useItemsInView(props.onViewed);
    // Grab data from props and Redux store.
    const { data, handleSelected } = props;
    const { header, button } = data;
    const { windowWidth } = useSelector((state) => state.BrowserState);
    const onButtonClick = button ? () => { var _a; return handleSelected((_a = button === null || button === void 0 ? void 0 : button.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected); } : null;
    return (React.createElement(Fragment, null,
        header && (React.createElement("div", { className: Styles.header },
            React.createElement("h1", { className: "music-headline-4" }, header))),
        button && (React.createElement("div", { className: Styles.buttonContainer },
            React.createElement("music-button", { "icon-name": button.icon, size: "medium", onmusicActivate: onButtonClick }, button.text))),
        React.createElement(InfiniteGrid, { data: props.data, handleSelected: props.handleSelected, componentType: VerticalItem, gridSizes: getVisualListingGridSizes(windowWidth, getVisualListingGridItemType(props.data.items)), isEnumerated: props.isEnumerated, itemsViewedRef: callbackRef })));
}
