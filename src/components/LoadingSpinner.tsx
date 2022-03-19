import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import * as Styles from './LoadingSpinner.scss';
export const LoadingSpinner = () => {
    useStyles(Styles);
    return (React.createElement("div", { className: Styles.container },
        React.createElement("music-icon", { className: Styles.loadingSpinner, name: "loader", size: "large" })));
};
