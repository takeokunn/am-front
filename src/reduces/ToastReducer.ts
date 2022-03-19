import { CLOSE_NOTIFICATION, SHOW_NOTIFICATION, } from '../actions/Notification';
import { NOTIFICATION_TOAST_TEMPLATE } from '../types/templates/notification';
export function ToastReducer(state = { toast: null }, action) {
    var _a;
    switch (action.type) {
        case SHOW_NOTIFICATION:
            if (action.payload.notification.interface === NOTIFICATION_TOAST_TEMPLATE) {
                const toast = action.payload.notification;
                return { toast };
            }
            return state;
        case CLOSE_NOTIFICATION:
            // @ts-ignore
            if (((_a = state.toast) === null || _a === void 0 ? void 0 : _a.id) === action.payload.id) {
                return { toast: null };
            }
            return state;
        default:
            return state;
    }
}
