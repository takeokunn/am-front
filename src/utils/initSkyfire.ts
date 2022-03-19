import { CREATE_TEMPLATE, enqueueSkyfireMethod } from '../actions';
import { RETAIL_PLAYER_PATH_SUBSTR_REGEX_EXP } from '../constants/retailPlayerConstants';
import { CHROME_TEMPLATE } from '../types/templates/chrome';
import { getParameterByName, getSkyfireEnvironment, globals } from '../utils';
import { getGenericErrorDialogMethod } from './genericErrorDialog';
function getInitialRequestMethod(owner, methods, softRefresh = false) {
    return {
        interface: CREATE_TEMPLATE,
        forced: false,
        owner,
        queue: {
            interface: 'QueuesInterface.v1_0.SingleThreadedQueue',
            id: 'TEMPLATE',
        },
        template: {
            interface: CHROME_TEMPLATE,
            templateData: { title: 'Amazon Music', deeplink: getInitialPath() },
            innerTemplate: {},
            launchMode: 'standard',
            menuItems: [],
            onCreated: methods.length > 0
                ? methods
                : [
                    {
                        interface: 'InteractionInterface.v1_0.InvokeHttpSkillMethod',
                        url: getStartupUrl(undefined, softRefresh),
                        queue: {
                            interface: 'QueuesInterface.v1_0.MultiThreadedQueue',
                            id: 'MT_HTTP',
                        },
                        before: [],
                        after: [],
                        onError: [getGenericErrorDialogMethod()],
                    },
                ],
        },
    };
}
function getInitialPath() {
    const parser = globals.document.createElement('a');
    parser.href = globals.location.href;
    const initialPath = parser.pathname;
    // to correct deeplinks for retail player with URL - https://<retail_domain>/music/player/<deeplink_path>
    return initialPath.replace(RETAIL_PLAYER_PATH_SUBSTR_REGEX_EXP, '/');
}
export function addQueryParams(initialPath, allowedQueryParams) {
    let url = initialPath;
    for (const queryParam of allowedQueryParams) {
        // We need to recalculate the sep because we may have used earlier.
        const sep = url.includes('?') ? '&' : '?';
        const queryParameterValue = getParameterByName(queryParam, globals.location.href);
        if (queryParameterValue) {
            url += `${sep + queryParam}=${queryParameterValue}`;
        }
    }
    return url;
}
export function hasQueryParams(allowedQueryParams) {
    for (const queryParam of allowedQueryParams) {
        const queryParamValue = getParameterByName(queryParam, globals.location.href);
        if (queryParamValue) {
            return true;
        }
    }
    return false;
}
function getStartupUrl(url, softRefresh) {
    const STARTUP_PATH = '/api/showHome';
    const skyfireEnvironment = getSkyfireEnvironment();
    const startupUrl = url || skyfireEnvironment + STARTUP_PATH;
    const initialPath = getInitialPath();
    const allowedQueryParams = new Set(['trackAsin', 'storyAsin', 'do']);
    if (!initialPath ||
        ((initialPath === '/' || initialPath === '/home') && !hasQueryParams(allowedQueryParams))) {
        if (softRefresh) {
            return `${startupUrl}?softRefresh=true`;
        }
        return startupUrl;
    }
    const deeplinkQueryParam = JSON.stringify(getIDeeplinkClientInformation(addQueryParams(initialPath, allowedQueryParams)));
    const sep = startupUrl.includes('?') ? '&' : '?';
    let currentUrl = `${startupUrl + sep}deeplink=${encodeURIComponent(deeplinkQueryParam)}`;
    if (softRefresh) {
        currentUrl += '&softRefresh=true';
    }
    return currentUrl;
}
function getIDeeplinkClientInformation(deeplink) {
    return {
        interface: 'DeeplinkInterface.v1_0.DeeplinkClientInformation',
        deeplink,
    };
}
export function initSkyfire(store, owner = 'BOOTSTRAP', softRefresh = false) {
    const { dispatch, getState } = store;
    const { deviceId } = getState().Authentication;
    const env = getParameterByName('skyfireEnv', globals.location.href);
    const onStartMethods = JSON.parse(globals.localStorage.getItem(`${deviceId}_${env}_onStart`) || '[]').map((method) => {
        const newMethod = Object.assign(Object.assign({}, method), { url: getStartupUrl(method.url, softRefresh) });
        return newMethod;
    });
    const initialRequest = getInitialRequestMethod(owner, onStartMethods, softRefresh);
    dispatch(enqueueSkyfireMethod({ queue: initialRequest.queue, method: initialRequest }));
}
