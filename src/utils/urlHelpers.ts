import { parse, stringify } from 'query-string';
import { globals } from './globals';
import { getDeeplink } from './getDeeplink';
function isFindOrSearchPage(deeplink) {
    return deeplink.match(/\/search\/?/);
}
export function rewriteDeeplink(deeplink, coldStart = false, allowlistedQueryStringKeysOther = ['useSkyfire', 'skyfireEnv', 'nodeEnv', 'useMobileWeb']) {
    const allowlistedQueryStringKeysSearch = [...allowlistedQueryStringKeysOther, 'filter', 'sc'];
    const allowlistedQueryStringKeys = isFindOrSearchPage(deeplink)
        ? allowlistedQueryStringKeysSearch
        : allowlistedQueryStringKeysOther;
    // extract query params from deeplink
    // assume query string and hash string can come in any order
    // and that hash string does not contain a ?
    const queryIndex = deeplink.indexOf('?');
    const hashIndex = deeplink.indexOf('#');
    let queryString = '';
    let hashString = '';
    if (queryIndex > -1) {
        queryString =
            hashIndex < queryIndex
                ? deeplink.slice(queryIndex + 1)
                : deeplink.slice(queryIndex + 1, hashIndex);
    }
    if (hashIndex > -1) {
        hashString =
            queryIndex < hashIndex
                ? deeplink.slice(hashIndex + 1)
                : deeplink.slice(hashIndex + 1, queryIndex);
    }
    let deeplinkPath = deeplink;
    if (queryIndex > -1 && hashIndex > -1) {
        deeplinkPath = deeplink.slice(0, Math.min(queryIndex, hashIndex));
    }
    else if (queryIndex > -1 || hashIndex > -1) {
        deeplinkPath = deeplink.slice(0, Math.max(queryIndex, hashIndex));
    }
    const deeplinkParams = parse(queryString);
    delete deeplinkParams.skyfireEnv;
    delete deeplinkParams.useSkyfire;
    delete deeplinkParams.nodeEnv;
    const url = new URL(globals.location.href);
    const currentSearchParams = url.searchParams;
    allowlistedQueryStringKeys.forEach((key) => {
        deeplinkParams[key] = deeplinkParams[key] || currentSearchParams.get(key);
    });
    // generate deeplink's query string
    const deeplinkSearch = coldStart
        ? url.search
        : `?${stringify(deeplinkParams, { skipNull: true, skipEmptyString: true })}`;
    // build deeplink path with query string
    return (getDeeplink(deeplinkPath) +
        (deeplinkSearch.length <= 1 ? '' : deeplinkSearch) +
        (hashString.length === 0 ? '' : `#${hashString}`));
}
