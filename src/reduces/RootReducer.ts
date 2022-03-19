import { combineReducers } from 'redux';
import { LocalHydrationReducer, PodcastStateReducer, } from 'dm-podcast-web-player';
import { AppEventsReducer } from './AppEventsReducer';
import { AuthenticationReducer } from './AuthenticationReducer';
import { BrowserReducer } from './BrowserReducer';
import { ContentViewedInfoReducer } from './ContentViewedInfoReducer';
import { ContextMenuReducer } from './ContextMenuReducer';
import { DialogReducer } from './DialogReducer';
import { InteractionReducer } from './InteractionReducer';
import { LyricsViewedReducer } from './LyricsViewedReducer';
import { PlaylistRecommendationsReducer, } from './PlaylistRecommendationsReducer';
import { MediaReducer } from './MediaReducer';
import { PlaybackActionsReducer } from './PlaybackActionsReducer';
import { PlaybackEventsReducer } from './PlaybackEventsReducer';
import { PlaybackStatesReducer } from './PlaybackStatesReducer';
import { PreviousPlaybackStateReducer, } from './PreviousPlaybackStateReducer';
import { PlaybackPerformanceReducer, } from './PlaybackPerformanceReducer';
import { RibbonReducer } from './RibbonReducer';
import { ScrubInfoReducer } from './ScrubInfoReducer';
import { SearchSuggestionsReducer } from './SearchSuggestionsReducer';
import { SettingReducer } from './SettingReducer';
import { SkyfireMethodQueueReducer } from './SkyfireMethodQueueReducer';
import { SoftRefreshReducer } from './SoftRefreshReducer';
import { StorageReducer } from './StorageReducer';
import { TemplateStackReducer } from './TemplateStackReducer';
import { TerminationTimestampReducer, } from './TerminationTimestampReducer';
import { ToastReducer } from './ToastReducer';
import { TooltipReducer } from './TooltipReducer';
import { TransportOverlayReducer } from './TransportOverlayReducer';
import { ActivityFeedReducer } from './ActivityFeedReducer';
import { VideoNPVStateReducer } from './VideoNPVStateReducer';
import { MShopReducer } from './MShopReducer';
export const RootReducer = combineReducers({
    AppEvents: AppEventsReducer,
    Authentication: AuthenticationReducer,
    Dialog: DialogReducer,
    ContextMenu: ContextMenuReducer,
    Media: MediaReducer,
    InteractionState: InteractionReducer,
    PlaybackActions: PlaybackActionsReducer,
    PlaybackEvents: PlaybackEventsReducer,
    PlaybackStates: PlaybackStatesReducer,
    PlaybackPerformance: PlaybackPerformanceReducer,
    SkyfireMethodQueue: SkyfireMethodQueueReducer,
    Storage: StorageReducer,
    TemplateStack: TemplateStackReducer,
    SearchSuggestions: SearchSuggestionsReducer,
    LyricsViewed: LyricsViewedReducer,
    BrowserState: BrowserReducer,
    Ribbon: RibbonReducer,
    Toast: ToastReducer,
    Tooltip: TooltipReducer,
    ScrubInfo: ScrubInfoReducer,
    SoftRefresh: SoftRefreshReducer,
    TransportOverlay: TransportOverlayReducer,
    LocalHydrationState: LocalHydrationReducer,
    PodcastState: PodcastStateReducer,
    PreviousPlaybackState: PreviousPlaybackStateReducer,
    TerminationTimestamp: TerminationTimestampReducer,
    ActivityFeed: ActivityFeedReducer,
    VideoNPVState: VideoNPVStateReducer,
    ContentViewedInfo: ContentViewedInfoReducer,
    PlaylistRecommendations: PlaylistRecommendationsReducer,
    MShop: MShopReducer,
    Setting: SettingReducer,
});
