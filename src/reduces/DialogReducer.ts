import { UPDATE_COLUMN_TEXT_INPUT, UPDATE_TEXT_INPUT, CHANGE_PROFILE_STATUS, UNLOCK_AUDIO_DIALOG_SHOWN, } from '../actions';
const initialState = {
    textInput: '',
    smsOrEmail: '',
    profileStatus: '',
    unlockAudioDialogShown: false,
};
export function DialogReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_TEXT_INPUT:
            return Object.assign(Object.assign({}, state), action.payload);
        case UPDATE_COLUMN_TEXT_INPUT:
            return Object.assign(Object.assign({}, state), { smsOrEmail: action.payload.smsOrEmail || '' });
        case CHANGE_PROFILE_STATUS:
            return Object.assign(Object.assign({}, state), { profileStatus: action.payload.profileStatus || '' });
        case UNLOCK_AUDIO_DIALOG_SHOWN:
            return Object.assign(Object.assign({}, state), { unlockAudioDialogShown: true });
        default:
            return state;
    }
}
