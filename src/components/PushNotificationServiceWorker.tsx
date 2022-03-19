import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { UAParser } from 'ua-parser-js';
import { globals } from '../utils';
import { getDefaultLanguage } from '../utils/getDefaultLanguage';
import { reportFlexEvent } from '../utils/reportFlexEvent';
const { amznMusic, navigator, window } = globals;
const applicationServerKey = 'BKaX_mn_7k7PEM4epfTKXnR4hIGzMYpb8H06Efc4CyMAr2kvEUhGmJINfFtH_hrfn9TZoUoGCBWvwnKbRxnKHFw';
const ServiceWorkerPath = '/PushServiceWorker.js';
const ua = new UAParser(navigator.userAgent);
const os = ua.getOS();
const browser = ua.getBrowser();
const device = ua.getDevice();
const PushNotificationEvents = {
    pushNotificationOpened: 'push.campaign.notification_opened',
    pushNotificationDisplayed: 'push.campaign.posted_notification',
    pushNotificationErrored: 'push.campaign.errored',
    pushNotificationClosed: 'push.campaign.closed',
    pushInitializationRequested: 'push.initialization.requested',
    pushInitializationSucceeded: 'push.initialization.succeeded',
    pushInitializationErrored: 'push.initialization.errored',
    pushInitializationDenied: 'push.initialization.denied',
    pushInitializationDismissed: 'push.initialization.dismissed',
};
const prodDomains = ['music.amazon.com'];
const allowlistedDomains = prodDomains
    .map((domain) => `https://${domain}`)
    .concat([
    'https://music-integ-iad.iad.proxy.amazon.com',
    'https://music-gamma.amazon.com',
    'https://mp3localhost.amazon.com',
]);
/**
 * Returns the endpoint registration URL
 * @param region
 */
function getRegistrationEndpoint(region) {
    const regionTable = {
        NA: 'https://yplbec8hd1.execute-api.us-east-1.amazonaws.com/beta/registerEndpoint',
    };
    const prodRegionTable = {
        NA: 'https://m42pv1bdze.execute-api.us-east-1.amazonaws.com/prod/registerEndpoint',
    };
    const defaultRegion = 'NA';
    const currentUrl = new URL(window.location.href);
    if (prodDomains.includes(currentUrl.hostname)) {
        return prodRegionTable[region] || prodRegionTable[defaultRegion];
    }
    return regionTable[region] || regionTable[defaultRegion];
}
export default function PushNotificationServiceWorker() {
    const auth = useSelector((state) => state.Authentication);
    const { customerId, deviceId, deviceType, marketplaceId } = auth;
    useEffect(() => {
        registerServiceWorkerIfAllowed();
        handleServiceWorkerMessages();
    }, []);
    return null;
    /**
     * For signed-in sessions, register/update service worker if permission is already granted.
     * Only allow on Chrome on desktop.
     */
    function registerServiceWorkerIfAllowed() {
        if (!customerId) {
            return;
        }
        if ('Notification' in window) {
            if (Notification.permission === 'granted' &&
                browser.name === 'Chrome' &&
                device.type === undefined) {
                registerWithoutPermission();
            }
        }
    }
    /**
     * Register/update service worker without asking for permission,
     * then subscribes to push notifications.
     */
    async function registerWithoutPermission() {
        if (!('serviceWorker' in navigator)) {
            return;
        }
        try {
            await navigator.serviceWorker.register(ServiceWorkerPath, { scope: '/' });
            subscribeToPush();
        }
        catch (error) {
            reportPushNotificationEvent({
                eventType: PushNotificationEvents.pushInitializationErrored,
                errorMessage: `Error with registering service worker without permission: ${error}`,
            });
        }
    }
    /**
     * Subscribes registered service worker to push notifications
     * @param fromDialog - if subscribe is called from a dialog prompting notification permissions
     */
    async function subscribeToPush() {
        if (!('PushManager' in window)) {
            return;
        }
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        try {
            const pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });
            sendRegistrationToAPI(pushSubscription);
        }
        catch (error) {
            reportPushNotificationEvent({
                eventType: PushNotificationEvents.pushInitializationErrored,
                errorMessage: `Error with subscribing service worker: ${error}`,
            });
        }
    }
    /**
     * Sends push subscription to API that registers it as an endpoint in Pinpoint
     * @param pushSubscription - PushSubscription to send
     */
    async function sendRegistrationToAPI(pushSubscription) {
        const registrationEndpointURL = getRegistrationEndpoint(amznMusic.appConfig.musicTerritory);
        try {
            const response = await window.fetch(registrationEndpointURL, {
                method: 'POST',
                body: JSON.stringify({
                    subscription: pushSubscription,
                    customerId,
                    deviceId,
                    deviceType,
                    locale: getDefaultLanguage(marketplaceId),
                    browserName: browser.name,
                    browserVersion: browser.major,
                    os: os.name,
                }),
            });
            if (response.ok === false) {
                reportPushNotificationEvent({
                    eventType: PushNotificationEvents.pushInitializationErrored,
                    errorMessage: `Error registrationEndpointURL returned ${response.status}: ${response.statusText}`,
                });
            }
            return response.ok;
        }
        catch (error) {
            reportPushNotificationEvent({
                eventType: PushNotificationEvents.pushInitializationErrored,
                errorMessage: `Fetch on registrationEndpointURL failed: ${error}`,
            });
            return false;
        }
    }
    /**
     * Handle events coming from the service worker
     */
    function handleServiceWorkerMessages() {
        if (!('serviceWorker' in navigator)) {
            return;
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            const originURL = new URL(event.origin);
            if (!allowlistedDomains.includes(`${originURL.protocol}//${originURL.hostname}`)) {
                return;
            }
            try {
                const eventData = JSON.parse(event.data);
                const { campaignContent, campaignId, errorMessage, eventType, } = eventData.eventData;
                event.ports[0].postMessage(`Client received a ${eventType} event from service worker`);
                if (eventType === PushNotificationEvents.pushNotificationErrored) {
                    reportPushNotificationEvent({
                        eventType,
                        errorMessage,
                        campaignId,
                        campaignContent,
                    });
                }
                else if (Object.values(PushNotificationEvents).includes(eventType)) {
                    reportPushNotificationEvent({
                        eventType,
                        campaignId,
                        campaignContent,
                    });
                }
                else {
                    reportPushNotificationEvent({
                        eventType: PushNotificationEvents.pushNotificationErrored,
                        errorMessage: 'Error with parsing metrics event from Service Worker',
                        campaignId,
                        campaignContent,
                    });
                }
            }
            catch (error) {
                reportPushNotificationEvent({
                    eventType: PushNotificationEvents.pushNotificationErrored,
                    errorMessage: `Error with parsing data from Service Worker: ${error}`,
                });
            }
        });
    }
    function reportPushNotificationEvent({ eventType, errorMessage, campaignId, campaignContent, }) {
        const flxAttrs = [[], []];
        if (eventType.startsWith('push.campaign')) {
            flxAttrs[0].push(os.name, browser.major, campaignId || '');
        }
        else {
            flxAttrs[0].push(os.name, browser.name, browser.major);
        }
        if (errorMessage) {
            flxAttrs[0].push(errorMessage);
        }
        if (campaignContent) {
            flxAttrs[1].push(campaignContent);
        }
        reportFlexEvent(eventType, flxAttrs, auth);
    }
}
