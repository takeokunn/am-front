import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import Template from '../../Contexts/Template';
import { dispatchSkyfireMethods } from '../../utils';
import { useItemsInView } from '../../utils/useItemsInView';
import ImageRow from './items/ImageRow';
import InfiniteList from './items/InfiniteList';
export default function VisualTableWidget(props) {
    const callbackRef = useItemsInView(props.onViewed);
    const dispatch = useDispatch();
    const template = useContext(Template);
    const { onTrackReorder } = props.data;
    const handleReorder = (moveToIndex, trackIndex) => {
        sessionStorage.setItem('dropIndex', moveToIndex);
        sessionStorage.setItem('moveTrackIndex', trackIndex);
        const moveTrackId = props.data.items[trackIndex].id;
        const dropId = props.data.items[moveToIndex].id;
        if (moveTrackId && dropId) {
            sessionStorage.setItem('moveTrackId', moveTrackId);
            sessionStorage.setItem('dropId', dropId);
        }
        dispatch({
            type: 'REORDER_TRACK',
            payload: { trackIndex, moveToIndex, isVisualPlayQueue: !!props.isVisualPlayQueue },
        });
        dispatchSkyfireMethods(dispatch, template, onTrackReorder);
    };
    const scrollToIndex = props.data.items.findIndex((item) => item.shouldScrollTo);
    return (React.createElement(InfiniteList, { data: props.data, handleSelected: props.handleSelected, handleReorder: (onTrackReorder === null || onTrackReorder === void 0 ? void 0 : onTrackReorder.length) > 0 ? handleReorder : undefined, componentType: ImageRow, rowHeight: 80, loading: props === null || props === void 0 ? void 0 : props.loading, isVisualPlayQueue: props === null || props === void 0 ? void 0 : props.isVisualPlayQueue, itemsViewedRef: callbackRef, scrollToIndex: scrollToIndex }));
}
