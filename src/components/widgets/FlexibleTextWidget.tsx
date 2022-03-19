import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import { useInView } from '../../utils/useItemsInView';
import * as Styles from './FlexibleTextWidget.scss';
export default function FlexibleTextWidget(props) {
    const callbackRef = useInView(props.onViewed);
    useStyles(Styles);
    const { items } = props;
    return (React.createElement("div", { ref: callbackRef, className: Styles.flexibleTextWidget }, items.map((item, index) => (React.createElement("music-flexible-text-container", { text: item.text })))));
}
