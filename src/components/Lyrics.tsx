import withStyles from 'isomorphic-style-loader/withStyles';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { UPDATE_LYRICS_VIEWED } from '../actions';
import { getInstance } from '../player';
import * as Styles from './Lyrics.scss';
const Line = ({ line, isActive }) => (React.createElement("li", { className: isActive ? Styles.activeLine : Styles.line },
    React.createElement("span", { className: "music-headline-4" }, line)));
class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.container = createRef();
        /**
         * When the current time in the song updates, calculate
         * the currently playing lyric. Rounded to the nearest increment.
         */
        this.onTimeupdate = (time) => {
            const roundedTime = Math.round(time * 1000);
            if (this.props.lyrics) {
                let roundedTimeToIncrement = 0;
                const increment = this.props.lyrics.increment || 1;
                // Round to the nearest increment grouping.
                if (roundedTime > 0) {
                    roundedTimeToIncrement = Math.ceil(roundedTime / increment) * increment;
                }
                const currentLineIndex = Number(this.props.lyrics.timing[roundedTimeToIncrement]);
                if (this.state.indexOfCurrentLine !== currentLineIndex) {
                    this.setState({ indexOfCurrentLine: currentLineIndex });
                }
            }
        };
        /**
         * When the song starts or finishes, reset the index.
         */
        this.resetCurrentLine = () => {
            this.setState({ indexOfCurrentLine: 0 });
        };
        /**
         * Scroll to place currentLyricsLine in the center
         * by updating scrollTop value based on calculation.
         */
        this.scrollToCurrentLine = () => {
            var _a, _b, _c;
            (_c = (_b = (_a = this.container) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.children[this.state.indexOfCurrentLine]) === null || _c === void 0 ? void 0 : _c.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        };
        this.state = {
            indexOfCurrentLine: 0,
        };
    }
    async componentDidMount() {
        this.player = await getInstance();
        this.player.addEventListener('timeupdate', this.onTimeupdate);
        this.player.addEventListener('started', this.resetCurrentLine);
        this.player.addEventListener('ended', this.resetCurrentLine);
    }
    async componentWillUnmount() {
        var _a, _b, _c;
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.removeEventListener('timeupdate', this.onTimeupdate);
        (_b = this.player) === null || _b === void 0 ? void 0 : _b.removeEventListener('started', this.resetCurrentLine);
        (_c = this.player) === null || _c === void 0 ? void 0 : _c.removeEventListener('ended', this.resetCurrentLine);
    }
    async componentDidUpdate() {
        this.scrollToCurrentLine();
        if (!this.props.lyricsViewed &&
            this.props.lyrics &&
            Object.keys(this.props.lyrics.lines).length > 0) {
            this.props.dispatch({ type: UPDATE_LYRICS_VIEWED });
        }
    }
    render() {
        const { lines, creditsLine } = this.props.lyrics || {};
        const { indexOfCurrentLine } = this.state;
        return (React.createElement("ol", { className: Styles.container, ref: this.container },
            lines &&
                Object.values(lines).map((line, index) => (React.createElement(Line, { key: index, line: line, isActive: index === indexOfCurrentLine }))), creditsLine === null || creditsLine === void 0 ? void 0 :
            creditsLine.split('\n').map((line) => (React.createElement("li", { className: Styles.creditsLine }, line)))));
    }
}
function mapStateToProps(state) {
    return {
        lyricsViewed: state.LyricsViewed.lyricsViewed,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default withStyles(Styles)(connect(mapStateToProps, mapDispatchToProps)(Lyrics));
