import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

const methodSuggestions = [
  'toArray',
  'find',
  'update',
  'remove',
];

const operatorSuggestions = [
  'set',
  'in',
]

const getSuggestions = (collections, search, caret) => {

  if (search.length < 3) return [];

  const typing = search.substring(0, caret);

  const collectionCheck = checkSuggestions(collections, 'db.', typing);
  if (collectionCheck.length > 0) return collectionCheck;

  const methodCheck = checkSuggestions(methodSuggestions, '.', typing);
  if (methodCheck.length > 0) return methodCheck;

  const operatorCheck = checkSuggestions(operatorSuggestions, '$', typing);
  if(operatorCheck.length > 0) return operatorCheck;

  return [];
};

const checkSuggestions = (arr, base, typing) => {
  if (typing.indexOf(base) === -1) return [];

  const search = typing.substring(typing.lastIndexOf(base));

  if (search.length < base.length) return [];

  return arr.filter(v => {
    const compare = `${base}${v.toLowerCase()}`;
    if (compare === search) return false;
    if (compare.indexOf(search) === 0) return true;
    return false;
  }).map(v => {
    const compare = `${base}${v.toLowerCase()}`;
    return {
      base,
      prev: v.substring(0, (search.length - base.length)),
      next: v.substring(search.length - base.length, v.length) }
  })
};

class Search extends Component {
  constructor (props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = { activeSuggestion: 0 };
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }
  handleKeyDown(e) {
    console.dir(e.keyCode);
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode } = e;
    const { activeSuggestion } = this.state;
    const { suggestions } = this;
    if (suggestions.length > 0 && (keyCode === 40 || keyCode === 38 || keyCode === 13)) {
      e.preventDefault();
      if (keyCode === 40) {
        return this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
      if (keyCode === 38) {
        return this.setState({ activeSuggestion: activeSuggestion - 1 });
      }
      if (keyCode === 13) {
        return this.chooseSuggestion(suggestions[activeSuggestion].next);
      }
    }
  }
  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;
    const { activeSuggestion } = this.state;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    const search = value.toLowerCase();

    var caret = getCaret(this.refs.search);

    this.suggestions = getSuggestions(collections, search, caret);

    this.chooseSuggestion = (suggestion) => {
      handleOnChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
    }

    const { suggestions, chooseSuggestion } = this;

    const handleSearchChange = (e) => handleOnChange(e.target.value);

    const formatValue = (value) => value.split('\n').map(v => <span>{v}<br/></span>)

    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };

    const style = {
      position: 'absolute',
      top: `${6 - scrollTop}px`,
      zIndex: '2',
      left: '13px',
      fontFamily: 'monospace',
      fontSize: '14px',
      lineHeight: '1.42857143'
    }
    const hiddenStyle = {
      visibility: 'hidden',
      display: 'inline-block',
    }
    return (
      <div style={{ position: 'relative' }}>
        <div className="input-group">
          <textarea
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
        <div style={style}>
          <span style={hiddenStyle}>{formatValue(value.substring(0, caret))}</span>
          {suggestions.length <= 5 && suggestions.map((v, index) => {
            const handleChooseSuggestion = () => chooseSuggestion(v.next);
            const subValue = Object.assign({}, { value }).value;
            const sub = subValue.substring(0, caret - v.prev.length);
            const sub2 = sub.substring(sub.lastIndexOf('\n'), sub.length);
            const className = activeSuggestion === index ? "suggestion suggestion-active" : "suggestion";

            return (
              <div className={className} key={index}>
                <span className="invisible">{`${sub2}`}</span>
                <span onClick={handleChooseSuggestion} style={{ zIndex: '100' }}>{v.prev}{v.next}</span>
              </div>
            );
          })
          }
        </div>
      </div>
    )
  }
}

function getCaret(el) {
  if(!el) return null;
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (document.selection) {
    el.focus();

    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }

    var re = el.createTextRange(),
        rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);

    return rc.text.length;
  }
  return 0;
}

export default Search;
