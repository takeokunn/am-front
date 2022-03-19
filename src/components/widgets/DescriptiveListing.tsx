import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchSkyfireMethods } from '../../utils';
import Template from '../../Contexts/Template';
import { getDescriptiveListingGridSizes } from '../../utils/gridHelpers';
import { useItemsInView } from '../../utils/useItemsInView';
import InfiniteGrid from './items/InfiniteGrid';
import HorizontalItem from './items/HorizontalItem';
import * as visualStyles from './VisualListing.scss';
import { WINDOW_SIZE_ENUM } from '../../types/IWindowSize';
import { SET_STORAGE } from '../../actions/Storage';
export default function DescriptiveListing(props) {
    useStyles(visualStyles);
    const callbackRef = useItemsInView(props.onViewed);
    const { windowWidth } = useSelector((state) => state.BrowserState);
    const { addAllToPlaylistEnabled, addAllToPlaylistMaxTrackCount, actionButton, items, } = props.data;
    // Experimental 'Add All To Playlist' button only on homepage ShowCatalogTrack widgets
    // Add class for flexbox styling if we show button to render header and button inline
    const headerClassname = actionButton
        ? `${visualStyles.header} ${visualStyles.actionBtn}`
        : `${visualStyles.header}`;
    const dispatch = useDispatch();
    const template = useContext(Template);
    // Collect up to MaxTrackCount tracks into SelectedItemsClientInterface to add to playlist
    // Done on front-end as ClientInterface cannot easily collect tracks across pagination
    // Upper case name to satisfy linter
    const OnButtonSelected = (methods) => {
        if (addAllToPlaylistEnabled) {
            items
                .slice(0, Math.min(addAllToPlaylistMaxTrackCount !== null && addAllToPlaylistMaxTrackCount !== void 0 ? addAllToPlaylistMaxTrackCount : 0, items.length))
                .forEach((item) => {
                var _a, _b, _c, _d;
                dispatch({
                    type: SET_STORAGE,
                    payload: {
                        group: 'MULTISELECT',
                        key: (_b = (_a = item.iconButton) === null || _a === void 0 ? void 0 : _a.observer) === null || _b === void 0 ? void 0 : _b.storageKey,
                        value: (_d = (_c = item.button) === null || _c === void 0 ? void 0 : _c.observer) === null || _d === void 0 ? void 0 : _d.storageKey,
                    },
                });
            });
        }
        dispatchSkyfireMethods(dispatch, template, methods);
    };
    return (React.createElement(Fragment, null,
        props.data.header && (React.createElement("div", { className: headerClassname },
            React.createElement("h1", { className: "music-headline-4" }, props.data.header),
            actionButton && (React.createElement("music-button", { type: "button", variant: "glass", size: "medium", data: actionButton, onClick: OnButtonSelected.bind(this, actionButton.onItemSelected), "icon-name": actionButton.icon, iconOnly: windowWidth <= WINDOW_SIZE_ENUM.MD }, actionButton.text)))),
        React.createElement(InfiniteGrid, { data: props.data, handleSelected: props.handleSelected, componentType: HorizontalItem, gridSizes: getDescriptiveListingGridSizes(windowWidth), isEnumerated: props.isEnumerated, itemsViewedRef: callbackRef })));
}
