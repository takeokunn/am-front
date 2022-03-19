import { applyMiddleware, compose, createStore } from 'redux';
import { PodcastPlaybackMiddleware, AppSyncMiddleware, LocalHydrationMiddleware, } from 'dm-podcast-web-player';
import { globals } from '../utils';
import { SettingsMiddleware, BroadcasterMiddleware, LocalStorageMiddleware, MediaSessionMiddleware, NavigationMiddleware, PagePerformanceMiddleware, PlaybackEventsMiddleware, PlaybackMiddleware, ShareMiddleware, SkyfireMethodExecutionMiddleware, SkyfireMethodQueueMiddleware, SkyfireTemplateMiddleware, MultiSelectMiddleware, ActiveQueuesMiddleware, } from '../middlewares';
import { RootReducer } from '../reducers/RootReducer';
export default function configureStore(initialState = {}) {
    const composeEnhancers = globals.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? globals.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            name: 'DMWebPlayerSkyfire',
        })
        : compose;
    const store = createStore(RootReducer, initialState, composeEnhancers(applyMiddleware(SkyfireMethodQueueMiddleware, SkyfireMethodExecutionMiddleware, SkyfireTemplateMiddleware, PlaybackMiddleware, PlaybackEventsMiddleware, MediaSessionMiddleware, BroadcasterMiddleware, PagePerformanceMiddleware, NavigationMiddleware, LocalStorageMiddleware, ShareMiddleware, MultiSelectMiddleware, ActiveQueuesMiddleware, PodcastPlaybackMiddleware, AppSyncMiddleware, LocalHydrationMiddleware, SettingsMiddleware)));
    return store;
}
