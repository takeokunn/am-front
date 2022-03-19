import { useEffect, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { throttle } from '../utils/eventUtils';
import { NOW_PLAYING_TEMPLATE } from '../types/templates/nowPlaying';
import { VIDEO_NOW_PLAYING_TEMPLATE, } from '../types/templates/videoNowPlaying';
import { getCookie } from '../utils/getSkyfireHeaders';
import { SET_TRANSPORT_BOTTOM_OVERRIDE, ENABLE_TRANSPORT_BOTTOM_OVERRIDE } from '../actions';
export default function MShopHandler() {
    const dispatch = useDispatch();
    const { overlayTemplates } = useSelector((state) => state.TemplateStack);
    const media = useSelector((state) => state.Media);
    const throttledScrollEventListener = useCallback(throttle(scrollEventCallback, 100), []);
    const resizeObserver = useRef(new ResizeObserver(() => {
        throttledScrollEventListener();
    }));
    const rootElement = useRef(null);
    const [scrollEventListenerAdded, setScrollEventAdded] = useState(false);
    const hasOverlay = overlayTemplates.length > 0;
    const isAudioNPVShowing = hasOverlay &&
        !!overlayTemplates.find((template) => template.interface === NOW_PLAYING_TEMPLATE);
    const videoNPVTemplate = overlayTemplates.find((template) => template.interface === VIDEO_NOW_PLAYING_TEMPLATE);
    const isVideoNPVShowing = hasOverlay && !!videoNPVTemplate;
    const isNowPlaying = isAudioNPVShowing || isVideoNPVShowing;
    useEffect(() => {
        var _a;
        rootElement.current = document.getElementById('root');
        // fallback if there is parsing error in cookie using try catch
        let iosControlpanelBottomValue = 82;
        const amznAppCookie = getCookie('amzn-app-ctxt');
        if (amznAppCookie) {
            try {
                const decodedAppContext = decodeURIComponent(amznAppCookie);
                if (/dm/.test(decodedAppContext) && decodedAppContext.indexOf('{') > -1) {
                    const AMZN_APP_CONTEXT = JSON.parse(decodedAppContext.slice(decodedAppContext.indexOf('{')));
                    /**
                     * @{dm} - device metrics object
                     * @{pt} - padding top value of header
                     * @{pb} - padding bottom value of menubar at the bottom
                     */
                    const { pt = 0, pb = 0 } = (_a = AMZN_APP_CONTEXT === null || AMZN_APP_CONTEXT === void 0 ? void 0 : AMZN_APP_CONTEXT.dm) !== null && _a !== void 0 ? _a : {};
                    iosControlpanelBottomValue = Number(pb) - Number(pt);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        dispatch({
            type: ENABLE_TRANSPORT_BOTTOM_OVERRIDE,
            payload: { enableTransportBottomOverride: true },
        });
        dispatch({
            type: SET_TRANSPORT_BOTTOM_OVERRIDE,
            payload: { transportBottomOverride: iosControlpanelBottomValue },
        });
        return () => {
            window.removeEventListener('scroll', throttledScrollEventListener);
            if (resizeObserver.current && rootElement.current) {
                resizeObserver.current.unobserve(rootElement.current);
            }
        };
    }, []);
    useEffect(() => {
        // Assign listeners only when playback started and transport component is visible
        if (media && (media === null || media === void 0 ? void 0 : media.mediaId) && !isNowPlaying && !scrollEventListenerAdded) {
            setScrollEventAdded(true);
            // scroll event listener to check whether we have reached end of page
            window.addEventListener('scroll', throttledScrollEventListener);
            // ResizeObserver to check for height modifications happening due to view engine
            if (window.ResizeObserver && rootElement.current) {
                resizeObserver.current.observe(rootElement.current);
            }
        }
    }, [isNowPlaying]);
    function scrollEventCallback() {
        // check whether we have reached the bottom of the page by calculating root element height
        // and vertical scroll
        if (rootElement.current &&
            window.innerHeight + window.scrollY >= rootElement.current.offsetHeight) {
            dispatch({
                type: ENABLE_TRANSPORT_BOTTOM_OVERRIDE,
                payload: { enableTransportBottomOverride: false },
            });
        }
        else {
            dispatch({
                type: ENABLE_TRANSPORT_BOTTOM_OVERRIDE,
                payload: { enableTransportBottomOverride: true },
            });
        }
    }
    return null;
}
