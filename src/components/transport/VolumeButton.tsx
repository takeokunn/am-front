import { debounce } from 'debounce';
import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useOnClickOutside from 'use-onclickoutside';
import { CHANGE_VOLUME, END_TRANSPORT_HOVERING, SET_VOLUME, START_TRANSPORT_HOVERING, } from '../../actions';
import { getInstance } from '../../player';
import VideoUITimeoutMS from '../../utils/VideoUITimeoutMS';
import * as Styles from './VolumeButton.scss';
let timeoutId;
export default function VolumeButton(props) {
    useStyles(Styles);
    const dispatch = useDispatch();
    const { mediaId } = useSelector((state) => state.Media);
    const { lastHoverTimestamp } = useSelector((state) => state.TransportOverlay);
    const [volumeLevel, setVolumeLevel] = useState(1);
    const [open, setOpen] = useState(false);
    const [transportHoverTimestamp, setTransportHoverTimestamp] = useState();
    const volumeButtonContainerRef = useRef(null);
    // Load Orchestra and set the correct volume
    useEffect(() => {
        async function loadPlayer() {
            const player = await getInstance();
            setVolumeLevel(player.getVolume());
        }
        loadPlayer();
    }, []);
    useEffect(() => {
        if (transportHoverTimestamp && transportHoverTimestamp !== lastHoverTimestamp) {
            debouncedEndHover.clear();
            setTransportHoverTimestamp(undefined);
        }
    }, [lastHoverTimestamp]);
    const debouncedEndHover = useCallback(debounce(() => {
        dispatch({ type: END_TRANSPORT_HOVERING });
    }, VideoUITimeoutMS.Hover4s), []);
    const closeSlider = () => setOpen(false);
    useOnClickOutside(volumeButtonContainerRef, closeSlider);
    const classNames = props.isTransportOverlayOpen
        ? [Styles.transportOverlayOpen, Styles.volumeContainer].join(' ')
        : Styles.volumeContainer;
    return (React.createElement("div", { className: classNames, ref: volumeButtonContainerRef },
        React.createElement("music-button", { ariaLabelText: "Volume", id: "volume-button", "icon-only": true, onmusicActivate: onTriggerSlider, "icon-name": `volume${volumeLevel > 0 ? 'on' : 'off'}`, variant: "primary", size: props.size || 'small' }),
        open && (React.createElement("div", { className: Styles.slider },
            React.createElement("input", { id: "volume-range", type: "range", onInput: onChange, onChange: onChange, value: volumeLevel, name: "volume", min: "0", max: "1", step: "0.1" })))));
    async function onTriggerSlider() {
        // TODO refactor with useCallback
        const sub = (e) => {
            if (!e || !e.target) {
                return;
            }
            const target = e.target;
            if (open && !target.id.startsWith('volume')) {
                setOpen(false);
            }
        };
        if (open) {
            window.addEventListener('click', sub);
        }
        else {
            window.removeEventListener('click', sub);
        }
        setOpen(!open);
        const player = await getInstance();
        setVolumeLevel(player.getVolume());
    }
    async function onChange(e) {
        // schedule dispatch start hover state in next available event loop slot
        setTimeout(() => {
            const timestamp = Date.now();
            setTransportHoverTimestamp(timestamp); // set the local timestamp
            dispatch({ type: START_TRANSPORT_HOVERING, payload: { timestamp } });
            debouncedEndHover();
        }, 0);
        const player = await getInstance();
        const eventVolume = +e.target.value;
        setVolumeLevel(eventVolume);
        player.volume(eventVolume);
        dispatch({ type: CHANGE_VOLUME, payload: { mediaId } });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            dispatch({ type: SET_VOLUME, payload: { volume: eventVolume } });
        }, 1000);
    }
}
