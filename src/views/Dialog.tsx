import DOMPurify from 'dompurify';
import useStyles from 'isomorphic-style-loader/useStyles';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WINDOW_SIZE_ENUM } from '../types/IWindowSize';
import { UPDATE_TEXT_INPUT, CHANGE_PROFILE_STATUS } from '../actions/Dialog';
import Dropdown from '../components/Dropdown';
import MultiselectList from '../components/MultiselectList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import HorizontalItem from '../components/widgets/items/HorizontalItem';
import VerticalItem from '../components/widgets/items/VerticalItem';
import ImageRow from '../components/widgets/items/ImageRow';
import TextWithLink from '../components/widgets/items/TextWithLink';
import BackgroundImage from '../components/BackgroundImage';
import { IMAGE_DIALOG_BUTTON_ELEMENT, PRIMARY_DIALOG_BUTTON_ELEMENT, } from '../types/templates/dialog/ISkyfireDialogButtonElement';
import { dispatchSkyfireMethods, globals } from '../utils';
import { useObserver } from '../utils/ObserverHooks';
import * as Styles from './Dialog.scss';
import DialogColumn from './DialogColumn';
import { getDeeplink } from '../utils/getDeeplink';
import { UNLOCK_AUDIO, UPDATE_DISPLAY_LANGUAGE, UNLOCK_AUDIO_DIALOG_SHOWN, SET_AUDIO_QUALITY, } from '../actions';
import { getInstanceSync } from '../player/AudioPlayer';
import { reportError } from '../components/ErrorBoundary';
import InformationCard from '../components/InformationCard';
import { spacersSizeMap } from '../utils/webUIVariables';
import DialogRow from '../components/DialogRow';
const { window } = globals;
export default function Dialog(props) {
    var _a;
    useStyles(Styles);
    const { windowWidth } = useSelector((state) => state.BrowserState);
    const { Authentication } = useSelector((state) => state);
    const { unlockAudioDialogShown } = useSelector((state) => state.Dialog);
    const dispatch = useDispatch();
    const { closeButton, onViewed, header, headerObserver, dialogVariant, body, buttons, rows, columns, background, image, imageHref, comfortText, subHeader, footer, selectorItems, multiSelectorItems, selectorDefault, selectorHeader, textInputHeader, textInputDefault, textInputPlaceholder, textInputMaxLengthErrorMessage, textInputMaxLength, rowItemElementList, horizontalItem, verticalItem, primaryActionButton, secondaryActionButtons, subBody, role, informationCard, } = props.template;
    useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        window.addEventListener('popstate', handleBack);
        window.addEventListener('keydown', handleEnter);
        dispatchSkyfireMethods(dispatch, props.template, onViewed);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            window.removeEventListener('popstate', handleBack);
            window.removeEventListener('keydown', handleEnter);
        };
    }, []);
    const inputRef = useRef(null);
    useEffect(() => { var _a; return (_a = inputRef === null || inputRef === void 0 ? void 0 : inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
    const headerObserverText = useObserver({ observer: headerObserver });
    const headerText = header !== null && header !== void 0 ? header : headerObserverText;
    const firstValue = selectorItems ? selectorItems[0].value : '';
    const isProfileStatusSelector = ['PUBLIC', 'PRIVATE', 'HIDDEN'].includes(firstValue);
    const isAudioQualitySelector = ['HD', 'STANDARD', 'DATA_SAVER'].includes(firstValue);
    const { displayLanguageId } = useSelector((state) => state.Authentication);
    const { audioQuality } = useSelector((state) => state.Setting);
    const [optionId, updateOptionId] = useState(isAudioQualitySelector ? audioQuality : displayLanguageId);
    const { profileStatus } = useSelector((state) => state.Dialog);
    const [status, updateStatus] = useState(profileStatus);
    const audioUnlockRef = useRef(false);
    const textInputDefaultElement = useObserver(textInputDefault);
    const [textInput, setTextInput] = useState((textInputDefaultElement === null || textInputDefaultElement === void 0 ? void 0 : textInputDefaultElement.text) || '');
    const onTextInputChange = (e) => setTextInput(e.target.value);
    const isTextInputMaxLengthReached = textInput.length === textInputMaxLength;
    const noop = () => true;
    const variantClass = dialogVariant === 'FULLSCREEN_SPLASH' ? Styles.splash : '';
    // textInput does not autopopulate on pageload if dialog is called from another dialog
    // since it gets re-rendered with new props
    // (e.g add to playlist selector dialog -> new playlist dialog)
    useEffect(() => {
        if (setTextInput) {
            setTextInput((textInputDefaultElement === null || textInputDefaultElement === void 0 ? void 0 : textInputDefaultElement.text) || '');
        }
    }, [textInputDefaultElement]);
    if (!headerText && !body && !rowItemElementList) {
        return React.createElement(LoadingSpinner, null);
    }
    return (React.createElement("div", { className: Styles.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "dialogHeader", "aria-describedby": "dialogBodyText", id: "dialog" },
        background && React.createElement(BackgroundImage, { src: background }),
        React.createElement("div", { className: [Styles.modalContent, variantClass].join(' ') },
            renderCloseButton(),
            image && React.createElement("music-icon", { name: image, size: "large" }),
            React.createElement("div", null, imageHref && React.createElement("img", { className: Styles.splashResizeImage, src: imageHref })),
            renderHeader(),
            renderSubHeader(),
            React.createElement("div", { className: Styles.bodyTextContainer },
                renderBody(),
                horizontalItem && (React.createElement(HorizontalItem, { data: horizontalItem, handleSelected: noop })),
                verticalItem && (React.createElement(VerticalItem, { data: verticalItem, handleSelected: noop, role: role }))),
            multiSelectorItems && (React.createElement(MultiselectList, { template: props.template, items: multiSelectorItems })),
            textInputHeader && (React.createElement("div", { className: Styles.textInputContainer },
                React.createElement("p", { className: "music-secondary-text" }, textInputHeader),
                isTextInputMaxLengthReached && (React.createElement("p", { className: [
                        Styles.textInputMaxLengthErrorMessage,
                        'music-secondary-text',
                    ].join(' ') }, textInputMaxLengthErrorMessage)),
                React.createElement("input", { ref: inputRef, className: [
                        Styles.textInput,
                        isTextInputMaxLengthReached
                            ? Styles.textInputMaxLengthErrorOutline
                            : '',
                    ].join(' '), placeholder: textInputPlaceholder, maxLength: textInputMaxLength, value: textInput, disabled: textInputDefaultElement === null || textInputDefaultElement === void 0 ? void 0 : textInputDefaultElement.disabled, onChange: onTextInputChange }))),
            React.createElement("div", { className: Styles.descriptionTextContainer }, subBody && (React.createElement("p", { className: "music-secondary-text", id: "dialogBodyText" },
                subBody.text,
                ' ', (_a = subBody.textWithLinks) === null || _a === void 0 ? void 0 :
                _a.map((textWithLinkElement) => (React.createElement(TextWithLink, { data: textWithLinkElement, template: props.template })))))),
            informationCard && (React.createElement(InformationCard, { data: informationCard, template: props.template })),
            selectorHeader && React.createElement("p", { className: "selector-header" }, selectorHeader),
            renderSelectorItems(),
            renderRowItemElementList(),
            renderColumns(),
            rows && rows.map((row) => React.createElement(DialogRow, { row: row, template: props.template })),
            renderButtons(buttons),
            renderActionButtons(primaryActionButton, secondaryActionButtons),
            React.createElement("p", { className: "music-tertiary-text" }, comfortText),
            renderFooter())));
    function renderBody() {
        var _a, _b;
        if (!body)
            return null;
        if (body.paragraphs && body.paragraphs.length > 0) {
            return (_a = body.paragraphs) === null || _a === void 0 ? void 0 : _a.map((paragraph, idx) => (React.createElement("p", { className: "music-primary-text", style: {
                    marginTop: spacersSizeMap.base,
                }, id: `dialogBodyText${idx}`, key: paragraph },
                paragraph,
                ' ')));
        }
        if (body.onItemSelected && body.onItemSelected.length > 0) {
            return (React.createElement("music-link", { className: ['music-secondary-text', Styles.dialogBodyText].join(' '), id: "dialogBodyText", onKeyDown: (e) => (e.key === 'Enter' ? handleSelected(body.onItemSelected) : undefined), onClick: () => handleSelected(body.onItemSelected) },
                body.icon && React.createElement("music-icon", { name: body.icon, size: "tiny" }),
                ' ',
                React.createElement("span", null, body.text)));
        }
        return (React.createElement("p", { className: "music-primary-text", id: "dialogBodyText" },
            body.text,
            ' ', (_b = body.textWithLinks) === null || _b === void 0 ? void 0 :
            _b.map((textWithLinkElement) => (React.createElement(TextWithLink, { data: textWithLinkElement, template: props.template })))));
    }
    function renderSelectorItems() {
        var _a;
        if (!selectorItems) {
            return null;
        }
        const currentOption = (_a = selectorItems.find((item) => item.value === optionId)) === null || _a === void 0 ? void 0 : _a.mainText;
        if (isProfileStatusSelector) {
            return (React.createElement(Dropdown, { options: selectorItems, updateOption: updateStatus, defaultValue: selectorDefault }));
        }
        return (React.createElement(Dropdown, { options: selectorItems, currentOption: currentOption, updateOption: updateOptionId, defaultValue: selectorDefault }));
    }
    function renderRowItemElementList() {
        if (!rowItemElementList) {
            return null;
        }
        return (React.createElement("div", { className: Styles.rowItemElementListsContainer }, rowItemElementList.map((rowItemElement) => (React.createElement("div", { className: Styles.rowItemElementListContainer },
            React.createElement("div", { className: Styles.rowItemElementListHeaderButtonContainer },
                React.createElement("h3", null, rowItemElement.header),
                rowItemElement.button &&
                    renderButton(rowItemElement.button, 'small', 0)),
            renderVisualRowItemElementList(rowItemElement.visualRowItemElementList))))));
    }
    function renderVisualRowItemElementList(visualRowItemElementList) {
        return visualRowItemElementList.map((visualRowItemElement, index) => (React.createElement(ImageRow, { template: props.template, disableSelection: true, disableSecondaryTextInline: true, key: index, data: visualRowItemElement, handleSelected: handleSelected })));
    }
    function onSubmit(isDisabled, onItemSelected, e) {
        var _a, _b;
        if (isDisabled) {
            e === null || e === void 0 ? void 0 : e.preventDefault();
            (_b = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
            return;
        }
        dispatch({ type: UPDATE_TEXT_INPUT, payload: { textInput } });
        handleSelected(onItemSelected, e);
    }
    function handleSelected(onItemSelected, e) {
        var _a, _b, _c;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        (_b = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.preventDefault) === null || _b === void 0 ? void 0 : _b.call(_a);
        // Only update state when selected the ok button
        // @ts-ignore
        if (selectorItems && ((_c = e === null || e === void 0 ? void 0 : e.target) === null || _c === void 0 ? void 0 : _c.id) === 'dialogButton1') {
            if (isProfileStatusSelector) {
                dispatch({
                    type: CHANGE_PROFILE_STATUS,
                    payload: {
                        profileStatus: status || selectorDefault,
                    },
                });
            }
            else if (isAudioQualitySelector) {
                dispatch({
                    type: SET_AUDIO_QUALITY,
                    payload: {
                        audioQuality: optionId,
                    },
                });
            }
            else {
                dispatch({
                    type: UPDATE_DISPLAY_LANGUAGE,
                    payload: {
                        displayLanguageId: optionId,
                    },
                });
            }
        }
        dispatch({ type: UPDATE_TEXT_INPUT, payload: { textInput } });
        const isUnlockAudio = onItemSelected === null || onItemSelected === void 0 ? void 0 : onItemSelected.some((method) => method.interface === UNLOCK_AUDIO);
        if (isUnlockAudio && !audioUnlockRef.current) {
            // UNLOCK_AUDIO must be handled here because the functionality is sensitive to
            // the caller context. `attemptAudioUnlock` will only work when called from a
            // click handler; we cannot perform this call from a Redux reducer/middleware.
            // https://quip-amazon.com/LeQ8AUBXRRNe/iOS-Autoplay-Issue-Workaround
            const audioPlayer = getInstanceSync();
            audioPlayer === null || audioPlayer === void 0 ? void 0 : audioPlayer.attemptAudioUnlock();
            if (unlockAudioDialogShown) {
                // If UNLOCK_AUDIO dialog is shown more than once in a session,
                // this indicates that the unlock attempt has failed
                reportError(new Error('UNLOCK_AUDIO_FAILED'), Authentication, undefined);
            }
            else {
                dispatch({ type: UNLOCK_AUDIO_DIALOG_SHOWN });
            }
            // guard against duplicate callbacks
            audioUnlockRef.current = true;
        }
        dispatchSkyfireMethods(dispatch, props.template, onItemSelected);
    }
    function handleEnter(e) {
        if (closeButton && e.keyCode === 13 && columns) {
            handleSelected(closeButton.primaryLink.onItemSelected, e);
        }
    }
    function handleEscape(e) {
        if (closeButton && e.keyCode === 27) {
            handleSelected(closeButton.primaryLink.onItemSelected, e);
        }
    }
    function handleBack(e) {
        if (closeButton) {
            handleSelected(closeButton.primaryLink.onItemSelected, e);
            e.preventDefault();
            // Since we can't actually cancel this event, we put the URL back to what it was
            // before anyone notices it has changed
            history.go(1);
        }
    }
    function renderHeader() {
        if (!headerText) {
            return null;
        }
        if (dialogVariant === 'FULLSCREEN_SPLASH') {
            return (React.createElement("h1", { className: "music-headline-2", id: "dialogHeader" }, headerText));
        }
        if (dialogVariant === 'INFORMATION_CARD') {
            return (React.createElement("h1", { className: ['title-size-3', 'condensed-font', Styles.infoCardHeader].join(' '), id: "dialogHeader" }, headerText));
        }
        return (React.createElement("h1", { className: ['music-headline-4', Styles.header].join(' '), id: "dialogHeader" }, headerText));
    }
    function renderSubHeader() {
        if (!subHeader) {
            return null;
        }
        if (dialogVariant === 'FULLSCREEN_SPLASH') {
            return (React.createElement("h1", { className: ['title-size-3', 'condensed-font', Styles.splashSubHeader].join(' ') }, subHeader));
        }
        return React.createElement("h1", { className: "music-headline-4" }, subHeader);
    }
    function renderActionButtons(actionButton, actionButtons) {
        if (!actionButton) {
            return null;
        }
        return (React.createElement("div", { className: Styles.buttonControls },
            (actionButtons || []).map((btn) => (React.createElement("music-button", { role: "button", variant: "glass", size: "small", "icon-only": true, "icon-name": btn.icon, onmusicActivate: handleSelected.bind(null, btn.primaryLink.onItemSelected) }, btn.text))),
            React.createElement("music-button", { role: "button", variant: "glass", size: windowWidth <= WINDOW_SIZE_ENUM.MD ? 'small' : 'medium', iconOnly: windowWidth <= WINDOW_SIZE_ENUM.MD, "icon-name": actionButton.icon, onmusicActivate: handleSelected.bind(null, actionButton.primaryLink.onItemSelected) }, actionButton.text)));
    }
    function renderColumns() {
        if (columns) {
            const columnContainerContents = columns.map((column) => (React.createElement(DialogColumn, { id: props.template.id, template: column })));
            return React.createElement("div", { className: Styles.columnsContainer }, columnContainerContents);
        }
        return null;
    }
    function renderButtons(buttonsToRender) {
        if (!buttonsToRender || buttonsToRender.length === 0) {
            return null;
        }
        const buttonHasDescription = buttonsToRender.some((button) => button.description);
        const renderButtonFunction = buttonHasDescription
            ? renderButtonWithDescription
            : renderButton;
        const buttonContainerContents = buttonsToRender.length === 1
            ? renderButtonFunction(buttonsToRender[0], 'medium', 0)
            : buttonsToRender.map((button, idx) => renderButtonFunction(button, 'small', idx));
        return buttonHasDescription ? (React.createElement("div", { className: Styles.buttonContainerWithDescriptions }, buttonContainerContents)) : (React.createElement("div", { className: Styles.buttonContainer }, buttonContainerContents));
    }
    function renderButton(button, size = 'small', idx) {
        if (!button) {
            return null;
        }
        const isImageDialogButtonElement = button.interface === IMAGE_DIALOG_BUTTON_ELEMENT;
        const isPrimaryDialogButtonElement = button.interface === PRIMARY_DIALOG_BUTTON_ELEMENT;
        const isDisabled = isPrimaryDialogButtonElement && !!textInputHeader && textInput.trim().length === 0;
        const onmusicActivate = (e) => onSubmit(isDisabled, button.primaryLink.onItemSelected, e);
        const variant = isPrimaryDialogButtonElement
            ? 'solid'
            : isImageDialogButtonElement
                ? 'image'
                : 'outline';
        return (React.createElement("music-button", { id: `dialogButton${idx + 1}`, variant: variant, disabled: isDisabled, "icon-name": button.icon, image: button.image, href: getDeeplink(button.primaryLink.deeplink), tabIndex: 3, size: size, onmusicActivate: onmusicActivate }, button.text));
    }
    function renderButtonWithDescription(button, size = 'small', idx) {
        return (button && (React.createElement(Fragment, null,
            renderButton(button, size, idx),
            React.createElement("div", { className: "music-tertiary-text" }, button.description))));
    }
    function renderCloseButton() {
        if (!closeButton) {
            return null;
        }
        return (React.createElement("div", { className: Styles.closeButtonContainer, id: "dialogCloseButton" },
            React.createElement("music-button", { role: "button", variant: "glass", size: "small", "icon-only": true, "icon-name": closeButton.icon, tabIndex: 3, onmusicActivate: handleSelected.bind(this, closeButton.primaryLink.onItemSelected) })));
    }
    function renderFooter() {
        var _a;
        if (!footer) {
            return null;
        }
        let handleFooterLinkClicked = () => { };
        if ((_a = footer.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected) {
            handleFooterLinkClicked = () => { var _a; return handleSelected(((_a = footer.primaryLink) === null || _a === void 0 ? void 0 : _a.onItemSelected) || []); };
        }
        return (React.createElement("div", { className: ['music-tertiary-text', Styles.footerContent].join(' ') },
            renderHTML(footer.styledText),
            footer.primaryLink && footer.primaryText && (React.createElement("div", { className: Styles.footerLink },
                React.createElement("music-link", { kind: "accent", onClick: handleFooterLinkClicked }, footer.primaryText))),
            React.createElement("div", { className: Styles.footerSecondaryText }, renderHTML(footer.secondaryText))));
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
}
