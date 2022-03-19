import { enqueueSkyfireMethod, NETWORK_CONNECTIVITY_CHANGE } from '../actions';
export function handleNetworkConnectivityLost(store, owner) {
    store
        .getState()
        .AppEvents.onNetworkConnectivityLost.forEach((responseMethod) => {
        store.dispatch(enqueueSkyfireMethod({
            queue: responseMethod.queue,
            method: Object.assign(Object.assign({}, responseMethod), { owner }),
        }));
    });
    store.dispatch({
        payload: { hasNetworkConnectivity: false },
        type: NETWORK_CONNECTIVITY_CHANGE,
    });
}
export function handleNetworkConnectivityRecovered(store, owner) {
    store
        .getState()
        .AppEvents.onNetworkConnectivityRecovered.forEach((responseMethod) => {
        store.dispatch(enqueueSkyfireMethod({
            queue: responseMethod.queue,
            method: Object.assign(Object.assign({}, responseMethod), { owner }),
        }));
    });
    store.dispatch({
        payload: { hasNetworkConnectivity: true },
        type: NETWORK_CONNECTIVITY_CHANGE,
    });
}
