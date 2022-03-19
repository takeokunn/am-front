import { getLanguageDirection } from '../utils';
import { UPDATE_DISPLAY_LANGUAGE, SET_DISPLAY_LANGUAGE } from '../actions';
import { getInstance } from '../player';
export const SettingsMiddleware = (store) => (nextAction) => (action) => {
    var _a, _b;
    const auth = store.getState().Authentication;
    const { displayLanguageId } = auth;
    switch (action.type) {
        case UPDATE_DISPLAY_LANGUAGE:
            store.dispatch({ type: SET_DISPLAY_LANGUAGE, payload: action.payload });
            document.documentElement.lang = (_b = (_a = action.payload.displayLanguageId) === null || _a === void 0 ? void 0 : _a.substring(0, 2)) !== null && _b !== void 0 ? _b : '';
            document.documentElement.dir = getLanguageDirection();
            if (displayLanguageId !== action.payload.displayLanguageId) {
                getInstance().then((player) => {
                    var _a;
                    (_a = player === null || player === void 0 ? void 0 : player.getVideoPlayer()) === null || _a === void 0 ? void 0 : _a.changeDisplayLanguage(action.payload.displayLanguageId);
                });
            }
            break;
        default:
            break;
    }
    nextAction(action);
};
