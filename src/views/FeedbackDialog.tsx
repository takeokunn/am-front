import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { dispatchSkyfireMethods, globals } from '../utils';
import { sendFeedback } from '../utils/sendHeartbeatFeedback';
import * as Styles from './FeedbackDialog.scss';
const { window } = globals;
export default function FeedbackDialog(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { header, cancelButtonText, submitButtonText, closeDialogOnItemSelected, bodyContent1, bodyHeader1, bodyContent2, bodyHeader2, faqText, customerServiceText, faqUrl, customerServiceUrl, textInputPlaceholder, operatingSystem, browser, } = props.template;
    const [feedback, setFeedback] = useState('');
    // Add backbutton & escape button event listeners.
    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('popstate', handleBack);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('popstate', handleBack);
        };
    }, []);
    const dialogContentRef = useRef(null);
    const textAreaRef = useRef(null);
    // @ts-ignore
    const closeButtonRef = useRef(null);
    // @ts-ignore
    const cancelButtonRef = useRef(null);
    // @ts-ignore
    const submitButtonRef = useRef(null);
    useEffect(() => {
        var _a;
        (_a = textAreaRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, []);
    const handleTextChange = (e) => setFeedback(e.target.value);
    return (React.createElement("div", { className: Styles.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "dialogHeader", "aria-describedby": "dialogBodyText", id: "dialog" },
        React.createElement("div", { className: Styles.modalContent, ref: dialogContentRef },
            renderCloseButton(),
            React.createElement("div", { className: Styles.messageContainer },
                React.createElement("h1", { className: `music-headline-3 ${Styles.dialogTitle}`, id: "dialogHeader" }, header),
                React.createElement("div", { className: Styles.textSection },
                    React.createElement("h1", { className: "music-headline-4" }, bodyHeader1),
                    React.createElement("p", { className: "music-primary-text", id: "dialogBodyText" }, bodyContent1),
                    React.createElement("ul", { className: Styles.linkList },
                        React.createElement("li", null,
                            React.createElement("a", { href: faqUrl, target: "_blank", rel: "noopener noreferrer" }, faqText)),
                        React.createElement("li", null,
                            React.createElement("a", { href: customerServiceUrl, target: "_blank", rel: "noopener noreferrer" }, customerServiceText)))),
                React.createElement("div", { className: Styles.textSection },
                    React.createElement("h1", { className: "music-headline-4" }, bodyHeader2),
                    React.createElement("p", { className: "music-primary-text" }, bodyContent2)),
                React.createElement("textarea", { ref: textAreaRef, autoFocus: true, onChange: handleTextChange, value: feedback, placeholder: textInputPlaceholder })),
            React.createElement("div", { className: Styles.buttonContainer },
                React.createElement("music-button", { ref: cancelButtonRef, role: "button", variant: "glass", size: "small", onClick: handleSelected }, cancelButtonText),
                React.createElement("music-button", { ref: submitButtonRef, role: "button", variant: "solid", disabled: !feedback, size: "small", onClick: submit }, submitButtonText)))));
    function renderCloseButton() {
        return (React.createElement("div", { className: Styles.closeButtonContainer, id: "dialogCloseButton" },
            React.createElement("music-button", { ref: closeButtonRef, role: "button", variant: "glass", size: "small", "icon-only": true, "icon-name": "cancel", onClick: handleSelected })));
    }
    async function submit() {
        if (!feedback) {
            return;
        }
        await sendFeedback(feedback, operatingSystem, browser);
        handleSelected();
    }
    function handleSelected(e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        dispatchSkyfireMethods(dispatch, props.template, closeDialogOnItemSelected);
    }
    function handleKeydown(e) {
        var _a;
        switch (e.key) {
            case 'Enter':
                if (e.target) {
                    if (e.target === closeButtonRef.current ||
                        e.target === cancelButtonRef.current) {
                        handleSelected();
                    }
                    else if (e.target === submitButtonRef.current) {
                        submit();
                    }
                }
                break;
            case 'Escape':
                handleSelected(e);
                break;
            case 'Tab': {
                const focusableEls = (_a = dialogContentRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[tabindex]:not([tabindex="-1"])');
                const firstFocusableEl = focusableEls && focusableEls.length
                    ? focusableEls[0]
                    : undefined;
                const lastFocusableEl = focusableEls && focusableEls.length
                    ? focusableEls[focusableEls.length - 1]
                    : undefined;
                if (e.target === lastFocusableEl && !e.shiftKey) {
                    e.preventDefault();
                    firstFocusableEl === null || firstFocusableEl === void 0 ? void 0 : firstFocusableEl.focus();
                    break;
                }
                if (e.target === firstFocusableEl && e.shiftKey) {
                    e.preventDefault();
                    lastFocusableEl === null || lastFocusableEl === void 0 ? void 0 : lastFocusableEl.focus();
                    break;
                }
                break;
            }
            default:
                break;
        }
    }
    function handleBack(e) {
        handleSelected(e);
        e.preventDefault();
        // Since we can't actually cancel this event, we put the URL back to what it was
        // before anyone notices it has changed
        history.go(1);
    }
}
