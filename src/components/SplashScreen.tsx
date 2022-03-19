import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import * as Styles from './SplashScreen.scss';
const src = 'https://d5fx445wy2wpk.cloudfront.net/static/logo.svg';
export const SplashScreen = () => {
    useStyles(Styles);
    return (React.createElement("div", { className: Styles.splashScreen },
        React.createElement("img", { src: src, alt: "logo", crossOrigin: "anonymous" })));
};
