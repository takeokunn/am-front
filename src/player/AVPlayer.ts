export default class AVPlayer {
    constructor(audioPlayerLoaderMethod, videoPlayerLoaderMethod) {
        this._listeners = this.getDefaultListeners();
        this._listenersHandler = this.getEventsHandler();
        this.loadCurrentPlayer = async () => {
            if (this.isVideoPlaying()) {
                this.initiateVideoPlayerLoading();
                await this._videoPlayerLoader;
                return;
            }
            // Audio Player is already loaded as part of initialization
            await this._audioPlayerLoader;
        };
        this.setMediaType = (mediaType) => {
            this._mediaType = mediaType;
        };
        this.unload = () => {
            var _a, _b;
            if (this.isVideoPlaying()) {
                (_a = this._videoPlayer) === null || _a === void 0 ? void 0 : _a.unload();
            }
            else {
                (_b = this._audioPlayer) === null || _b === void 0 ? void 0 : _b.pause();
            }
        };
        this.isVideoPlaying = () => this._mediaType === 'VIDEO';
        this.isAudioPlaying = () => !this.isVideoPlaying();
        this.setAudioPlayerConfig = (config) => {
            var _a;
            (_a = this._audioPlayer) === null || _a === void 0 ? void 0 : _a.setConfig(config);
        };
        this.setVideoPlayerConfig = (config) => {
            var _a;
            (_a = this._videoPlayer) === null || _a === void 0 ? void 0 : _a.setConfig(config);
        };
        this.addEventListener = (eventName, callback) => {
            if (this._listeners[eventName]) {
                this._listeners[eventName].push(callback);
            }
        };
        this.removeEventListener = (eventName, callback) => {
            if (this._listeners[eventName]) {
                this._listeners[eventName].splice(this._listeners[eventName].indexOf(callback), 1);
            }
        };
        this.load = (playbackUri, ...args) => {
            var _a, _b, _c;
            if (!this.currentPlayer) {
                throw new Error();
            }
            // stop other player, when new playback initiated
            if (this.isVideoPlaying()) {
                (_a = this._audioPlayer) === null || _a === void 0 ? void 0 : _a.pause();
            }
            else {
                (_b = this._videoPlayer) === null || _b === void 0 ? void 0 : _b.unload();
            }
            return (_c = this.currentPlayer) === null || _c === void 0 ? void 0 : _c.load(playbackUri, ...args);
        };
        this.getCurrentTrackId = () => { var _a; return (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getCurrentTrackId(); };
        this.play = (mediaId, ...args) => {
            var _a;
            (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.play(mediaId, ...args);
        };
        this.pause = () => {
            var _a;
            (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.pause();
        };
        this.resume = () => {
            var _a;
            (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.resume();
        };
        this.isPlaying = () => { var _a; return ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.isPlaying()) || false; };
        this.isPaused = () => {
            if (this.currentPlayer) {
                return this.currentPlayer.isPaused();
            }
            // Player is pause if currentPlayer does not exist
            return true;
        };
        this.getDuration = () => { var _a; return ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getDuration()) || 0; };
        this.getCurrentTime = () => { var _a; return ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getCurrentTime()) || 0; };
        this.getBufferedTime = () => { var _a; return ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getBufferedTime()) || 0; };
        this.getVolume = () => { var _a; return ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getVolume()) || 0; };
        this.getConfig = () => { var _a; return (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.getConfig(); };
        this.getAudioPlayerLoadLatency = () => this._audioPlayerLoadLatency;
        this.reload = () => {
            var _a, _b;
            if (this.isVideoPlaying()) {
                (_a = this._videoPlayer) === null || _a === void 0 ? void 0 : _a.reload();
            }
            else {
                (_b = this._audioPlayer) === null || _b === void 0 ? void 0 : _b.seekTo(0);
            }
        };
        // in seconds
        this.seekTo = async (position) => {
            var _a;
            (_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.seekTo(position);
        };
        this.volume = async (volume) => {
            var _a, _b;
            if (this.isVideoPlaying()) {
                await this._videoPlayerLoader;
            }
            (_a = this._audioPlayer) === null || _a === void 0 ? void 0 : _a.volume(volume);
            (_b = this._videoPlayer) === null || _b === void 0 ? void 0 : _b.volume(volume);
        };
        this._audioPlayerLoaderMethod = audioPlayerLoaderMethod;
        this._videoPlayerLoaderMethod = videoPlayerLoaderMethod;
        this.initiateAudioPlayerLoading();
    }
    initiateAudioPlayerLoading() {
        if (!this._audioPlayerLoader) {
            const t0 = window.performance.now();
            this._audioPlayerLoader = this._audioPlayerLoaderMethod()
                .then((player) => {
                const t1 = window.performance.now();
                this._audioPlayer = player;
                this._audioPlayerLoadLatency = t1 - t0;
                this.attachListeners(this._audioPlayer);
                return player;
            })
                .catch(() => undefined);
        }
    }
    initiateVideoPlayerLoading() {
        if (!this._videoPlayerLoader) {
            this._videoPlayerLoader = this._videoPlayerLoaderMethod()
                .then((player) => {
                this._videoPlayer = player;
                this.attachListeners(this._videoPlayer);
                return player;
            })
                .catch(() => undefined);
        }
    }
    getAudioPlayer() {
        return this._audioPlayer;
    }
    getVideoPlayer() {
        return this._videoPlayer;
    }
    get currentPlayer() {
        if (this.isVideoPlaying()) {
            return this._videoPlayer;
        }
        return this._audioPlayer;
    }
    attachListeners(player) {
        Object.keys(this._listeners).forEach((eventName) => {
            player.addEventListener(eventName, this._listenersHandler[eventName]);
        });
    }
    detachListeners(player) {
        Object.keys(this._listeners).forEach((eventName) => {
            player.removeEventListener(eventName, this._listenersHandler[eventName]);
        });
    }
    getEventsHandler() {
        const getEventHander = (eventName) => (...args) => {
            this._listeners[eventName].forEach((callback) => callback(...args));
        };
        return Object.keys(this._listeners).reduce((initial, eventName) => {
            // eslint-disable-next-line no-param-reassign
            initial[eventName] = getEventHander(eventName);
            return initial;
        }, {});
    }
    getDefaultListeners() {
        return {
            timeupdate: [],
            buffertime: [],
            started: [],
            ended: [],
            error: [],
            stalled: [],
            close: [],
            playpause: [],
            playbackqualitychange: [],
            canplay: [],
        };
    }
}
