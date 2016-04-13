import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

const methodSuggestions = [
  'find()',
  'limit()',
  'remove()',
  'sort()',
  'toArray()',
  'update()',
];

const operatorSuggestions = [
  'geoNear',
  'group',
  'in',
  'match',
  'set',
  'sum',
  'sort',
]

const generalSuggestions = [
  'ObjectID()',
]

const getSuggestions = (collections, search, caret) => {
  if (search.length < 3) return [];

  const typing = search.substring(0, caret);

  const collectionCheck = checkSuggestions(collections, 'db.', typing, search, 0);
  if (collectionCheck.length > 0) return collectionCheck;

  const methodCheck = checkSuggestions(methodSuggestions, '.', typing, search, -1);
  if (methodCheck.length > 0) return methodCheck;

  const operatorCheck = checkSuggestions(operatorSuggestions, '$', typing, search, 0);
  if(operatorCheck.length > 0) return operatorCheck;

  const generalCheck = checkSuggestions(generalSuggestions, ' ', typing, search, -1);
  if (generalCheck.length > 0) return generalCheck;

  return [];
};

const checkSuggestions = (arr, base, typing, fullsearch, caretOffset) => {
  if (typing.indexOf(base) === -1) return [];

  const trimmedFull = fullsearch.substring(typing.lastIndexOf(base))
  const search = typing.substring(typing.lastIndexOf(base));

  if (search.length < base.length + 1) return [];

  return arr.filter(v => {
    const compare = `${base}${v.toLowerCase()}`;
    if (trimmedFull.substring(0, compare.length).trim() === compare.trim()) return false;
    if (compare.trim() === search.trim()) return false;
    if (compare.indexOf(search) === 0) return true;
    return false;
  }).map(v => {
    const compare = `${base}${v.toLowerCase()}`;
    return {
      base,
      prev: v.substring(0, (search.length - base.length)),
      next: v.substring(search.length - base.length, v.length),
      caretOffset }
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
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode, shiftKey } = e;
    const { value } = e.target;
    const { activeSuggestion } = this.state;
    const { suggestions } = this;

    var caret = getCaret(this.refs.search);

    const specialCodes = [
      186, // ;
      222, // '
      221, // ]
      219, // [
      190, // .
    ]

    const specialCodesDic = [
      ';',
      "'",
      ']',
      '[',
      '.',
    ]

    const shiftCodes = [
      57, // (
      48, // )
      186, // :
      222, // "
      221, // }
      219, // {
    ]

    const shiftCodesDic = [
      '(',
      ')',
      ':',
      '"',
      '}',
      '{',
    ]

    if (!shiftKey && specialCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        setSelectionRange(this.refs.search, caret + 1, caret + 1);
        return false;
      }
    }

    if (shiftKey && shiftCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === shiftCodesDic[shiftCodes.indexOf(keyCode)]) {
        e.preventDefault();
        setSelectionRange(this.refs.search, caret + 1, caret + 1);
        return false;
      }
    }

    if (suggestions.length > 0 && (keyCode === 40 || keyCode === 38 || keyCode === 13)) {
      e.preventDefault();
      if (keyCode === 40) {
        this.setState({ activeSuggestion: activeSuggestion + 1 });
        return false;
      }
      if (keyCode === 38) {
        this.setState({ activeSuggestion: activeSuggestion - 1 });
        return false;
      }
      if (keyCode === 13) {
        this.chooseSuggestion(suggestions[activeSuggestion].next, suggestions[activeSuggestion].caretOffset);
        return false;
      }
    }
    return true;
  }
  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;
    const { activeSuggestion } = this.state;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    const search = value.toLowerCase();

    var caret = getCaret(this.refs.search);

    this.suggestions = getSuggestions(collections, search, caret);

    this.chooseSuggestion = (suggestion, caretOffset) => {
      handleOnChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
      setTimeout(() => {
        const position = caret + caretOffset + suggestion.length;
        setSelectionRange(this.refs.search, position, position);
      })
    }

    const { suggestions, chooseSuggestion } = this;

    const handleSearchChange = (e) => {
      handleOnChange(e.target.value);
    }


    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };


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
        {suggestions.length > 0 && (
          <div>
            {getSuggestionHtml(suggestions, value, activeSuggestion, caret, chooseSuggestion, scrollTop)}
          </div>
        )}
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

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

export default Search;
