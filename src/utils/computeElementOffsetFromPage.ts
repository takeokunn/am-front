const computeElementOffsetFromPage = (el, doc = document) => {
    const offsets = {
        offsetLeft: 0,
        offsetTop: 0,
    };
    if (!el) {
        return offsets;
    }
    offsets.offsetLeft = el.offsetLeft;
    offsets.offsetTop = el.offsetTop;
    offsets.offsetLeft -= el.scrollLeft;
    offsets.offsetTop -= el.scrollTop;
    let isStaticPositioned = false;
    // Add all parent offsets to get absolute position from the top element
    // Subtract any scrolled position from calculation
    if (el.offsetParent instanceof HTMLElement) {
        let parent = el.offsetParent;
        while (parent) {
            offsets.offsetLeft += parent.offsetLeft;
            offsets.offsetTop += parent.offsetTop;
            offsets.offsetLeft -= parent.scrollLeft;
            offsets.offsetTop -= parent.scrollTop;
            const parentTemp = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null;
            if (parentTemp === null) {
                // Check the top-most parent for fixed positioning
                isStaticPositioned = getComputedStyle(parent).position === 'fixed';
            }
            parent = parentTemp;
        }
    }
    // Don't add the page's scroll position if the element is fixed
    if (!isStaticPositioned) {
        offsets.offsetTop -= doc.documentElement.scrollTop;
        offsets.offsetLeft -= doc.documentElement.scrollLeft;
    }
    return offsets;
};
export { computeElementOffsetFromPage };
