// https://en.wikipedia.org/wiki/Semaphore_(programming)
import { globals } from '../utils';
let instance;
let semaphore = false;
export async function getInstance() {
    if (!instance && !semaphore) {
        const Orchestra = await import(
        /* webpackChunkName: "orchestra" */
        '@amzn/Orchestrajs');
        instance =
            instance ||
                new Orchestra.Player({
                    version: 1,
                    appVersion: globals.amznMusic.appConfig.version,
                    appName: 'WebCP',
                    hostname: globals.location.hostname +
                        (globals.location.port ? `:${globals.location.port}` : ''),
                    musicTerritory: globals.amznMusic.appConfig.musicTerritory,
                    clientId: 'WebCP',
                    customerId: Date.now(),
                    deviceTypeId: Date.now(),
                    deviceId: Date.now(),
                    tier: globals.amznMusic.appConfig.tier || process.env.tier,
                    marketplaceId: globals.amznMusic.appConfig.marketplaceId || process.env.marketplaceId,
                    flags: {
                        metrics: false,
                        broadcast: window.opener && true,
                    },
                    crossDomain: true,
                    withCredentials: true,
                    streamingQuality: 'STANDARD',
                    enableFlacOpus: false,
                    csrf: globals.amznMusic.appConfig.csrf,
                });
    }
    semaphore = true;
    return instance;
}
export function getInstanceSync() {
    return instance;
}
