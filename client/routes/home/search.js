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

class Search extends Component {
  constructor (props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = { activeSuggestion: 0, showSuggestion: false };
    this.suggestions = [];
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }
  handleKeyDown(e) {
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode, shiftKey } = e;
    const { value } = e.target;
    const { activeSuggestion } = this.state;
    const { suggestions } = this;

    const caret = getCaret(this.refs.search)

    if (!shiftKey && specialCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        return setSelectionRange(this.refs.search, caret + 1, caret + 1);
      }
    }

    if (shiftKey && shiftCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        return setSelectionRange(this.refs.search, caret + 1, caret + 1);
      }
    }

    if (suggestions.length > 0 && (keyCode === 40 || keyCode === 38 || keyCode === 13)) {
      e.preventDefault();
      if (keyCode === 40 && activeSuggestion + 1 < suggestions.length) {
        return this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
      if (keyCode === 38 && activeSuggestion > 0) {
        return this.setState({ activeSuggestion: activeSuggestion - 1 });
      }
      if (keyCode === 13) {
        return this.chooseSuggestion(suggestions[activeSuggestion].next, suggestions[activeSuggestion].caretOffset);
      }
    }
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
    const { activeSuggestion, showSuggestion } = this.state;

    const { caret } = this;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    this.chooseSuggestion = (suggestion, caretOffset) => {
      handleOnChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
      setTimeout(() => {
        const position = caret + caretOffset + suggestion.length;
        setSelectionRange(this.refs.search, position, position);
        this.setState({ showSuggestion: false });
      })
    }

    const { suggestions, chooseSuggestion } = this;

    const handleSearchChange = (e) => {
      if (showSuggestion === false) this.setState({ showSuggestion: true });
      handleOnChange(e.target.value);
    }

    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };

    const handleOnFocus = () => this.setState({ showSuggestion: true });
    const handleOnBlur = () => this.setState({ showSuggestion: false });

    return (
      <div style={{ position: 'relative' }}>
        <div className="input-group">
          <textarea
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            ref="search"
            className="form-control"
            type="text"
            onChange={handleSearchChange}
            value={value}
            aria-describedby="qyinput"
            style={{ fontFamily: "monospace" }}
          >
          </textarea>
          <span className="input-group-addon" id="qyinput" onClick={handleSendQuery}>Send</span>
        </div>
        {suggestions.length > 0 && showSuggestion && getSuggestionHtml(suggestions, value, activeSuggestion, caret, chooseSuggestion, scrollTop)}
      </div>
    )
  }
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
