var _a, _b;
// Must keep preact/devtools on top to enable preact devtools.
import 'preact/devtools';
import debounce from 'debounce';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { CLIENT_INTERACTION, URL_CHANGE, WINDOW_RESIZE } from './actions';
import { reportFlexEvent } from './utils/reportFlexEvent';
import ErrorBoundary from './components/ErrorBoundary';
import KeyboardShortcutsListener from './components/KeyboardShortcutsListener';
import PushNotificationServiceWorker from './components/PushNotificationServiceWorker';
import MashEventsListener from './mash/MashEventsListener';
import PageVisibilityController from './pageVisibility/pageVisibilityController';
import configureStore from './store/configureStore';
import { cleanDeeplink, handleNetworkConnectivityLost, handleNetworkConnectivityRecovered, globals, initSkyfire, rewriteDeeplink, getCurrentTemplateDeeplink, getLanguageDirection, } from './utils';
import TemplateContainer from './views/TemplateContainer';
import MShopHandler from './components/MShopHandler';
import { isIOSmshop } from './utils/deviceUtils';
import { reportWebVitals } from './utils/reportClientMetrics';
const { document, window } = globals;
const store = configureStore(window.amznMusic.state);
initSkyfire(store);
document.documentElement.lang =
    (_b = (_a = store.getState().Authentication.displayLanguageId) === null || _a === void 0 ? void 0 : _a.substring(0, 2)) !== null && _b !== void 0 ? _b : '';
document.documentElement.dir = getLanguageDirection();
window.onpopstate = () => {
    const newUrl = rewriteDeeplink(window.location.pathname + window.location.search, false, []);
    store.dispatch({ type: URL_CHANGE, payload: { newUrl } });
};
window.onresize = debounce(() => {
    store.dispatch({
        type: WINDOW_RESIZE,
        payload: { windowHeight: window.innerHeight, windowWidth: window.innerWidth },
    });
}, 100);
window.onerror = async (msg, url, lineNo, columnNo, error) => {
    const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
    const ua = new UAParser(globals.navigator.userAgent);
    const browser = ua.getBrowser();
    const deeplink = getCurrentTemplateDeeplink(store.getState().TemplateStack);
    reportFlexEvent('WebPlayerClientError', [
        [
            cleanDeeplink(deeplink),
            ua.getOS().name,
            browser.name,
            (error === null || error === void 0 ? void 0 : error.stack) || (error === null || error === void 0 ? void 0 : error.message),
        ],
        [Number(browser.major)],
    ], store.getState().Authentication);
};
window.addEventListener('online', () => { var _a; return handleNetworkConnectivityRecovered(store, (_a = store.getState().TemplateStack.currentTemplate) === null || _a === void 0 ? void 0 : _a.id); });
window.addEventListener('offline', () => { var _a; return handleNetworkConnectivityLost(store, (_a = store.getState().TemplateStack.currentTemplate) === null || _a === void 0 ? void 0 : _a.id); });
const onInteraction = debounce(() => {
    store.dispatch({ type: CLIENT_INTERACTION, payload: { timestamp: new Date().getTime() } });
}, 1000);
document.onmousemove = onInteraction;
document.onkeypress = onInteraction;
document.onmousedown = onInteraction;
const insertCss = (...styles) => {
    const removeCss = styles.map((style) => style._insertCss());
    return () => removeCss.forEach((dispose) => dispose());
};
const App = (React.createElement(StyleContext.Provider, { value: { insertCss } },
    React.createElement(Provider, { store: store },
        React.createElement(ErrorBoundary, null,
            React.createElement(TemplateContainer, null),
            React.createElement(KeyboardShortcutsListener, null),
            React.createElement(MashEventsListener, null),
            React.createElement(PageVisibilityController, null),
            React.createElement(PushNotificationServiceWorker, null),
            isIOSmshop() && React.createElement(MShopHandler, null)))));
const bodySelector = document.querySelector('#root') || document.body;
// render(App, bodySelector);
// Uncomment snippet below when adding hydration for SSR.
if (window.amznMusic.ssr) {
    hydrate(App, bodySelector);
    delete window.amznMusic.state;
}
else {
    render(App, bodySelector);
}
reportWebVitals(store.getState().Authentication);
