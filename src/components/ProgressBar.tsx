import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ALLOW_USER_SELECT, PREVENT_USER_SELECT } from '../actions/Interaction';
import { SCRUBBED, UPDATE_SCRUB_INFO } from '../actions/Playback';
import * as Styles from './ProgressBar.scss';
export default function ProgressBar(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { bufferTime, duration, mediaId, time, displayScrubber, scrubbing, onSeekUpdate, onScrubberDragStart, onScrubberDragEnd, } = props;
    const container = useRef(null);
    const [scrubberX, setScrubberX] = useState(0);
    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
        }
        else if (scrubbing) {
            bindEventListeners();
            dispatch({ type: PREVENT_USER_SELECT });
        }
        else {
            unbindEventListeners();
            dispatch({ type: ALLOW_USER_SELECT });
        }
        return () => unbindEventListeners();
    }, [scrubbing]);
    const bufferTimeStyle = calculateStyle(bufferTime);
    const scrubberStyle = calculateScrubberStyle(scrubbing, scrubberX, time);
    return (React.createElement("div", { ref: container, className: [Styles.progressBar, scrubbing ? Styles.grabbing : ''].join(' '), onMouseDown: handleScrubberDragStart, onTouchStart: handleScrubberDragStart },
        React.createElement("div", { className: Styles.clickableArea }),
        React.createElement("span", { className: Styles.barContainer },
            React.createElement("div", { style: bufferTimeStyle, className: Styles.backgroundBar }),
            React.createElement("div", { style: scrubberStyle, className: Styles.foregroundBar })),
        React.createElement("div", { className: [
                Styles.scrubberContainer,
                displayScrubber || scrubbing ? '' : Styles.hidden,
            ].join(' ') },
            React.createElement("div", { style: scrubberStyle, className: [Styles.scrubber, scrubbing ? Styles.dragging : ''].join(' ') },
                React.createElement("music-icon", { name: "circle", size: "tiny" })))));
    function bindEventListeners() {
        var _a, _b, _c, _d;
        (_a = document.body) === null || _a === void 0 ? void 0 : _a.addEventListener('mousemove', handleScrubberMove);
        (_b = document.body) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseup', handleScrubberDragStop);
        (_c = document.body) === null || _c === void 0 ? void 0 : _c.addEventListener('touchmove', handleScrubberMove);
        (_d = document.body) === null || _d === void 0 ? void 0 : _d.addEventListener('touchend', handleScrubberDragStop);
    }
    function unbindEventListeners() {
        var _a, _b, _c, _d;
        (_a = document.body) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousemove', handleScrubberMove);
        (_b = document.body) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseup', handleScrubberDragStop);
        (_c = document.body) === null || _c === void 0 ? void 0 : _c.removeEventListener('touchmove', handleScrubberMove);
        (_d = document.body) === null || _d === void 0 ? void 0 : _d.removeEventListener('touchend', handleScrubberDragStop);
    }
    function handleScrubberDragStart(event) {
        onScrubberDragStart();
        handleScrubberMove(event.nativeEvent);
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();
    }
    function computeXPositionInsideScrubber(event) {
        var _a;
        const offset = calculateScrubberOffset();
        let x;
        if ('changedTouches' in event && event.changedTouches.length) {
            x = event.changedTouches[0].clientX;
        }
        else if ('clientX' in event) {
            x = event.clientX;
        }
        if (x !== undefined) {
            x = Math.max(x - offset, 0);
            const width = ((_a = container === null || container === void 0 ? void 0 : container.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || window.innerWidth;
            x = Math.min(x, width);
        }
        return x;
    }
    function handleScrubberMove(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const x = computeXPositionInsideScrubber(event);
        if (x !== undefined) {
            setScrubberX(x);
            const position = calculatePosition(x);
            onSeekUpdate(position);
        }
    }
    function handleScrubberDragStop(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onScrubberDragEnd();
        const x = computeXPositionInsideScrubber(event);
        if (x !== undefined) {
            const position = seekTo(x);
            onSeekUpdate(position);
        }
    }
    function calculateStyle(value) {
        return { width: `${(value / duration) * 100}%` };
    }
    function calculateScrubberStyle(isDragging, width, currentTime) {
        if (isDragging) {
            return { width };
        }
        return calculateStyle(currentTime);
    }
    function calculateScrubberOffset() {
        var _a, _b;
        return (_b = (_a = container === null || container === void 0 ? void 0 : container.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().left) !== null && _b !== void 0 ? _b : 0;
    }
    function calculatePosition(x) {
        var _a;
        const width = ((_a = container === null || container === void 0 ? void 0 : container.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || window.innerWidth;
        return Math.round(duration * (x / width));
    }
    function seekTo(x) {
        const position = calculatePosition(x);
        dispatch({ type: SCRUBBED, payload: { position, mediaId } });
        dispatch({
            type: UPDATE_SCRUB_INFO,
            payload: {
                currentTime: time,
                scrubTime: position,
            },
        });
        return position;
    }
}
