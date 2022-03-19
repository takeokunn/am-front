import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';
import { cleanDeeplink } from './cleanDeeplink';
import { globals } from './globals';
const API_KEY = 'kKBs4MWoFralXnHIbbod07PXwe5OViOV3nAwoyyz';
const ENDPOINT = 'https://bd2c39tdfg.execute-api.us-east-1.amazonaws.com/default/WebPlayerClientMetrics';
// Metrics types
export const PlaybackPerformanceMetricType = 'playback-performance';
export const WebVitalsMetricType = 'web-vitals';
export const PagePerformanceMetricType = 'page-performance';
/**
 * Report client metrics to WebPlayerClientMetrics Lambda endpoint.
 *
 * @param metricType Metric type
 * @param metricData Metric data
 * @param auth Authentication
 * @returns true if fetch call was successful, false otherwise
 */
export async function reportClientMetric(metricType, metricData, auth) {
    const { appConfig } = globals.amznMusic;
    if (!appConfig.isClientMetricsLambdaEnabled)
        return false;
    const defaultPayload = {
        hostname: globals.location.host,
        href: globals.location.href,
        appVersion: appConfig.version,
        musicTerritory: appConfig.musicTerritory,
        oAuthToken: auth.accessToken,
        sessionId: auth.sessionId,
        deviceId: auth.deviceId,
        deviceType: auth.deviceType,
        csrf: appConfig.csrf,
    };
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    };
    const body = JSON.stringify(Object.assign({ type: metricType, data: metricData }, defaultPayload));
    try {
        const response = await globals.fetch(ENDPOINT, {
            method: 'POST',
            headers,
            body,
        });
        return response.ok;
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Client metric logging failed', e);
        return false;
    }
}
export function reportPagePerformance(auth, deeplink, isCreateAndBind, summary) {
    const { isClientMetricsLambdaEnabled } = globals.amznMusic.appConfig;
    if (!isClientMetricsLambdaEnabled)
        return;
    const pageType = cleanDeeplink(deeplink);
    const { pageDuration, requestDuration, renderDuration } = summary;
    const metricData = {
        deeplink,
        pageType,
        pageDuration,
        requestDuration,
        renderDuration,
        isCreateAndBind,
    };
    reportClientMetric(PagePerformanceMetricType, metricData, auth);
}
export function reportWebVitals(auth) {
    const { isClientMetricsLambdaEnabled } = globals.amznMusic.appConfig;
    if (!isClientMetricsLambdaEnabled)
        return;
    const deeplink = globals.location.pathname;
    const pageType = cleanDeeplink(deeplink);
    const reportWebVitalMetric = (metric) => reportClientMetric(WebVitalsMetricType, { deeplink, pageType, metric }, auth);
    getLCP(reportWebVitalMetric);
    getFID(reportWebVitalMetric);
    getCLS(reportWebVitalMetric);
    getFCP(reportWebVitalMetric);
    getTTFB(reportWebVitalMetric);
}
