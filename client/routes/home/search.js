import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

const getSuggestions = (collections, search, caret) => {

  if (search.length < 3) return [];



  const typing = search.substring(0, caret);

  const newSearch = typing.substring(typing.lastIndexOf('db.'));

  if (newSearch.length < 3) return [];

  console.dir(newSearch)


  const collectionCheck = checkCollectionSuggestions(collections, newSearch)
  if (collectionCheck.length > 0) return collectionCheck;

  return [];
}

const checkCollectionSuggestions = (collections, search) => {
  return collections.filter(v => {
    const compare = `db.${v.toLowerCase()}`;
    if (compare === search) return false;
    if (compare.indexOf(search) === 0) return true;
    return false;
  }).map(v => {
    const compare = `db.${v.toLowerCase()}`;
    return {
      base: 'db.',
      prev: v.substring(0, (search.length - 3)),
      next: v.substring(search.length - 3, v.length) }
  })
}

class Search extends Component {
  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    const search = value.toLowerCase();

    var caret = getCaret(this.refs.search);

    const suggestions = getSuggestions(collections, search, caret);


    const chooseSuggestion = (suggestion) => {
      handleOnChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
    }

    const handleSearchChange = (e) => handleOnChange(e.target.value);

    const formatValue = (value) => value.split('\n').map(v => <span>{v}<br/></span>)

    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };

    console.dir(this.refs.search)
    console.dir(value.substring(0, caret))
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
            const sub = subValue.substring(0, caret - v.prev.length)
            const sub2 = sub.substring(sub.lastIndexOf('\n'), sub.length)
            console.dir(sub2)

            return (
              <div className="suggestion" key={index}>
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
