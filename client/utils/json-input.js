import React, { Component } from 'react';
import formatter from 'utils/formatter-utils';

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

class JsonInput extends Component {
  constructor(props) {
    super(props);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.handleSetCaret = this.handleSetCaret.bind(this);
    this.chooseSuggestion = this.chooseSuggestion.bind(this);
    this.state = { caret: 0, focus: false };
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }
  componentDidUpdate() {
    const caret = getCaret(this.refs.search);
    if (caret !== this.state.caret) this.setState({ caret });
  }
  chooseSuggestion(suggestion, caretOffset) {
    const { value } = this.props;
    const { caret } = this.state;
    this.props.onChange(`${value.substring(0, caret)}${suggestion}${value.substring(caret, value.length)}`);
    const position = caret + caretOffset + suggestion.length;
    setSelectionRange(this.refs.search, position, position);
    setTimeout(() => {
      this.forceUpdate();
    })
  }
  handleKeyDown(e) {
    // 40 arrow down, 38 arrow up, 13 enter
    const { keyCode, shiftKey, ctrlKey } = e;
    const { value } = e.target;
    const { suggestions } = this;

    const caret = getCaret(this.refs.search);
    this.setState({ caret });

    this.props.onKeyDown ? this.props.onKeyDown(e) : () => {};

    // arrow keys
    if (keyCode === 37 || keyCode === 39 || keyCode === 40 || keyCode === 38) {
      setTimeout(this.forceUpdate.bind(this), 50)
      return;
    }

    if (!shiftKey && specialCodes.indexOf(keyCode) !== -1) {
      if (this.props.value[caret] === specialCodesDic[specialCodes.indexOf(keyCode)]) {
        e.preventDefault();
        setSelectionRange(this.refs.search, caret + 1, caret + 1);
        setTimeout(this.forceUpdate.bind(this), 10)
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

    if (keyCode === 9) {
      e.preventDefault();
      return this.chooseSuggestion('  ', 0)
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
  handleOnFocus(e) {
    this.setState({ focus: true });
    this.handleSetCaret();
  }
  handleOnBlur(e) {
    this.setState({ focus: false });
    this.handleSetCaret();
  }
  render() {
    const { handleSetCaret, handleOnBlur, handleOnFocus } = this;
    const { value, onChange } = this.props;
    const { caret } = this.state;
    const { offsetHeight, scrollTop } = this.refs.search ? this.refs.search : { offsetHeight: 0, scrollTop: 0 };

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ overflow: 'hidden' }}>
          <textarea
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onScroll={handleSetCaret}
            onClick={handleSetCaret}
            ref="search"
            className="form-control"
            type="text"
            onChange={e => onChange(e.target.value)}
            value={value}
            aria-describedby="qyinput"
            style={{
              fontFamily: "monospace",
              color: 'transparent',
            }}
          >
          </textarea>
            <TextOverlay value={value} scrollTop={scrollTop} caret={caret} />
        </div>
      </div>
    )
  }
}

export default JsonInput;
