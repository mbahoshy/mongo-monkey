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

const TextOverlay = ({ value, scrollTop, scrollLeft, offsetWidth, caret, className }) => {
  const style = {
    position: 'absolute',
    top: `${0 - scrollTop}px`,
    zIndex: '2',
    left: `${0 - scrollLeft}px`,
    fontFamily: 'monospace',
    border: 'none',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    width: offsetWidth,
  }
  return (
    <div style={style} className={className}>
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
    this.refs.search.addEventListener('keydown', this.handleKeyDown)
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

    if (this.props.onKeyDown) {
      const breakEx = this.props.onKeyDown(e);
      if (breakEx) {
        return;
      }
    }

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
    const { value, onChange, className } = this.props;
    const { caret } = this.state;
    const { offsetHeight, offsetWidth, scrollTop, scrollLeft } = this.refs.search ? this.refs.search : { offsetHeight: 0, offsetWidth:0, scrollTop: 0, scrollLeft: 0 };

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <textarea
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onScroll={handleSetCaret}
            onClick={handleSetCaret}
            ref="search"
            className={className}
            type="text"
            wrap="off"
            onChange={e => onChange(e.target.value)}
            value={value}
            aria-describedby="qyinput"
            style={{
              fontFamily: "monospace",
              color: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
          </textarea>
          <TextOverlay value={value} scrollTop={scrollTop} scrollLeft={scrollLeft} offsetWidth={offsetWidth} caret={caret} className={className} />
        </div>
      </div>
    )
  }
}

export const JsonOverlay = ({ value, className }) => {
  const style = {
    zIndex: '2',
    fontFamily: 'monospace',
    border: 'none',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  }
  return (
    <div style={style} className={className}>
      {formatter(value)}
    </div>
  )
};

export default JsonInput;
