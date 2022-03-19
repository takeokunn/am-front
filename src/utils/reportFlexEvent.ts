import { globals } from '../utils';
const FLEX_STR_MAX_LENGTH = 128;
export async function reportFlexEvent(flxName, flxAttrs, auth) {
    const MusicServices = await import(/* webpackChunkName: "metrics" */ '@amzn/MusicServices');
    const options = {
        hostname: globals.location.host,
        appVersion: globals.amznMusic.appConfig.version,
        musicTerritory: globals.amznMusic.appConfig.musicTerritory,
        oAuthToken: auth.accessToken,
        sessionId: auth.sessionId,
        deviceId: auth.deviceId,
        deviceType: auth.deviceType,
        csrf: globals.amznMusic.appConfig.csrf,
    };
    const metric = new MusicServices.metrics.FlexMetric(Object.assign({ flexEventName: flxName, strings: flxAttrs[0]
            .map((s) => s === null || s === void 0 ? void 0 : s.replace(' ', '').substr(0, FLEX_STR_MAX_LENGTH))
            .filter((s) => !!s), numbers: flxAttrs[1].map(Math.round) }, options));
    metric.additionalDetails.contentSubscriptionMode = globals.amznMusic.appConfig.tier;
    if (!options.deviceId && options.appVersion === 'local') {
        options.deviceId = options.sessionId;
    }
    return MusicServices.reportClientActions([metric], options);
}
