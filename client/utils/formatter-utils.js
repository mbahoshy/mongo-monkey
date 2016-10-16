import React from 'react';

const colors = {
  blue: { color: 'blue' },
  green: { color: 'green' },
  orange: { color: 'orange' },
  red: { color: 'red' },
  black: { color: 'black' },
  cursor: { letterSpacing: '-4px', marginLeft: '-4px', textDecoration: 'blink', color: 'black' },
};

const Caret = () => (
  <span style={colors.cursor} className="blink">|</span>
)

const showCaret = (caret, idx) => {
  if (!caret) return false;
  return caret === idx ? <Caret /> : false;
}

const formatSpecial = value => {
  if (value === ' ') return <span>&nbsp;</span>;
  if (value === '\n') return <br />;
  return value;
}

const getHtml = (value, idx, caret) => {

  const hasCaret = showCaret(caret, idx);

  const char = value[idx];

  // map caret to string position
  const accepted = ['}', ' ', ',', '\n'];
  const another = [' ', ':'];
  if ((!value[idx - 1] || another.indexOf(value[idx - 1]) !== -1) && (!value[idx + 4] || accepted.indexOf(value[idx + 4]) !== -1) && value.slice(idx, idx + 4) === 'true') {
    return {
      diff: 4,
      html: <span key={idx} style={colors.orange}>{hasCaret}{`true`}</span>
    };
  }

  if ((!value[idx - 1] || value[idx - 1] === ' ') && value.slice(idx, idx + 5) === 'false') {
    return {
      diff: 5,
      html: <span key={idx} style={colors.orange}>{hasCaret}{`false`}</span>
    };
  }

  // if ((!value[idx - 1] || another.indexOf(value[idx - 1]) !== -1) && (!isNaN(char)))

  if (char === ':' || char === ',') {
    return {
      diff: 1,
      html: <span key={idx} style={colors.black}>{hasCaret}{char}</span>
    };
  }

  if (char === '\n') {
    return {
      diff: 1,
      html: <span key={idx}>{hasCaret}<br/></span>
    };
  }
  if (char === ' ') {
    return {
      diff: 1,
      html: <span key={idx}>{hasCaret}&nbsp;</span>
    };
  }
  if (char === '{') {
    const chars = [<span key={idx}>{hasCaret}<span style={colors.blue}>{`{`}</span></span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = showCaret(caret, newIdx);
      if (value[newIdx] === '}') break;
      const { html, diff } = getHtml(value, newIdx, caret);
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.red}>{html}</span></span>);
      newIdx = newIdx + diff;
    }
    return {
      diff: newIdx - idx,
      html: <span key={idx}>{[...chars]}</span>
    }
  }
  if (char === '}') {
    return {
      diff: 1,
      html: <span>{hasCaret}<span key={idx} style={colors.blue}>{char}</span></span>
    };
  }

  if (char === '\'') {
    const chars = [<span key={idx}>{hasCaret}<span style={colors.green}>{`'`}</span></span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = showCaret(caret, newIdx);
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.green}>{formatSpecial(value[newIdx])}</span></span>);
      if (value[newIdx] === '\'') {
        newIdx++;
        break;
      }
      newIdx++;
    }
    return {
      diff: newIdx - idx,
      html: <span key={idx}>{[...chars]}</span>
    }
  }

  if (char === '"') {
    const chars = [<span key={idx}>{hasCaret}<span style={colors.green}>{`"`}</span></span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = showCaret(caret, newIdx);
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.green}>{formatSpecial(value[newIdx])}</span></span>);
      if (value[newIdx] === '"') {
        newIdx++;
        break;
      }
      newIdx++;
    }
    return {
      diff: newIdx - idx,
      html: <span key={idx}>{[...chars]}</span>
    }
  }

  return {
    diff: 1,
    html: <span key={idx}>{hasCaret}{char}</span>
  };
}

const formatter = (value, caret) => {
  if (!value) return <Caret />;
  let idx = 0;
  const res = [];
  while (idx < value.length) {
    const { html, diff } = getHtml(value, idx, caret);
    res.push(html)
    idx = idx + diff
  }
  if (caret === value.length) res.push(<Caret />)

  return res;
}

export default formatter;
