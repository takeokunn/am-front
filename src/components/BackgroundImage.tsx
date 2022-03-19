import useStyles from 'isomorphic-style-loader/useStyles';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import * as Styles from './BackgroundImage.scss';
export default function BackgroundImage(props) {
    const { src, isNowPlaying = false, isMusicExperiencePlaying = false } = props;
    useStyles(Styles);
    const { windowWidth, windowHeight } = useSelector((state) => state.BrowserState, shallowEqual);
    const [backgroundHeight, setBackgroundHeight] = useState(windowHeight);
    useEffect(() => {
        setBackgroundHeight(windowHeight);
    }, [windowWidth]);
    return src ? (React.createElement("div", { className: Styles.backgroundContainer },
        React.createElement("div", { className: isMusicExperiencePlaying
                ? Styles.animationContainer
                : isNowPlaying
                    ? Styles.container2
                    : Styles.container, style: {
                backgroundImage: `url(${src.replace(/_QL\d+_/, '_QL50_')})`,
                // @ts-ignore
                '--backgroundHeight': `${backgroundHeight}px`,
            } }),
        !isNowPlaying ? React.createElement("div", { className: Styles.gradient }) : null)) : null;
}
