import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
export function computeContainerWidth(windowWidth) {
    let width;
    const smallMargin = 4;
    const smallGutter = 16;
    const smallSides = smallMargin + smallGutter;
    const mediumMargin = 12;
    const mediumGutter = 24;
    const mediumSides = mediumMargin + mediumGutter;
    const xlMargin = 20;
    const xlGutter = 32;
    const xlSides = xlMargin + xlGutter;
    if (windowWidth <= 480) {
        width = windowWidth - 2 * smallSides;
    }
    else if (windowWidth <= 1280) {
        width = windowWidth - 2 * mediumSides;
    }
    else if (windowWidth <= 1600) {
        width = windowWidth - 2 * xlSides;
    }
    else {
        width = 1600 - 2 * xlSides;
    }
    return width;
}
export function getVisualListingGridSizes(currWindowWidth, gridItemType = 'square') {
    const maxAppWidth = 1580; // 1600 - 20 padding
    const windowWidth = Math.min(currWindowWidth, maxAppWidth);
    switch (gridItemType) {
        case 'rectangle':
            return getGridSizesForRectangleItems(windowWidth);
        case 'circle':
        case 'square':
        default:
            return getGridSizesForNonRectangleItems(windowWidth);
    }
}
function getGridSizesForNonRectangleItems(windowWidth) {
    let colCount;
    if (windowWidth >= WINDOW_SIZE_ENUM.XL4) {
        colCount = 7;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.XL3) {
        colCount = 6;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.XL) {
        colCount = 5;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.LG) {
        colCount = 3;
    }
    else {
        colCount = 2;
    }
    // Outer margin+gutter is computed in computeContainerWidth
    const colWidth = computeContainerWidth(windowWidth) / colCount;
    const rowHeight = colWidth * 1.3;
    return { colCount, colWidth, rowHeight };
}
function getGridSizesForRectangleItems(windowWidth) {
    let colCount;
    if (windowWidth >= WINDOW_SIZE_ENUM.XL3) {
        colCount = 4;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.XL) {
        colCount = 3;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.MD) {
        colCount = 2;
    }
    else {
        colCount = 1;
    }
    const colWidth = computeContainerWidth(windowWidth) / colCount;
    const rowHeight = colWidth * 0.8;
    return { colCount, colWidth, rowHeight };
}
export function getDescriptiveListingGridSizes(currWindowWidth) {
    const maxAppWidth = 1580; // 1600 - 20 padding
    const windowWidth = Math.min(currWindowWidth, maxAppWidth);
    // Assign default values for windowWidth < 480.
    let colCount = 1;
    if (windowWidth >= WINDOW_SIZE_ENUM.XL3) {
        colCount = 2;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.XL) {
        colCount = 2;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.LG) {
        colCount = 2;
    }
    else if (windowWidth >= WINDOW_SIZE_ENUM.MD) {
        colCount = 1;
    }
    // Outer margin + gutters are calculated in computeContainerWidth
    const colWidth = computeContainerWidth(windowWidth) / colCount;
    const rowHeight = 80;
    return { colCount, colWidth, rowHeight };
}
