import { SET_AUDIO_QUALITY, INITIATE_AUDIO_SETTING, UPDATE_ABR_SETTING, } from '../actions';
export const initialState = {
    audioQuality: 'STANDARD',
    enableABR: true,
    enableFlacOpus: false,
};
export function SettingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUDIO_QUALITY:
            return Object.assign(Object.assign({}, state), { audioQuality: action.payload.audioQuality });
        case UPDATE_ABR_SETTING:
            return Object.assign(Object.assign({}, state), { enableABR: action.payload.enableABR });
        case INITIATE_AUDIO_SETTING:
            return Object.assign(Object.assign({}, state), { audioQuality: action.payload.audioQuality, enableABR: action.payload.enableABR, enableFlacOpus: action.payload.enableFlacOpus });
        default:
            return state;
    }
}
