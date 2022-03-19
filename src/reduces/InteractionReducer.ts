import { ALLOW_USER_SELECT, CLIENT_INTERACTION, PREVENT_USER_SELECT, } from '../actions';
const initialState = {
    timestamp: new Date().getTime(),
    preventUserSelect: false,
};
export function InteractionReducer(state = initialState, action) {
    switch (action.type) {
        case CLIENT_INTERACTION:
            return Object.assign(Object.assign({}, state), action.payload);
        case PREVENT_USER_SELECT:
            return Object.assign(Object.assign({}, state), { preventUserSelect: true });
        case ALLOW_USER_SELECT:
            return Object.assign(Object.assign({}, state), { preventUserSelect: false });
        default:
            return state;
    }
}
