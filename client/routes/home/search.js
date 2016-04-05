import React, { Component } from 'react';

class Search extends Component {
  render() {
    const { handleOnChange, value, handleSendQuery, currentDb } = this.props;

    const collections = currentDb ?
      currentDb.collections.map(v => v.name) : [];

    const search = value.toLowerCase();
    const suggestions = collections.filter(v => {
      if (search.length < 3) return false;
      const compare = `db.${v.toLowerCase()}`;
      console.log(search, compare)
      if (compare.indexOf(search) === 0) return true;
      return false;
    })

    var x = getCaret(this.refs.search);
    const style = {
      position: 'absolute',
      top: '6',
      zIndex: '100',
      left: '13px',
      fontFamily: 'monospace',
      fontSize: '14px',
      lineHeight: '1.42857143'
    }
    return (
      <div style={{ position: 'relative' }}>
        <div className="input-group">
          <textarea
            ref="search"
            className="form-control"
            type="text"
            onChange={handleOnChange}
            value={value}
            aria-describedby="qyinput"
            style={{ fontFamily: "monospace" }}
          >
          </textarea>
          <span className="input-group-addon" id="qyinput" onClick={handleSendQuery}>Send</span>
        </div>
        <div style={style}>
          <span style={{ visibility: 'hidden' }}>{value}</span>
          {suggestions.length <= 5 && suggestions.map(v =>(
              <div className="suggestion">
                <span>{`db.${v}`}</span>
              </div>
            )
          )}
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
