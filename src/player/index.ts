import { globals } from '../utils';
import { getInstance as getAudioInstance } from './AudioPlayer';
import { getInstance as getVideoInstance } from './VideoPlayer';
import AVPlayer from './AVPlayer';
import { IAVPlayer, IAudioPlayer, IVideoPlayer } from './interface';
export { IAVPlayer, IAudioPlayer, IVideoPlayer, getAudioInstance, getVideoInstance };
let instance;
export async function getInstance() {
    if (!instance) {
        instance = new AVPlayer(getAudioInstance, getVideoInstance);
    }
    // Always return with loaded current Player, so that caller need not to worry about loading
    await instance.loadCurrentPlayer();
    return instance;
}
export function getInstanceSync() {
    return instance;
}
let isVideoPlaybackSupportedPromise;
export async function isVideoPlaybackSupported() {
    if (!isVideoPlaybackSupportedPromise) {
        const Theatre = await import(/* webpackChunkName: "theatre" */ '@amzn/Theatrejs');
        const result = Theatre === null || Theatre === void 0 ? void 0 : Theatre.Player.isPlaybackSupported(globals.navigator.userAgent);
        isVideoPlaybackSupportedPromise = result ? Promise.resolve() : Promise.reject();
    }
    return isVideoPlaybackSupportedPromise;
}
let isEMESupportedPromise;
export async function isEMESupported() {
    var _a;
    if (!isEMESupportedPromise) {
        const Orchestra = await import(/* webpackChunkName: "orchestra" */ '@amzn/Orchestrajs');
        const result = Orchestra === null || Orchestra === void 0 ? void 0 : Orchestra.Player.isEMESupported();
        const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
        const ua = new UAParser(globals.navigator.userAgent);
        const browser = ua.getBrowser();
        const os = ua.getOS();
        const drmInfo = Orchestra === null || Orchestra === void 0 ? void 0 : Orchestra.Player.getBrowserDrmInfo(browser.name, browser.major, os.name);
        if (drmInfo) {
            isEMESupportedPromise =
                isEMESupportedPromise ||
                    (Orchestra === null || Orchestra === void 0 ? void 0 : Orchestra.Player.isEMESupported(drmInfo.keySystem, (_a = drmInfo.supportedConfiguration) !== null && _a !== void 0 ? _a : []));
            return isEMESupportedPromise;
        }
        isEMESupportedPromise = result ? Promise.resolve() : Promise.reject();
    }
    return isEMESupportedPromise;
}
export const isEMESupportCheckComplete = () => !!isEMESupportedPromise;
export function setPlayerConfig(playerInst, auth, setting) {
    var _a;
    playerInst.setAudioPlayerConfig({
        customerId: `${auth.customerId}`,
        oAuthToken: `${auth.accessToken}`,
        deviceId: `${auth.deviceId}`,
        deviceTypeId: `${auth.deviceType}`,
        csrf: auth.csrf,
        ipAddress: `${globals.amznMusic.appConfig.ipAddress}`,
        streamingQuality: (setting === null || setting === void 0 ? void 0 : setting.audioQuality) || 'STANDARD',
        enableFlacOpus: (setting === null || setting === void 0 ? void 0 : setting.enableFlacOpus) || false,
        enableABR: setting === null || setting === void 0 ? void 0 : setting.enableABR, // undefined indicates using default abr behavior.
    });
    playerInst.setVideoPlayerConfig({
        videoPlayerToken: `${((_a = auth.videoPlayerToken) === null || _a === void 0 ? void 0 : _a.token) || ''}`,
        authToken: `${auth.accessToken}`,
    });
    const volume = globals.localStorage.getItem(`${auth.deviceId}_volume`);
    if (volume !== null) {
        playerInst.volume(+volume);
    }
}
window.maestro = {
    getInstance,
    getAudioInstance,
    getVideoInstance,
    isEMESupported,
    isVideoPlaybackSupported,
    setPlayerConfig,
};
