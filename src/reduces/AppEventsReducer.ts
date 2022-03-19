import { NETWORK_CONNECTIVITY_CHANGE, SET_APP_EVENTS, } from '../actions/AppEvents';
const initialState = {
    onNetworkConnectivityLost: [],
    onNetworkConnectivityRecovered: [],
    hasNetworkConnectivity: true,
};
const reducer = {
    [SET_APP_EVENTS]: (state, action) => (Object.assign(Object.assign({}, state), { onNetworkConnectivityLost: action.payload.onNetworkConnectivityLost, onNetworkConnectivityRecovered: action.payload.onNetworkConnectivityRecovered })),
    [NETWORK_CONNECTIVITY_CHANGE]: (state, action) => (Object.assign(Object.assign({}, state), { hasNetworkConnectivity: action.payload.hasNetworkConnectivity })),
};
export function AppEventsReducer(state = initialState, action) {
    if (reducer[action.type]) {
        return reducer[action.type](state, action);
    }
    return state;
}
