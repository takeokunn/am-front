import { getDefaultLanguage } from './getDefaultLanguage';
import { globals } from './globals';
import { DEVICE_TYPES_ENUM_FEEDBACK_DIALOG } from './deviceTypes';
const HEARTBEAT_ENDPOINT = 'digprjsurvey.amazon.';
const HEARTBEAT_ENDPOINT_NA = `${HEARTBEAT_ENDPOINT}com`;
const HEARTBEAT_ENDPOINT_EU = `${HEARTBEAT_ENDPOINT}eu`;
const HEARTBEAT_ENDPOINT_JP = `${HEARTBEAT_ENDPOINT}co.jp`;
function getHeartbeatEndpoint(siteRegion) {
    let endpoint = HEARTBEAT_ENDPOINT_NA;
    if (siteRegion === 'eu') {
        endpoint = HEARTBEAT_ENDPOINT_EU;
    }
    else if (siteRegion === 'fe') {
        endpoint = HEARTBEAT_ENDPOINT_JP;
    }
    return endpoint;
}
export async function sendFeedback(feedback, operatingSystem, browser) {
    const { marketplaceId, customerId, musicTerritory, siteRegion, deviceType, } = globals.amznMusic.appConfig;
    const deviceTypeName = DEVICE_TYPES_ENUM_FEEDBACK_DIALOG[deviceType];
    const params = {
        marketplace: marketplaceId,
        language: getDefaultLanguage(marketplaceId),
        customerId,
        userAgentString: globals.navigator.userAgent,
        playerType: deviceTypeName === undefined ? 'SKYFIRE' : deviceTypeName,
        sourceURL: globals.location.href,
        feedbackText: feedback,
        browser,
        operatingSystem,
        regionName: musicTerritory,
        serviceName: 'AmazonMusicWebPlayer',
        clientName: 'AmazonMusicWebPlayerFeedback',
    };
    const endpoint = getHeartbeatEndpoint(siteRegion);
    const url = `https://${endpoint}/api/feedbacks/AmazonMusicWebPlayer/AmazonMusicWebPlayerFeedback`;
    const requestParams = {
        // Format the body as url query string params
        body: Object.entries(params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&'),
        dataType: 'JSON',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    try {
        await globals.fetch(url, requestParams);
        return true;
    }
    catch (e) {
        return false;
    }
}
