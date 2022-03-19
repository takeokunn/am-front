import { parse } from 'query-string';
import { globals } from '../utils';
import { getSkyfireEnvironment } from './getSkyfireEnvironment';
export async function skyfireRequest(url, headers, onRequestError) {
    let parsedUrl = url;
    if (url.startsWith('http://localhost:8080')) {
        parsedUrl = url.replace('http://localhost:8080', getSkyfireEnvironment());
    }
    let response;
    try {
        response = await globals.fetch(parsedUrl, { method: 'get', headers });
        if (response.ok) {
            const json = await response.json();
            return json.methods;
        }
        // Note: non-2XX responses do not cause a Promise rejection.
        // "it will only reject on network failure or if anything prevented
        // the request from completing."
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const errorMethods = await onRequestError(`Status: ${response.status}`);
        return errorMethods;
    }
    catch (error) {
        const errorMethods = await onRequestError(error.message);
        return errorMethods;
    }
}
export async function skyfirePostRequest(url, headers, onRequestError) {
    let parsedUrl = url;
    if (url.startsWith('http://localhost:8080')) {
        parsedUrl = url.replace('http://localhost:8080', getSkyfireEnvironment());
    }
    const urlObj = new URL(parsedUrl);
    const searchParams = parse(urlObj.search);
    let response;
    try {
        response = await globals.fetch(`${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`, {
            method: 'post',
            headers,
            body: JSON.stringify(searchParams),
        });
        if (response.ok) {
            const json = await response.json();
            return json.methods;
        }
        // Note: non-2XX responses do not cause a Promise rejection.
        // "it will only reject on network failure or if anything prevented
        // the request from completing."
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        return await onRequestError(`Status: ${response.status}`);
    }
    catch (error) {
        console.log(error);
        return onRequestError(error.message);
    }
}
