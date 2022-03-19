import { getDefaultCurrency } from './getDefaultCurrencyOfPreference';
import { getDefaultLanguage } from './getDefaultLanguage';
import { getCSRF, getDeviceId } from './getHttpcon';
import { getSkyfireAuthentication } from './getSkyfireAuthentication';
import { globals } from './globals';
import { DEVICE_TYPES_ENUM } from './deviceTypes';
import { isRetailPlayerRequest } from './retailPlayerHelper';
import { RETAIL_PLAYER_PATH_SUBSTR } from '../constants/retailPlayerConstants';
export async function getSkyfireHeaders(authentication, templateStack) {
    var _a, _b, _c, _d, _e, _f, _g;
    const csrf = await getCSRF(authentication);
    const deviceId = await getDeviceId(authentication);
    const now = new Date();
    const isInitialPageLoad = !((_a = templateStack === null || templateStack === void 0 ? void 0 : templateStack.previousTemplate) === null || _a === void 0 ? void 0 : _a.innerTemplate);
    const deviceType = DEVICE_TYPES_ENUM[authentication.deviceType];
    return {
        'x-amzn-authentication': getSkyfireAuthentication(authentication),
        'x-amzn-device-model': 'WEBPLAYER',
        'x-amzn-device-width': '1920',
        'x-amzn-device-family': deviceType === undefined ? 'WebPlayer' : deviceType,
        'x-amzn-device-id': deviceId,
        'x-amzn-user-agent': convertToAscii(globals.navigator.userAgent),
        'x-amzn-session-id': authentication.sessionId,
        'x-amzn-device-height': '1080',
        'x-amzn-request-id': `${generateRequestId()}`,
        'x-amzn-device-language': getDeviceLanguage(authentication),
        'x-amzn-currency-of-preference': getCurrencyOfPreference(authentication),
        'x-amzn-os-version': '1.0',
        'x-amzn-application-version': `${globals.amznMusic.appConfig.version}`,
        'x-amzn-device-time-zone': globals.timezone,
        'x-amzn-timestamp': `${Date.now()}`,
        'x-amzn-csrf': csrf,
        'x-amzn-music-domain': globals.location.hostname,
        'x-amzn-referer': getReferer(authentication, isInitialPageLoad),
        'x-amzn-affiliate-tags': decodeURIComponent((_c = (_b = authentication.metricsContext) === null || _b === void 0 ? void 0 : _b.encodedAffiliateTags) !== null && _c !== void 0 ? _c : ''),
        'x-amzn-ref-marker': decodeURIComponent((_e = (_d = authentication.metricsContext) === null || _d === void 0 ? void 0 : _d.refMarker) !== null && _e !== void 0 ? _e : ''),
        'x-amzn-page-url': getPageUrl(templateStack),
        'x-amzn-weblab-id-overrides': getWeblabIdOverrides(),
        'x-amzn-video-player-token': (_g = (_f = authentication.videoPlayerToken) === null || _f === void 0 ? void 0 : _f.header) !== null && _g !== void 0 ? _g : '',
    };
}
export function getCookie(name) {
    const cookieRegex = new RegExp(`${name}=([^;]+)`);
    const cookie = cookieRegex.exec(globals.document.cookie);
    return (cookie && cookie[1]) || '';
}
function getPageUrl(templateStack) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const deeplink = (_c = (_b = (_a = templateStack === null || templateStack === void 0 ? void 0 : templateStack.currentTemplate) === null || _a === void 0 ? void 0 : _a.innerTemplate) === null || _b === void 0 ? void 0 : _b.templateData) === null || _c === void 0 ? void 0 : _c.deeplink;
    let queryString = '';
    if ((_d = globals.location) === null || _d === void 0 ? void 0 : _d.search) {
        queryString = (deeplink === null || deeplink === void 0 ? void 0 : deeplink.includes('?'))
            ? (_h = `&${(_g = (_f = (_e = globals.location) === null || _e === void 0 ? void 0 : _e.search) === null || _f === void 0 ? void 0 : _f.slice) === null || _g === void 0 ? void 0 : _g.call(_f, 1)}`) !== null && _h !== void 0 ? _h : ''
            : (_k = (_j = globals.location) === null || _j === void 0 ? void 0 : _j.search) !== null && _k !== void 0 ? _k : '';
    }
    const pageUrl = isRetailPlayerRequest(globals.location.hostname)
        ? `${globals.location.origin}${RETAIL_PLAYER_PATH_SUBSTR}${deeplink}${queryString}`
        : `${globals.location.origin}${deeplink}${queryString}`;
    return deeplink ? encodeURI(parseLocation(pageUrl)) : parseLocation(globals.location.href);
}
function getReferer(authentication, isInitialPageLoad) {
    var _a, _b, _c;
    if (isInitialPageLoad) {
        return ((_a = authentication.metricsContext) === null || _a === void 0 ? void 0 : _a.referer)
            ? new URL(authentication.metricsContext.referer).hostname
            : '';
    }
    return (_c = (_b = globals.location) === null || _b === void 0 ? void 0 : _b.hostname) !== null && _c !== void 0 ? _c : '';
}
function convertToAscii(str) {
    return str.replace(/[^\x00-\x7F]/g, (c) => unescape(encodeURIComponent(c)));
}
function generateRequestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function getDeviceLanguage(authentication) {
    if (isRetailPlayerRequest(globals.location.hostname) && !isRetailLOPEnabled()) {
        return getDefaultLanguage(authentication.marketplaceId);
    }
    return authentication.displayLanguageId || getDefaultLanguage(authentication.marketplaceId);
}
function isRetailLOPEnabled() {
    return globals.amznMusic.appConfig.isRetailLOPEnabled;
}
function getCurrencyOfPreference(authentication) {
    if (isRetailPlayerRequest(globals.location.hostname) && !isRetailCOPEnabled()) {
        return getDefaultCurrency(authentication.marketplaceId);
    }
    return authentication.currencyOfPreference || getDefaultCurrency(authentication.marketplaceId);
}
function isRetailCOPEnabled() {
    return globals.amznMusic.appConfig.isRetailCOPEnabled;
}
function getWeblabIdOverrides() {
    let overrides = getCookie('experiment').replace(/"/g, '');
    // TODO remove after WeblabV2 is fully dialed up
    if (!overrides.includes('WEBFIRE_WEBLAB_V2_378448') &&
        globals.amznMusic.appConfig.weblabV2Enabled) {
        if (overrides.length > 0) {
            overrides += '&';
        }
        overrides += 'WEBFIRE_WEBLAB_V2_378448:T1';
    }
    return overrides;
}
/**
 * Parses location href to remove hash section.
 * Certain service frameworks (e.g. Spring) do not recognize the section of a URL following a '#'.
 *
 * @param href location href to parse
 * @returns parsed location href
 */
function parseLocation(href) {
    if (href.indexOf('#') === -1) {
        return href;
    }
    const url = href.split('#')[0];
    const query = href.indexOf('?') === -1 ? '' : href.split('?')[1];
    return query ? `${url}?${query}` : url;
}
