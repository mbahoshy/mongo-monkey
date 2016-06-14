import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import {
  methodSuggestions,
  operatorSuggestions,
  generalSuggestions,
  getSuggestions,
  getCaret,
  setSelectionRange,
  specialCodes,
  specialCodesDic,
  shiftCodes,
  shiftCodesDic,
} from 'utils/search-utils';

import formatter from 'utils/formatter-utils';

class Search extends Component {
  constructor (props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.handleSetCaret = this.handleSetCaret.bind(this);
    this.state = { activeSuggestion: 0, showSuggestion: false };
    this.suggestions = [];
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }
  componentDidUpdate() {
    const caret = getCaret(this.refs.search);
    if (caret !== this.state.caret) this.setState({ caret });
  }
  handleKeyDown(e) {
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode, shiftKey, ctrlKey } = e;
    const { value } = e.target;
    const { handleSendQuery } = this.props;
    const { activeSuggestion, showSuggestion, caret } = this.state;
    const { suggestions } = this;

    console.dir(keyCode);

    if (keyCode === 37 || keyCode === 39 || keyCode === 40 || keyCode === 38) {
      this.suggestions = [];
      this.setState({ showSuggestion: false });
      setTimeout(this.forceUpdate.bind(this), 50)
      return;
    }

    if (!shiftKey && specialCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        setSelectionRange(this.refs.search, caret + 1, caret + 1);
        setTimeout(this.forceUpdate.bind(this), 50)
        return
      }
      if ('[' === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        this.chooseSuggestion('[]', -1)
        return
      }
      if ('\'' === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        this.chooseSuggestion('\'\'', -1)
        return
      }
    }

    if (shiftKey && shiftCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        setSelectionRange(this.refs.search, caret + 1, caret + 1);
        setTimeout(this.forceUpdate.bind(this), 50)
        return
      }
      if ('{' === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        this.chooseSuggestion('{}', -1)
        return
      }
      if ('(' === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        this.chooseSuggestion('()', -1)
        return
      }
      if ('"' === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        this.chooseSuggestion('""', -1)
        return
      }
    }

    if (suggestions.length === 0 && keyCode === 9) {
      e.preventDefault();
      return this.chooseSuggestion('  ', 0)
    }

    if (ctrlKey && keyCode === 13) {
      e.preventDefault();
      handleSendQuery();
    }

    if (suggestions.length > 0 && (keyCode === 40 || keyCode === 38 || keyCode === 13 || keyCode === 9)) {
      e.preventDefault();
      if (keyCode === 40 && activeSuggestion + 1 < suggestions.length && showSuggestion !== false) {
        return this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
      if (keyCode === 38 && activeSuggestion > 0) {
        return this.setState({ activeSuggestion: activeSuggestion - 1 });
      }
      if (keyCode === 13 || keyCode === 9) {
        return this.chooseSuggestion(suggestions[activeSuggestion].next, suggestions[activeSuggestion].caretOffset);
      }
    }
    this.forceUpdate();
  }
  handleSetCaret() {
    const caret = getCaret(this.refs.search);
    this.setState({ caret });
  }
  handleOnScroll(e) {
    this.forceUpdate();
  }
  componentWillReceiveProps(props) {
    const { value, currentDb } = props;
    const { activeSuggestion } = this.state;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    const search = value.toLowerCase();

    this.caret = getCaret(this.refs.search);

    this.suggestions = getSuggestions(collections, search, this.caret);

    if (this.suggestions.length < activeSuggestion + 1) this.setState({ activeSuggestion: 0 });
  }
  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;
    const { activeSuggestion, showSuggestion, caret } = this.state;

    const { handleOnScroll, handleSetCaret } = this;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    this.chooseSuggestion = (suggestion, caretOffset) => {
      handleOnChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
      setTimeout(() => {
        const position = caret + caretOffset + suggestion.length;
        setSelectionRange(this.refs.search, position, position);
        this.suggestions = [];
        this.setState({ showSuggestion: false });
      })
    }

    const { suggestions, chooseSuggestion } = this;

    const handleSearchChange = (e) => {
      if (showSuggestion === false) this.setState({ showSuggestion: true });
      handleOnChange(e.target.value);
    }

    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };

    const handleOnFocus = () => {
      this.setState({ showSuggestion: true });
      handleSetCaret();
    }
    const handleOnBlur = () => this.setState({ showSuggestion: false });

    return (
      <div style={{ position: 'relative' }}>
        <div className="input-group" style={{ overflow: 'hidden' }}>
          <textarea
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onScroll={handleSetCaret}
            onClick={handleSetCaret}
            ref="search"
            className="form-control"
            type="text"
            onChange={handleSearchChange}
            value={value}
            aria-describedby="qyinput"
            style={{
              fontFamily: "monospace",
              color: 'transparent',
            }}
          >
          </textarea>
          <span className="input-group-addon" id="qyinput" onClick={handleSendQuery}>Send</span>
            <TextOverlay value={value} scrollTop={scrollTop} caret={caret} />
        </div>
        {suggestions.length > 0 /*&& showSuggestion*/ && getSuggestionHtml(suggestions, value, activeSuggestion, caret, chooseSuggestion, scrollTop)}
      </div>
    )
  }
}

