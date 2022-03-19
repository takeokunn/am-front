import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import RefinementHeader from '../components/RefinementHeader';
import MessageWidget from '../components/widgets/MessageWidget';
import { MESSAGE_WIDGET, } from '../types/templates/widgets/ISkyfireMessageWidget';
import * as messageStyles from './Message.scss';
import * as viewStyles from './View.scss';
const noop = () => true;
export default function Message(props) {
    const { message, image, header, refinementHeader, onViewed, buttonText, buttonPrimaryLink, } = props.template;
    useStyles(messageStyles, viewStyles);
    const widgetData = {
        interface: MESSAGE_WIDGET,
        header,
        message,
        image,
        onViewed,
        buttonText,
        buttonPrimaryLink,
    };
    return (React.createElement("div", { className: viewStyles.viewContent },
        refinementHeader && (React.createElement(RefinementHeader, { text: refinementHeader.text, refinementOptions: refinementHeader.refinementOptions, isActive: refinementHeader.isActive, isDisabled: refinementHeader.isDisabled, isOpened: refinementHeader.isOpened })),
        React.createElement(MessageWidget, { data: widgetData, handleSelected: noop, key: message })));
}
