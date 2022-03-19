import React, { Component, Fragment } from 'react';
import Widget from '.';
import LoadingWidget from '../LoadingWidget';
import { globals } from '../../utils';
export default class WidgetList extends Component {
    constructor(props) {
        super(props);
        this.rendered = () => {
            if ('requestAnimationFrame' in window) {
                window.requestAnimationFrame(() => this.addNext());
            }
            else {
                setTimeout(() => this.addNext(), 10);
            }
        };
        this.state = { index: globals.amznMusic.ssr ? props.list.length : 0 };
    }
    componentWillMount() {
        this.addNext(2);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.list.length < this.props.list.length) {
            if (prevProps.list.length === this.state.index) {
                this.addNext();
            }
        }
    }
    addNext(num = 1) {
        if (this.state.index >= this.props.list.length) {
            return;
        }
        const start = this.state.index;
        const end = Math.min(num + start, this.props.list.length);
        this.setState({ index: end });
    }
    getWidgets(widgetsToRender) {
        return widgetsToRender.map((widget) => (React.createElement(Widget, { data: widget, rendered: this.rendered, handleSelected: this.props.handleSelected, isEnumerated: this.props.isEnumerated })));
    }
    render() {
        const showLoader = this.state.index >= this.props.list.length - 1 && !!this.props.onEndOfList;
        return (React.createElement(Fragment, null,
            this.getWidgets(this.props.list.slice(0, this.state.index)),
            showLoader && React.createElement(LoadingWidget, { onReached: this.props.onEndOfList })));
    }
}
