import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindHandler, dispatchSkyfireMethods } from '../../utils';
import { useInView } from '../../utils/useItemsInView';
export default function FeaturedBanner(props) {
    const template = useSelector((state) => state.TemplateStack.currentTemplate);
    const { smallImage, mediumImage, imageAltText, primaryLink } = props.data;
    const callbackRef = useInView(props.onViewed);
    const dispatch = useDispatch();
    const onItemSelected = useCallback(() => {
        if (template) {
            dispatchSkyfireMethods(dispatch, template, primaryLink.onItemSelected);
        }
    }, [dispatch, primaryLink.onItemSelected, template]);
    return (React.createElement("div", null,
        React.createElement("music-barker", { ref: callbackRef, href: primaryLink.deeplink, onClick: bindHandler(onItemSelected, null), "small-image": smallImage, "medium-image": mediumImage, "image-alt": imageAltText })));
}
