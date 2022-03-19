import { globals } from '../utils';
let instancePromise;
let semaphore = false;
export async function getInstance() {
    if (!instancePromise && !semaphore) {
        if (!globals.amznMusic.appConfig.isStarlightEnabled ||
            // We don't want to load the player for anonymous customers to improve SEO
            // https://issues.amazon.com/issues/STARLIGHT-WEBPLAYER-228
            !globals.amznMusic.appConfig.accessToken) {
            throw new Error('Starlight not enabled');
        }
        const Theatre = await import(
        /* webpackChunkName: "theatre" */
        '@amzn/Theatrejs');
        const videoPlaybackContainer = document.getElementById('videoPlaybackContainer');
        const rootContainer = document.getElementById('root');
        instancePromise =
            instancePromise ||
                Theatre.Player.create({
                    clientId: '6163f72e-ebf6-45a9-81b3-cc155c38039c',
                    route: 'q321d2vicz2ra0',
                    container: videoPlaybackContainer,
                    fullscreenContainer: rootContainer,
                    displayLanguage: globals.amznMusic.appConfig.displayLanguage || 'en_US',
                    debug: location.host.indexOf('mp3localhost') === 0 ||
                        (URLSearchParams &&
                            new URLSearchParams(location.search).get('debugVideo') === 'true'),
                    marketplaceId: globals.amznMusic.appConfig.marketplaceId || process.env.marketplaceId,
                    accessToken: globals.amznMusic.appConfig.accessToken,
                });
    }
    semaphore = true;
    return instancePromise;
}
