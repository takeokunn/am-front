// @ts-ignore
import React, { Fragment, useErrorBoundary } from 'react';
import { useSelector } from 'react-redux';
import { cleanDeeplink, getCurrentTemplateDeeplink, globals } from '../utils';
import { reportFlexEvent } from '../utils/reportFlexEvent';
export async function reportError(error, Authentication, deeplink) {
    const { UAParser } = await import(/* webpackChunkName: "metrics" */ 'ua-parser-js');
    const ua = new UAParser(globals.navigator.userAgent);
    const browser = ua.getBrowser();
    reportFlexEvent('WebPlayerClientError', [
        [deeplink, ua.getOS().name, browser.name, error.stack || error.message],
        [Number(browser.major)],
    ], Authentication);
}
export default function ErrorBoundary(props) {
    const { Authentication } = useSelector((state) => state);
    const TemplateStack = useSelector((state) => state.TemplateStack);
    // https://preactjs.com/guide/v10/hooks/#useerrorboundary
    useErrorBoundary(async (err) => {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(err);
        }
        const deeplink = getCurrentTemplateDeeplink(TemplateStack);
        const cleanedDeeplink = cleanDeeplink(deeplink);
        await reportError(err, Authentication, cleanedDeeplink);
    });
    return React.createElement(Fragment, null, props.children);
}
