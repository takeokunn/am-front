import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { dispatchSkyfireMethods } from '../../../utils';
export default function TextWithLink(props) {
    const { data, template } = props;
    const dispatch = useDispatch();
    const handleLinkClicked = () => {
        var _a;
        dispatchSkyfireMethods(dispatch, template, (_a = data.link) === null || _a === void 0 ? void 0 : _a.onItemSelected);
    };
    return data.link ? (React.createElement("music-link", { kind: "accent", href: data.link.deeplink, onClick: handleLinkClicked }, data.text)) : (React.createElement(Fragment, null, data.text));
}
