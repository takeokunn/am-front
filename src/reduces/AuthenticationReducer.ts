import { SET_DISPLAY_LANGUAGE, SET_AUTHENTICATION_METHOD, SET_CSRF, SET_VIDEO_PLAYER_TOKEN, } from '../actions';
import { getExpirationTimestamp } from '../utils/getOAuthToken';
/**
 * Initialize deviceId at Redux store creation time to avoid stale window references on SSR requests
 * @param {string} sessionId
 * @returns {string}
 */
function getDeviceId(sessionId) {
    var _a, _b, _c;
    return (((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.deviceId) !== null && _c !== void 0 ? _c : null) ||
        (document === null || document === void 0 ? void 0 : document.cookie.replace(/(?:(?:^|.*;\s*)ubid-main\s*\=\s*([^;]*).*$)|^.*$/, '$1').replace(/-/gi, '')) ||
        sessionId);
}
/**
 * Initialize sessionId at Redux store creation time
 * to avoid stale window references on SSR requests
 * @returns {string}
 */
function getSessionId() {
    var _a, _b, _c;
    return (((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.sessionId) !== null && _c !== void 0 ? _c : null) ||
        (document === null || document === void 0 ? void 0 : document.cookie.replace(/(?:(?:^|.*;\s*)session-id\s*\=\s*([^;]*).*$)|^.*$/, '$1')));
}
/**
 * Initialize authentication state at Redux store creation time
 * to avoid stale window references on SSR requests
 * @returns {IAuthenticationState}
 */
export function getInitialState() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const sessionId = getSessionId();
    return {
        accessToken: ((_b = (_a = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.accessToken) || process.env.accessToken,
        customerId: ((_d = (_c = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _c === void 0 ? void 0 : _c.appConfig) === null || _d === void 0 ? void 0 : _d.customerId) || process.env.customerId,
        deviceId: getDeviceId(sessionId),
        sessionId,
        // @ts-ignore
        displayLanguageId: (_f = (_e = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _e === void 0 ? void 0 : _e.appConfig) === null || _f === void 0 ? void 0 : _f.displayLanguage,
        // @ts-ignore
        currencyOfPreference: (_h = (_g = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _g === void 0 ? void 0 : _g.appConfig) === null || _h === void 0 ? void 0 : _h.currencyOfPreference,
        deviceType: ((_k = (_j = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _j === void 0 ? void 0 : _j.appConfig) === null || _k === void 0 ? void 0 : _k.deviceType) || process.env.deviceType || 'A16ZV8BU3SN1N3',
        marketplaceId: ((_m = (_l = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _l === void 0 ? void 0 : _l.appConfig) === null || _m === void 0 ? void 0 : _m.marketplaceId) || process.env.marketplaceId,
        expiresAt: getExpirationTimestamp(
        // @ts-ignore
        ((_p = (_o = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _o === void 0 ? void 0 : _o.appConfig) === null || _p === void 0 ? void 0 : _p.accessTokenExpiresIn) || process.env.expiresAt || 0),
        // @ts-ignore
        metricsContext: (_r = (_q = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _q === void 0 ? void 0 : _q.appConfig) === null || _r === void 0 ? void 0 : _r.metricsContext,
        csrf: (_t = (_s = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _s === void 0 ? void 0 : _s.appConfig) === null || _t === void 0 ? void 0 : _t.csrf,
        // @ts-ignore
        isCirrusAuthExpired: (_v = (_u = window === null || window === void 0 ? void 0 : window.amznMusic) === null || _u === void 0 ? void 0 : _u.appConfig) === null || _v === void 0 ? void 0 : _v.isCirrusAuthExpired,
    };
}
function setAuthenticationMethod(state, action) {
    const { accessToken, expiresAt } = action.payload;
    return Object.assign(Object.assign({}, state), { accessToken, expiresAt });
}
export function AuthenticationReducer(state = getInitialState(), action) {
    switch (action.type) {
        case SET_AUTHENTICATION_METHOD:
            return setAuthenticationMethod(state, action);
        case SET_CSRF:
            return Object.assign(Object.assign({}, state), { csrf: action.payload.csrf });
        case SET_DISPLAY_LANGUAGE:
            return Object.assign(Object.assign({}, state), { displayLanguageId: action.payload.displayLanguageId });
        case SET_VIDEO_PLAYER_TOKEN:
            return Object.assign(Object.assign({}, state), { videoPlayerToken: action.payload });
        default:
            return state;
    }
}
