import { globals } from '../utils';
// Polyfill for IE11 and Edge URLSearchParams
export function getParameterByName(name, url) {
    const parsedName = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
export function getSkyfireEnvironment() {
    var _a;
    const region = globals.amznMusic.appConfig.siteRegion
        ? globals.amznMusic.appConfig.siteRegion.toLowerCase()
        : 'na';
    const integ = `https://dev-${region}.mesk.skill.music.a2z.com`;
    const gamma = `https://qa-${region}.mesk.skill.music.a2z.com`;
    const prod = `https://${region}.mesk.skill.music.a2z.com`;
    const SKYFIRE_ENVIRONMENTS = {
        local: 'https://mp3localhost.amazon.com:4000',
        // @ts-ignore
        devDesktop: ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.devDesktop) || '',
        integ,
        gamma,
        dev: integ,
        qa: gamma,
        prod,
    };
    const DEFAULT_SKYFIRE_ENVIRONMENT_NAME = 'prod';
    const paramSkyfireEnvName = getParameterByName('skyfireEnv', globals.location.href);
    const skyfireEnvironmentName = paramSkyfireEnvName || DEFAULT_SKYFIRE_ENVIRONMENT_NAME;
    return SKYFIRE_ENVIRONMENTS[skyfireEnvironmentName.toLowerCase()];
}
