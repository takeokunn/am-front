import React, { useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useOnScreen from '../utils/useOnScreen';
export default function LoadingWidget(props) {
    const ref = useRef();
    // eslint-disable-next-line dot-notation
    const paginationState = useSelector((state) => state.Storage['PAGINATION']);
    // eslint-disable-next-line dot-notation
    const paginationThreshold = paginationState ? paginationState['THRESHOLD_PIXELS'] : '-50px';
    const onScreen = useOnScreen(ref, paginationThreshold);
    const { onReached } = props;
    useLayoutEffect(() => {
        if (onScreen && onReached) {
            onReached();
        }
    }, [onScreen, onReached]);
    return (React.createElement("music-shoveler", { ref: ref, style: { display: 'grid', justifyItems: 'center' }, "show-arrow-buttons": false },
        React.createElement("div", { style: { width: 24, height: 24 } },
            React.createElement("music-icon", { style: { width: 24, height: 24 }, name: "loader" }))));
}
