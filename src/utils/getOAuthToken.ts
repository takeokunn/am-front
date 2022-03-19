import { globals } from '.';
import { isRetailPlayerRequest } from './retailPlayerHelper';
export function getExpirationTimestamp(expiresIn) {
    return Date.now() + +expiresIn * 1000;
}
// Ignore this function for test coverage purposes for now
/* istanbul ignore next */
export async function getOAuthToken() {
    var _a, _b;
    try {
        const deviceType = ((_b = (_a = globals === null || globals === void 0 ? void 0 : globals.amznMusic) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.deviceType) || process.env.deviceType;
        let deviceTypeParam = '';
        if (deviceType) {
            deviceTypeParam = `?deviceType=${deviceType}`;
        }
        const response = await globals.fetch(getPandaServiceEndPoints(deviceTypeParam), {
            method: 'get',
        });
        const json = await response.json();
        if (json.error) {
            return { accessToken: '', expiresAt: Date.now() + 900 };
        }
        return {
            accessToken: json.accessToken,
            expiresAt: getExpirationTimestamp(json.expiresIn),
        };
    }
    catch (e) {
        // Default to empty token if error, will show bourne experience
        return { accessToken: '', expiresAt: Date.now() + 900 };
    }
}
function getPandaServiceEndPoints(deviceTypeParam) {
    if (isRetailPlayerRequest(globals.location.hostname)) {
        return `/music/player/pandaToken${deviceTypeParam}`;
    }
    return `/horizonte/pandaToken${deviceTypeParam}`;
}
