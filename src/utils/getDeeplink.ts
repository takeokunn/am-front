import { globals } from '../utils';
import { createRetailPlayerDeeplink, isRetailPlayerRequest } from './retailPlayerHelper';
export function getDeeplink(link) {
    return link && isRetailPlayerRequest(globals.location.hostname)
        ? createRetailPlayerDeeplink(link)
        : link;
}
