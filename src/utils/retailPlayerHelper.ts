import { RETAIL_PLAYER_PATH_SUBSTR } from '../constants/retailPlayerConstants';
export function isRetailPlayerRequest(hostname) {
    if (typeof hostname !== 'undefined' && hostname) {
        return (hostname.includes('.amazon.') &&
            !hostname.includes('music') &&
            !hostname.includes('mp3localhost'));
    }
    return false;
}
export function createRetailPlayerDeeplink(link) {
    // Get rid of the ugly trailing slash
    const prettyLink = link.replace(/\/$/, '');
    if (isValidRetailPlayerDeeplink(link)) {
        return prettyLink;
    }
    return RETAIL_PLAYER_PATH_SUBSTR + prettyLink;
}
// This function checks if the given link is absolute link or relative RWP link
function isValidRetailPlayerDeeplink(link) {
    if (link.startsWith(RETAIL_PLAYER_PATH_SUBSTR) || !link.startsWith('/')) {
        return true;
    }
    return false;
}
