import { globals } from '.';
let semaphore = false;
let httpcon;
export async function getCSRF(authentication) {
    var _a;
    if ((_a = authentication === null || authentication === void 0 ? void 0 : authentication.csrf) === null || _a === void 0 ? void 0 : _a.token) {
        return getCSRFTokenString(authentication.csrf);
    }
    const { csrfTokenString } = await getHttpcon();
    return csrfTokenString;
}
export async function getDeviceId(authentication) {
    if (globals.window.location.host === 'mp3localhost.amazon.com:4000') {
        const { deviceId } = await getHttpcon();
        return deviceId || authentication.sessionId;
    }
    return authentication.deviceId;
}
export async function getHttpcon() {
    if (!httpcon && !semaphore) {
        const response = await globals.fetch('/horizonte/sample/httpcon', {
            method: 'get',
        });
        const responseJson = await response.json();
        const { csrf_token, csrf_ts, csrf_rnd } = responseJson.CSRFTokenConfig;
        const { deviceId } = responseJson;
        const csrf = {
            token: csrf_token,
            ts: csrf_ts,
            rnd: csrf_rnd,
        };
        httpcon = {
            csrfTokenString: getCSRFTokenString(csrf),
            deviceId,
        };
    }
    semaphore = true;
    return httpcon;
}
function getCSRFTokenString(csrf) {
    return `{
            "interface": "CSRFInterface.v1_0.CSRFHeaderElement",
            "token": "${csrf.token}",
            "timestamp": "${csrf.ts}",
            "rndNonce": "${csrf.rnd}"
        }`.replace(/\s/g, '');
}
