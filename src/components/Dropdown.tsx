import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useState } from 'react';
import * as Styles from './Dropdown.scss';
export default function DropDown(props) {
    useStyles(Styles);
    const { options, currentOption, updateOption, defaultValue } = props;
    const [isOpen, toggleOpen] = useState(false);
    const [selectedValue, changeValue] = useState(currentOption || '');
    const toggle = () => toggleOpen((prev) => !prev);
    function handleChange(item) {
        toggle();
        updateOption(item.value);
        changeValue(item.mainText);
    }
    function handleOpen(event) {
        // https://www.w3.org/TR/uievents-key/#keys-whitespace
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
    function handleKeyDown(item, event) {
        // https://keycode.info/ for mappings.
        switch (event.key) {
            case 'Enter':
                handleChange(item);
                break;
            case 'ArrowUp':
                // @ts-ignore
                event.target.previousSibling.focus();
                break;
            case 'ArrowDown':
                // @ts-ignore
                event.target.nextSibling.focus();
                break;
            default:
                break;
        }
    }
    function renderOptions(items) {
        return items.map((item, idx) => {
            const title = selectedValue || defaultValue;
            return (React.createElement("li", { id: `item${idx + 1}`, onClick: handleChange.bind(this, item), className: Styles.list, tabIndex: 3, onKeyDown: handleKeyDown.bind(this, item) },
                React.createElement("p", null, item.mainText),
                React.createElement("p", { className: "music-tertiary-text" }, item.subText),
                item.mainText === title && (React.createElement("music-icon", { name: "radiocheck", variant: "primary", size: "small" }))));
        });
    }
    return (React.createElement("div", { className: Styles.dropdown },
        React.createElement("span", null,
            React.createElement("music-button", { tabIndex: 3, onKeyDown: handleOpen, onClick: toggle, variant: "glass" }, selectedValue || defaultValue),
            React.createElement("music-icon", { name: isOpen ? 'caretUp' : 'caretdown', onClick: toggle })),
        isOpen && (React.createElement("ul", { className: Styles.listContainer, role: "list", "aria-expanded": isOpen, tabIndex: 3 }, renderOptions(options)))));
}
