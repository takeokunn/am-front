export const BUFFER = 'PlaybackInterface.v1_0.BufferMediaMethod';
export const PLAY = 'PlaybackInterface.v1_0.PlayMediaMethod';
export const CLEAR = 'PlaybackInterface.v1_0.ClearMediaMethod';
export const SET_NOW_PLAYING = 'PlaybackInterface.v1_0.SetNowPlayingMethod';
export const PLAY_NEXT = 'PlaybackInterface.v1_0.PlayNextMediaMethod';
export const PLAY_PREVIOUS = 'PlaybackInterface.v1_0.PlayPreviousMediaMethod';
export const SHUFFLE_ON = 'PlaybackInterface.v1_0.ShuffleOnMethod';
export const SHUFFLE_OFF = 'PlaybackInterface.v1_0.ShuffleOffMethod';
export const THUMBS_UP = 'PlaybackInterface.v1_0.ThumbsUpMethod';
export const THUMBS_DOWN = 'PlaybackInterface.v1_0.ThumbsDownMethod';
export const UNDO_THUMBS_UP = 'PlaybackInterface.v1_0.UndoThumbsUpMethod';
export const UNDO_THUMBS_DOWN = 'PlaybackInterface.v1_0.UndoThumbsDownMethod';
export const REMOVE_FROM_QUEUE = 'PlaybackInterface.v1_0.RemoveFromQueueMethod';
export const REORDER = 'PlaybackInterface.v1_0.ReorderMediaMethod';
export const REPEAT_ALL = 'PlaybackInterface.v1_0.RepeatAllMethod';
export const REPEAT_ONE = 'PlaybackInterface.v1_0.RepeatOneMethod';
export const REPEAT_OFF = 'PlaybackInterface.v1_0.RepeatOffMethod';
export const UPDATE_TRANSPORT_ITEMS = 'PlaybackInterface.v1_0.UpdateTransportItemsMethod';
export const SET_MEDIA = 'PlaybackInterface.v1_0.SetMediaMethod';
export const SET_WEB_MEDIA = 'Web.PlaybackInterface.v1_0.WebSetMediaMethod';
export const SET_BACKGROUND_IMAGE = 'PlaybackInterface.v1_0.SetBackgroundImageMethod';
export const SET_LYRICS = 'PlaybackInterface.v1_0.SetLyricsMethod';
export const SET_PLAY_QUEUE_CONTROL = 'Web.PlaybackInterface.v1_0.SetVisualPlayQueueControlStateMethod';
export const SET_PLAY_QUEUE_DATA = 'Web.PlaybackInterface.v1_0.SetVisualPlayQueueDataMethod';
export const ADD_PLAY_QUEUE_DATA = 'Web.PlaybackInterface.v1_0.AddToVisualPlayQueueMethod';
export const INVALIDATE_PLAY_QUEUE = 'Web.PlaybackInterface.v1_0.InvalidateVisualPlayQueueMethod';
export const SET_ACTIVE_QUEUES_DATA = 'Web.PlaybackInterface.v1_0.SetActiveQueuesDataMethod';
export const UNLOCK_AUDIO = 'Web.PlaybackInterface.v1_0.UnlockAudioMethod';
export const SET_VOLUME = 'PlaybackInterface.v1_0.SetVolumeMethod';
export const CHANGE_VOLUME = 'CHANGE_VOLUME';
export const SET_STREAMING_BADGE = 'SET_STREAMING_BADGE';
export const SET_STREAMING_INFO = 'SET_STREAMING_INFO';
export const TRIGGER_PLAY_QUEUE = 'TRIGGER_PLAY_QUEUE';
export const TRIGGER_ACTIVE_QUEUES = 'TRIGGER_ACTIVE_QUEUES';
export const AWAIT_PLAY_QUEUE = 'AWAIT_PLAY_QUEUE';
export const UPDATE_SCRUB_INFO = 'UPDATE_SCRUB_INFO';
export const CLEAR_TERMINATION_TIMESTAMP = 'CLEAR_TERMINATION_TIMESTAMP';
export const SET_TERMINATION_TIMESTAMP = 'SET_TERMINATION_TIMESTAMP';
export const SET_PREVIOUS_PLAYBACK_STATE = 'SET_PREVIOUS_PLAYBACK_STATE';
export const INIT_TRACK_PERFORMANCE_DATA = 'INIT_TRACK_PERFORMANCE_DATA';
export const UPDATE_TRACK_PERFORMANCE_DATA = 'UPDATE_TRACK_PERFORMANCE_DATA';
export const UPDATE_PLAYBACK_SESSION_PERFORMANCE_DATA = 'UPDATE_PLAYBACK_SESSION_PERFORMANCE_DATA';
export const READY = 'PLAYBACK_READY';
export const STARTED = 'PLAYBACK_STARTED';
export const RESUMED = 'PlaybackInterface.v1_0.ResumeMediaMethod';
export const SCRUBBED = 'PLAYBACK_SCRUBBED';
export const PAUSED = 'PlaybackInterface.v1_0.PauseMediaMethod';
export const ENDED = 'PLAYBACK_ENDED';
export const STOPPED = 'PLAYBACK_STOPPED';
export const BUFFERING = 'PLAYBACK_BUFFERING';
export const REBUFFERED = 'PLAYBACK_REBUFFERED';
export const ERROR = 'PLAYBACK_ERROR';
export const PLAYBACK_TOGGLE = 'PLAYBACK_TOGGLE';
export const PLAYBACK_NOT_SUPPORTED = 'PLAYBACK_NOT_SUPPORTED';
export const PLAY_VIDEO = 'VideoPlaybackInterface.v1_0.PlayVideoMediaMethod';
export const SET_VIDEO_MEDIA = 'VideoPlaybackInterface.v1_0.SetVideoMediaMethod';
export const CLEAR_VIDEO = 'VideoPlaybackInterface.v1_0.ClearVideoMediaMethod';
export const SHOW_VIDEO_CONTROL = 'SHOW_VIDEO_CONTROL';
export const HIDE_VIDEO_CONTROL = 'HIDE_VIDEO_CONTROL';
export function initTrackPerformanceData(uri, playbackRequestedTime, isAudioPlayerColdstart, isEMECheckColdstart) {
    return {
        type: INIT_TRACK_PERFORMANCE_DATA,
        payload: { uri, playbackRequestedTime, isAudioPlayerColdstart, isEMECheckColdstart },
    };
}
export function updateTrackPerformanceData(id, data) {
    return { type: UPDATE_TRACK_PERFORMANCE_DATA, payload: { id, data } };
}
export function updatePlaybackSessionPerformanceData(data) {
    return { type: UPDATE_PLAYBACK_SESSION_PERFORMANCE_DATA, payload: { data } };
}
