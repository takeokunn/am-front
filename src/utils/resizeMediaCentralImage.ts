// https://w.amazon.com/index.php/MSA/HowTo/ImageStyleCodes
export function resizeMediaCentralImage(url, size, quality = 85, format = '') {
    if (url.indexOf('media-amazon') >= 0 || url.indexOf('ssl-images-amazon.com') >= 0) {
        const srcCopy = url.slice(0);
        const parsedFormat = format || srcCopy.endsWith('.png') ? 'png' : 'jpg';
        const fileNameStartIndex = srcCopy.lastIndexOf('/') + 1;
        const fileExtensionIndex = srcCopy.lastIndexOf('.');
        let fileName = srcCopy.substring(fileNameStartIndex, fileExtensionIndex);
        // Handle case when image has double extensions
        // Ex: https://m.media-amazon.com/images/gotham_ArtTriangleTemplate_AltIndie.jpg.jpeg
        if (fileName.indexOf('.') >= 0) {
            fileName = fileName.substring(fileName.indexOf('.'), fileName.length);
        }
        const hasParams = fileName.indexOf('._') >= 0;
        if (hasParams) {
            return srcCopy.replace(fileName, `${fileName}_UX${size}_FM${parsedFormat}_QL${quality}_`);
        }
        return srcCopy.replace(fileName, `${fileName}._UX${size}_FM${parsedFormat}_QL${quality}_`);
    }
    return url;
}
