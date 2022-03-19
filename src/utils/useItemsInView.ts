import debounce from 'debounce';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { SET_CONTENT_VIEWED_INDICES } from '../actions/ContentViewed';
import { globals } from './globals';
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.75,
};
function setViewedItemIndices(dispatch, firstViewableIndex, lastViewableIndex) {
    dispatch({
        type: SET_CONTENT_VIEWED_INDICES,
        payload: {
            firstViewableIndex,
            lastViewableIndex,
        },
    });
}
/**
 * Hook for ui content view
 * Observes a single element and performs an action the first time it enters the view
 * @param onViewed - function called when item enters view
 * @returns callbackRef | undefined
 */
export function useInView(onViewed = () => { }) {
    var _a, _b;
    const weblabFlag = (_b = (_a = globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.uiContentViewOnViewEnabled;
    const node = useRef();
    const observerRef = useRef(null);
    const dispatch = useDispatch();
    const createIntersectionObserver = useCallback(() => {
        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    setViewedItemIndices(dispatch, 0, 0);
                    onViewed();
                }
            });
        }
        return new globals.window.IntersectionObserver(handleIntersect, options);
    }, [dispatch, onViewed]);
    useEffect(() => {
        var _a;
        if (weblabFlag) {
            observerRef.current = createIntersectionObserver();
            if (node.current) {
                (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.observe(node.current);
            }
            return () => { var _a; return (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.disconnect(); };
        }
        return () => { };
    }, [weblabFlag, createIntersectionObserver]);
    const callbackRef = useCallback((element) => {
        node.current = element;
    }, []);
    return weblabFlag ? callbackRef : undefined;
}
/**
 * Hook for ui content view
 * Observes multiple items within a widget and performs an action when any items enter the view
 * Note that the HTML elements or web components being observed must have a data-key attribute
 * @param onItemsViewed - function called when any items enter view
 * @returns callbackRef | undefined
 */
export function useItemsInView(onItemsViewed = () => { }) {
    var _a, _b;
    const weblabFlag = (_b = (_a = globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.uiContentViewOnViewEnabled;
    const nodes = useRef([]);
    const elementKeyIndexMap = useRef(new Map());
    const observerRef = useRef(null);
    const observedElementsSet = useRef(new Set());
    const index = useRef(0);
    const dispatch = useDispatch();
    const createIntersectionObserver = useCallback(() => {
        const viewedElements = new Set();
        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    viewedElements.add(entry.target);
                }
            });
            debounce(() => {
                if (viewedElements.size > 0) {
                    const viewedElementIndices = [...viewedElements]
                        .map((e) => { var _a; return elementKeyIndexMap.current.get((_a = e.dataset.key) !== null && _a !== void 0 ? _a : ''); })
                        .filter((n) => n !== undefined);
                    const firstViewableIndex = Math.min(...viewedElementIndices);
                    const lastViewableIndex = Math.max(...viewedElementIndices);
                    setViewedItemIndices(dispatch, firstViewableIndex, lastViewableIndex);
                    onItemsViewed();
                }
                viewedElements.clear();
            }, 1000)();
        }
        return new globals.window.IntersectionObserver(handleIntersect, options);
    }, [dispatch, onItemsViewed]);
    useEffect(() => {
        if (weblabFlag) {
            observerRef.current = createIntersectionObserver();
            return () => { var _a; return (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.disconnect(); };
        }
        return () => { };
    }, [weblabFlag, createIntersectionObserver]);
    useEffect(() => {
        if (weblabFlag) {
            nodes.current.forEach((element) => {
                var _a;
                if (!observedElementsSet.current.has(element)) {
                    (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.observe(element);
                    observedElementsSet.current.add(element);
                }
            });
        }
    }, [weblabFlag, nodes.current.length]);
    const callbackRef = useCallback((element) => {
        if (element && !elementKeyIndexMap.current.has(element.dataset.key)) {
            elementKeyIndexMap.current.set(element.dataset.key, index.current++);
            nodes.current.push(element);
        }
    }, []);
    return weblabFlag ? callbackRef : undefined;
}
