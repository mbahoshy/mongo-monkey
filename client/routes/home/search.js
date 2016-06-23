import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import JsonInput from 'utils/json-input';
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
    this.state = { activeSuggestion: 0, showSuggestion: false, suggestions: [] };
  }
  handleKeyDown(e) {
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode, ctrlKey } = e;
    const { value } = e.target;
    const { handleSendQuery, currentDb, value: searchValue } = this.props;
    const { activeSuggestion, showSuggestion } = this.state;

    const jsonInput = this.refs.jsonInput || {};
    const { chooseSuggestion } = jsonInput;
    const { caret } = jsonInput.state || {};

    const collections = currentDb ? currentDb.collections.map(v => v.name) : [];
    const search = searchValue.toLowerCase();
    const suggestions = getSuggestions(collections, search, caret);

    this.setState({ suggestions });

    if (ctrlKey && keyCode === 13) {
      e.preventDefault();
      handleSendQuery();
    }

    if (suggestions.length > 0 && (keyCode === 40 || keyCode === 38 || keyCode === 13 || keyCode === 9)) {
      e.preventDefault();
      if (keyCode === 40 && activeSuggestion + 1 < suggestions.length) {
        return this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
      if (keyCode === 38 && activeSuggestion > 0) {
        return this.setState({ activeSuggestion: activeSuggestion - 1 });
      }
      if (keyCode === 13 || keyCode === 9) {
        chooseSuggestion(suggestions[activeSuggestion].next, suggestions[activeSuggestion].caretOffset);
        this.setState({ suggestions: [], activeSuggestion: 0 });
        return;
      }
    }
    this.forceUpdate();
  }

  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;
    const { activeSuggestion, showSuggestion, suggestions } = this.state;

    const { handleKeyDown } = this;

    const jsonInput = this.refs.jsonInput || {};
    const { caret, focus } = jsonInput.state || {};
    const { chooseSuggestion } = jsonInput;

    const { search } = jsonInput.refs || {}
    const { offsetHeight, scrollTop } = search ? search : { offsetHeight: 0, scrollTop: 0 };

    const handleSearchChange = (value) => {
      // if (showSuggestion === false) this.setState({ showSuggestion: true });
      handleOnChange(value);
    }

    return (
      <div style={{ position: 'relative' }}>
        <JsonInput onChange={handleSearchChange} value={value} onKeyDown={handleKeyDown} ref="jsonInput" className="form-control"/>
        {suggestions.length > 0 && focus && getSuggestionHtml(suggestions, value, activeSuggestion, caret, chooseSuggestion, scrollTop)}
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
