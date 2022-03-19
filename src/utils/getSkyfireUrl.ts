import { parse, stringify } from 'query-string';
import { globals } from '../utils';
import { getSkyfireEnvironment } from './getSkyfireEnvironment';
import { INVOKE_DELEGATE_HTTP } from '../types/ISkyfireInvokeDelegateHttpMethod';
import { getClientInformation } from './getClientInformation';
export async function getSkyfireUrl(method, store) {
    let url;
    if (method.interface === INVOKE_DELEGATE_HTTP) {
        url = new URL(getSkyfireEnvironment() + method.path);
    }
    else {
        const prefix = method.url.startsWith('/') ? globals.location.origin : '';
        url = new URL(prefix + method.url);
    }
    // preserve query string, if exists
    const searchParams = parse(url.search);
    if ((method.clientInformation || []).length > 0) {
        const clientInformation = await getClientInformation(method, store);
        if (clientInformation) {
            for (const info in clientInformation) {
                if (Object.prototype.hasOwnProperty.call(clientInformation, info)) {
                    clientInformation[info] = JSON.stringify(clientInformation[info]);
                }
            }
            Object.assign(searchParams, clientInformation);
        }
    }
    // get base url. Even if there is no ? split will return single element,
    // so its safe and browser agnostic
    let baseUrl = url.href
        .split('?')[0]
        .replace('https://dev-na.mobile.music.a2z.com', '')
        .replace('http://localhost:8080/tvmusic', '');
    baseUrl = decodeURI(baseUrl);
    // assemble query string, skip empty and null
    const query = stringify(searchParams, { skipEmptyString: true, skipNull: true });
    return baseUrl + (query.length === 0 ? '' : `?${query}`);
}
