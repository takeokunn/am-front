import { SET_STORAGE } from '../actions/Storage';
function mapReasonToAlert(reason, streamingQuality) {
    if (reason === 'BANDWIDTH')
        return 'NETWORK_CONDITIONS';
    if (reason === 'COMPATIBILITY')
        return 'UNSUPPORTED_BROWSER';
    if (reason === 'BEST') {
        return streamingQuality === 'DATA_SAVER' ? 'SETTINGS_DATA_SAVER' : 'SETTINGS_STANDARD';
    }
    return 'NONE';
}
export function setSfnAudioQuality(quality) {
    return {
        type: SET_STORAGE,
        payload: {
            group: 'AUDIO_QUALITY',
            key: 'sfn-quality',
            value: quality.trackType,
        },
    };
}
export function setSfnSignalFlowAlert(reason, streamingQuality) {
    return {
        type: SET_STORAGE,
        payload: {
            group: 'SIGNAL_FLOW_ALERT',
            key: 'sfn-signal-flow',
            value: mapReasonToAlert(reason, streamingQuality),
        },
    };
}
