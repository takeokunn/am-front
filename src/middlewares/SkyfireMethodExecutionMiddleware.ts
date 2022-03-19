import { getPodcastHeaders, getPodcastPreset, podcastRequest, INVOKE_HTTP_POST, } from 'dm-podcast-web-player';
import { dequeueSkyfireMethod, enqueueSkyfireMethod, EXECUTE_METHOD, EXECUTE_METHODS, SET_CSRF, setAuthentication, } from '../actions';
import { INVOKE_HTTP, INVOKE_HTTP_GLOBAL, } from '../types/ISkyfireInvokeHttpMethod';
import { cleanDeeplink, getCurrentTemplateDeeplink, getOAuthToken, getSkyfireHeaders, getSkyfireUrl, globals, } from '../utils';
import { handleNetworkConnectivityRecovered } from '../utils/appEventsHandler';
import { reportFlexEvent } from '../utils/reportFlexEvent';
import { INVOKE_DELEGATE_HTTP, } from '../types/ISkyfireInvokeDelegateHttpMethod';
import { skyfirePostRequest } from '../utils/skyfireRequest';
export const SkyfireMethodExecutionMiddleware = (store) => (next) => async (action) => {
    next(action);
    switch (action.type) {
        case EXECUTE_METHOD:
            handleMethod(store, action.payload);
            break;
        case EXECUTE_METHODS:
            handleMethods(store, action.payload);
            break;
        default:
            break;
    }
};
function handleMethods(store, methods) {
    methods.forEach(handleMethod.bind(null, store));
}
export async function handleMethod(store, action) {
    if ([INVOKE_HTTP, INVOKE_HTTP_GLOBAL, INVOKE_HTTP_POST, INVOKE_DELEGATE_HTTP].includes(action.type)) {
        if (action.payload.delay !== undefined) {
            setTimeout(() => handleNetworkMethod(store, action.payload), action.payload.delay);
            return;
        }
        handleNetworkMethod(store, action.payload);
    }
    else {
        store.dispatch(action);
        store.dispatch(dequeueSkyfireMethod(action.payload.queue));
    }
}
async function handleNetworkMethod(store, method) {
    let headers;
    try {
        method.before.forEach((beforeMethod) => {
            store.dispatch(enqueueSkyfireMethod({
                queue: beforeMethod.queue,
                method: Object.assign(Object.assign({}, beforeMethod), { owner: method.owner }),
            }));
        });
        const authenticationState = store.getState().Authentication;
        const templateStackState = store.getState().TemplateStack;
        let accessToken;
        if (authenticationState.isCirrusAuthExpired || !authenticationState.customerId) {
            /*
             If customer is authenticated but expired then isCirrusAuthExpired is true.
             When cirrusAuthExpired, we have backend logic to ensure
             Desktop should be routed to AuthPortal in our Horizonte logic.
             Mobile web should come here to have the same experience as the anonymous user
             */
            accessToken = '';
        }
        else {
            accessToken = authenticationState.accessToken;
            const THREE_MINUTES = 3 * 60 * 1000;
            if (Date.now() > authenticationState.expiresAt - THREE_MINUTES) {
                const { accessToken: newAccessToken, expiresAt } = await getOAuthToken();
                accessToken = newAccessToken;
                store.dispatch(setAuthentication({ accessToken, expiresAt }));
            }
        }
        headers = await getSkyfireHeaders(Object.assign(Object.assign({}, authenticationState), { accessToken }), templateStackState);
        if (!authenticationState.csrf) {
            const { token, timestamp, rndNonce } = JSON.parse(headers['x-amzn-csrf']);
            const sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)session-id\s*\=\s*([^;]*).*$)|^.*$/, '$1');
            /* For anonymous case when dev server running locally
               we need sessionId for showSearchSkill and both sessionId and deviceId
               for showSearchSuggestions.
               We don't have cookie set when initializing AuthenticationReducer,
               so we set the value here.
               We also don't have deviceId(Ubid) because httpcon does not give use for
               the first time we call it,
               however, we don't want to set deviceId here, as it will make real deviceId not
               being set for authenticated case.
               * I think * the reason is if we don't have cookies pass to Auth Service,
               we don't get Ubid
               see more: https://w.amazon.com/bin/view/IdentityServices/CMS/The_Trouble_with_Ubids/#HCookielessBrowsers
             */
            store.dispatch({
                type: SET_CSRF,
                payload: {
                    csrf: { token, ts: timestamp, rnd: rndNonce },
                    sessionId,
                },
            });
        }
        if (isPodcastPostRequest(method)) {
            await executePodcastPostRequest(method, store, accessToken);
        }
        else {
            const onRequestError = async (message) => {
                const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
                const ua = new UAParser(globals.navigator.userAgent);
                reportFlexEvent('WebPlayerServiceError', [
                    [
                        'Skyfire',
                        ua.getOS().name,
                        `${ua.getBrowser().name}-${ua.getBrowser().major}`,
                        `${headers['x-amzn-request-id']};${message}`,
                    ],
                    [],
                ], store.getState().Authentication);
                return method.onError;
            };
            const url = await getSkyfireUrl(method, store);
            const response = await skyfirePostRequest(url, headers, onRequestError);
            response.forEach((responseMethod) => {
                store.dispatch(enqueueSkyfireMethod({
                    queue: responseMethod.queue,
                    method: Object.assign(Object.assign({}, responseMethod), { owner: method.owner }),
                }));
            });
        }
        method.after.forEach((afterMethod) => {
            store.dispatch(enqueueSkyfireMethod({
                queue: afterMethod.queue,
                method: Object.assign(Object.assign({}, afterMethod), { owner: method.owner }),
            }));
        });
        if (!store.getState().AppEvents.hasNetworkConnectivity) {
            handleNetworkConnectivityRecovered(store, method.owner);
        }
        return Promise.resolve(true);
    }
    catch (error) {
        method.onError.forEach((responseMethod) => {
            store.dispatch(enqueueSkyfireMethod({
                queue: responseMethod.queue,
                method: Object.assign(Object.assign({}, responseMethod), { owner: method.owner }),
            }));
        });
        const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
        const ua = new UAParser(globals.navigator.userAgent);
        const browser = ua.getBrowser();
        const deeplink = getCurrentTemplateDeeplink(store.getState().TemplateStack);
        reportFlexEvent('WebPlayerClientError', [
            [cleanDeeplink(deeplink), ua.getOS().name, browser.name, error === null || error === void 0 ? void 0 : error.message],
            [Number(browser.major)],
        ], store.getState().Authentication);
        return Promise.resolve(false);
    }
    finally {
        store.dispatch(dequeueSkyfireMethod(method.queue));
    }
}
export const isPodcastPostRequest = (method) => method.interface === INVOKE_HTTP_POST && method.url.includes('api/podcast');
const executePodcastPostRequest = async (method, store, accessToken) => {
    const { customerId, deviceId, deviceType, marketplaceId, sessionId, csrf, } = store.getState().Authentication;
    const requestInfo = {
        customerId,
        deviceId,
        deviceType,
        marketplaceId,
        sessionId,
        accessToken,
        csrf,
        timeZone: globals.timezone,
    };
    const headers = getPodcastHeaders(method.target);
    const preset = await getPodcastPreset(method, store);
    const response = (await podcastRequest({
        url: method.url,
        headers,
        store,
        requestInfo,
        preset,
        methodBody: method,
    }));
    response.forEach((responseMethod) => {
        store.dispatch(enqueueSkyfireMethod({
            queue: responseMethod.queue,
            method: Object.assign(Object.assign({}, responseMethod), { owner: method.owner }),
        }));
    });
};
