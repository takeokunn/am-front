import DOMPurify from 'dompurify';
import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UPDATE_COLUMN_TEXT_INPUT } from '../actions/Dialog';
import { PRIMARY_DIALOG_BUTTON_ELEMENT, } from '../types/templates/dialog/ISkyfireDialogButtonElement';
import { dispatchSkyfireMethods } from '../utils';
import * as Styles from './Dialog.scss';
import { getDeeplink } from '../utils/getDeeplink';
export default function DialogColumn(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { header, buttons, body, smsOrEmailInputDefault, smsOrEmailPlaceholder, textInputSmsOrEmailErrorMessage, smsOrEmailValidationRegex, } = props.template;
    // TODO refactor this
    // eslint-disable-next-line no-param-reassign
    props.template.id = props.id;
    const inputRef = useRef(null);
    const [smsOrEmailTextInput, setSmsOrEmailTextInput] = useState((smsOrEmailInputDefault === null || smsOrEmailInputDefault === void 0 ? void 0 : smsOrEmailInputDefault.text) || '');
    const onSmsOrEmailTextInputChange = (e) => {
        setSmsOrEmailTextInput(e.target.value);
    };
    const isValidSmsOrEmail = isValidColumnInput(smsOrEmailTextInput);
    return (React.createElement("div", { className: Styles.columnContainer },
        header && (React.createElement("h1", { className: ['music-headline-4', Styles.header, Styles.columnHeader].join(' '), id: "dialogHeader" }, header)),
        React.createElement("div", null,
            body && (React.createElement("div", { className: [Styles.bodyTextContainer, Styles.columnBodyTextContainer].join(' ') },
                React.createElement("p", { className: "music-secondary-text", id: "dialogBodyText" }, renderHTML(body)))),
            smsOrEmailPlaceholder && (React.createElement("div", { className: Styles.textInputContainer },
                smsOrEmailValidationRegex && !isValidSmsOrEmail && (React.createElement("music-icon", { class: [Styles.inputMusicIcon, Styles.invalid].join(' '), name: "cancelInline", size: "tiny" })),
                smsOrEmailValidationRegex && isValidSmsOrEmail && (React.createElement("music-icon", { class: [Styles.inputMusicIcon, Styles.valid].join(' '), name: "doneInline", size: "tiny" })),
                React.createElement("input", { ref: inputRef, className: [
                        Styles.textInput,
                        'music-secondary-text',
                        smsOrEmailValidationRegex && !isValidSmsOrEmail
                            ? Styles.textInputInvalidSmsOrEmailErrorOutline
                            : '',
                    ].join(' '), placeholder: smsOrEmailPlaceholder, maxLength: 400, value: smsOrEmailTextInput, onChange: onSmsOrEmailTextInputChange }),
                smsOrEmailValidationRegex &&
                    textInputSmsOrEmailErrorMessage &&
                    !isValidSmsOrEmail && (React.createElement("p", { className: [
                        Styles.textInputInvalidSmsOrEmailErrorMessage,
                        'music-tertiary-text',
                    ].join(' ') }, textInputSmsOrEmailErrorMessage)))),
            renderButtons(buttons))));
    function isValidColumnInput(inputText) {
        if (smsOrEmailValidationRegex) {
            const regex = new RegExp(smsOrEmailValidationRegex);
            return inputText.match(regex);
        }
        return false;
    }
    function renderButtons(buttonsToRender) {
        const buttonContainerContents = buttonsToRender.length === 1
            ? renderButton(buttonsToRender[0], 'medium', 0)
            : buttonsToRender.map((button, idx) => renderButton(button, 'small', idx));
        return React.createElement("div", { className: Styles.buttonContainer }, buttonContainerContents);
    }
    function renderButton(button, size = 'small', idx) {
        if (!button) {
            return null;
        }
        const isPrimaryDialogButtonElement = button.interface === PRIMARY_DIALOG_BUTTON_ELEMENT;
        const onmusicActivate = (e) => onSubmit(button.primaryLink.onItemSelected, e);
        return (React.createElement("music-button", { id: `dialogColumnButton${idx + 1}`, variant: isPrimaryDialogButtonElement ? 'solid' : 'outline', disabled: false, "icon-name": button.icon, href: getDeeplink(button.primaryLink.deeplink), size: size, onmusicActivate: onmusicActivate }, button.text));
    }
    function renderHTML(text) {
        const newText = (text || '')
            .replace(/<a/g, '<music-link kind="accent"')
            .replace(/<\/a>/g, '</music-link>');
        const config = {
            ADD_TAGS: ['MUSIC-LINK'],
            ADD_ATTR: ['kind', 'target'],
        };
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(newText, config) } });
    }
    function onSubmit(onItemSelected, e) {
        dispatch({ type: UPDATE_COLUMN_TEXT_INPUT, payload: { smsOrEmail: smsOrEmailTextInput } });
        handleSelected(onItemSelected, e);
    }
    function handleSelected(onItemSelected, e) {
        var _a, _b;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        (_b = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }
}
