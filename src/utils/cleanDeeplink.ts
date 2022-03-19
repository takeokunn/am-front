export function cleanDeeplink(deeplink) {
    if (!deeplink) {
        return 'emptyDeeplink';
    }
    const pathElements = deeplink.split('?')[0].split('/');
    // page identified output should match here:
    // https://code.amazon.com/packages/MusicMetricsFlexEventScripts/blobs/52a9a89cbc7cd13d8625fae2b6311cc1bc879106/--/configuration/WebPlayer-flexEvent.json#L85-L98
    if (pathElements[0].toString() !== '') {
        return pathElements.join('-');
    }
    pathElements.shift();
    switch (pathElements === null || pathElements === void 0 ? void 0 : pathElements[0]) {
        case '':
            return 'home';
        case 'albums':
            return 'albums-detail';
        case 'playlists':
            return 'playlists-detail';
        case 'artists':
            return 'artists-detail';
        case 'search':
            if (pathElements.length > 1) {
                return 'search';
            }
            return 'find';
        case 'my':
            if (pathElements.length > 2) {
                return `my-${pathElements[1]}-detail`;
            }
            if (pathElements.length > 1) {
                return `my-${pathElements[1]}`;
            }
            break;
        case 'recently':
            if (pathElements[1]) {
                return `recently-${pathElements[1]}`;
            }
            break;
        default:
            break;
    }
    return pathElements.join('-');
}