const TextOverlay = ({ value, scrollTop, caret }) => {
  const style = {
    position: 'absolute',
    top: `${8 - scrollTop}px`,
    zIndex: '2',
    left: '13px',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.42857143',
    pointerEvents: 'none',
  }
  return (
    <div style={style}>
      {formatter(value, caret)}
    </div>
  )
}

const colors = {
  blue: { color: 'blue' },
  green: { color: 'green' },
  orange: { color: 'orange' },
  red: { color: 'red' },
  black: { color: 'black' },
  cursor: { letterSpacing: '-4px', marginLeft: '-4px', textDecoration: 'blink', color: 'black' },
};

const getStuff = () => {

}

const matt = () => {

}

const test = (value, caret, idx = 0, res = []) => {
  console.log(value, caret, idx);
  if (!value) return [<span style={colors.cursor} className="blink">|</span>];
  if (caret === idx) {
    res.push(<span>{value[idx]}<span style={colors.cursor} className="blink">|</span></span>);
    return test(value, caret, idx + 1, res);
  }
  // if (caret )
  // if (caret === idx + 1) {
  //   res.push(<span><span style={colors.cursor} className="blink">|</span>{value[idx]}</span>);
  //   return test(value, caret, idx + 1, res);
  // }
  if (!value[idx]) return res;

  res.push(<span>{value[idx]}</span>)
  return test(value, caret, idx + 1, res);
  // return <div></div>
  // if (!value) return [<span style={colors.cursor} className="blink">|</span>];
  // // if (idx + 1 === value.length) {
  // //   if (caret === idx + 1) res.push(<span style={colors.cursor} className="blink">|</span>);
  // //   res.push(<span style={colors.cursor} className="blink">|</span>)
  // //   return res;
  // // }
  // if (caret === idx) {
  //   res.push(<span style={colors.cursor} className="blink">|</span>);
  //   return test(value, caret, idx + 1, res);
  // }
  //
  // res.push(<span>{value[idx]}</span>)
  // return test(value, caret, idx + 1, res);
}

const formatOverlay = (value, caret) => {
  if (!value) return <span className="blink">|</span>
  return value.split('').map((v, idx) => {
    const hasCaret = caret === idx ? <span style={colors.cursor} className="blink">|</span> : '';
    const lastCaret = caret === idx + 1 ? <span style={colors.cursor} className="blink">|</span> : '';
    if (v === '\n') return <span key={idx}>{hasCaret}<br/>{lastCaret}</span>;
    if (v === ' ') return <span key={idx}>{hasCaret}&nbsp;{lastCaret}</span>;
    if (v === '{' || v === '}') return <span>{hasCaret}<span key={idx} style={colors.blue}>{v}</span>{lastCaret}</span>;

    return <span key={idx}>{hasCaret}{v}{lastCaret}</span>;
  })
}

const formatValue = (value) => value.split('\n').map(v => <span>{v}<br/></span>)

const getSuggestionHtml = (suggestions, value, activeSuggestion, caret, chooseSuggestion, scrollTop) => {

  const style = {
    position: 'absolute',
    top: `${6 - scrollTop}px`,
    zIndex: '2',
    left: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.42857143',
    pointerEvents: 'none',
  }
  const hiddenStyle = {
    visibility: 'hidden',
    display: 'inline-block',
    pointerEvents: 'none',
  }

  const suggestionsHtml = [];
  let subval;
  if (suggestions.length >= 5) return false;

  suggestions.map((v, index) => {
    const handleChooseSuggestion = () => chooseSuggestion(v.next, v.caretOffset);
    const subValue = Object.assign({}, { value }).value;
    const sub = subValue.substring(0, caret - v.prev.length);
    subval = sub.substring(sub.lastIndexOf('\n'), sub.length);
    const className = activeSuggestion === index ? "suggestion suggestion-active" : "suggestion";

    suggestionsHtml.push(
      <span>
        <span className={className} key={index} onClick={handleChooseSuggestion} style={{ zIndex: '100' }}>{v.prev}{v.next}</span>
        <br />
      </span>
    );
  });

  return (
    <div style={style}>
      <span style={hiddenStyle}>{formatValue(value.substring(0, caret))}</span>
      <div>
        <span className="invisible" style={{ pointerEvents: 'none' }}>{`${subval}`}</span>
        <div className="suggestionContainer">
          {suggestionsHtml}
        </div>
      </div>
    </div>
  )
}

export default Search;
