import React from 'react';

const colors = {
  blue: { color: 'blue' },
  green: { color: 'green' },
  orange: { color: 'orange' },
  red: { color: 'red' },
  black: { color: 'black' },
  cursor: { letterSpacing: '-4px', marginLeft: '-4px', textDecoration: 'blink', color: 'black' },
};

const getHtml = (value, idx, caret, hasCaret, endCaret) => {
  const char = value[idx];

  // map caret to string position
  const accepted = ['}', ' ', ',', '\n'];
  const another = [' ', ':'];
  if ((!value[idx - 1] || another.indexOf(value[idx - 1]) !== -1) && (!value[idx + 4] || accepted.indexOf(value[idx + 4]) !== -1) && value.slice(idx, idx + 4) === 'true') {
    console.dir(value[idx]);
    console.dir(value[idx + 4]);
    return {
      diff: 4,
      html: <span key={idx} style={colors.orange}>{hasCaret}{`true`}{endCaret}</span>
    };
  }

  if ((!value[idx - 1] || value[idx - 1] === ' ') && value.slice(idx, idx + 5) === 'false') {
    return {
      diff: 5,
      html: <span key={idx} style={colors.orange}>{hasCaret}{`false`}{endCaret}</span>
    };
  }

  if (char === ':' || char === ',') {
    return {
      diff: 1,
      html: <span key={idx} style={colors.black}>{hasCaret}{char}{endCaret}</span>
    };
  }

  if (char === '\n') {
    return {
      diff: 1,
      html: <span key={idx}>{hasCaret}<br/>{endCaret}</span>
    };
  }
  if (char === ' ') {
    return {
      diff: 1,
      html: <span key={idx}>{hasCaret}&nbsp;{endCaret}</span>
    };
  }
  if (char === '{') {
    const chars = [<span key={idx}>{hasCaret}<span style={colors.blue}>{`{`}</span>{endCaret}</span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = caret === newIdx ? <span style={colors.cursor} className="blink">|</span> : '';
      const newEndCaret = caret === newIdx + 1 ? <span style={colors.cursor} className="blink">|</span> : '';
      if (value[newIdx] === '}') break;
      const { html, diff } = getHtml(value, newIdx, caret, newHasCaret, newEndCaret);
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.red}>{html}</span>{newEndCaret}</span>);
      newIdx = newIdx + diff;
    }
    return {
      diff: newIdx - idx,
      html: <span key={idx}>{[...chars]}</span>
    }
  }
  if (char === '{' || char === '}') {
    return {
      diff: 1,
      html: <span>{hasCaret}<span key={idx} style={colors.blue}>{char}</span>{endCaret}</span>
    };
  }

  if (char === '\'') {
    const chars = [<span key={idx}>{hasCaret}<span style={colors.green}>{`'`}</span>{endCaret}</span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = caret === newIdx ? <span style={colors.cursor} className="blink">|</span> : '';
      const newEndCaret = caret === newIdx + 1 ? <span style={colors.cursor} className="blink">|</span> : '';
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.green}>{value[newIdx]}</span>{newEndCaret}</span>);
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
    const chars = [<span key={idx}>{hasCaret}<span style={colors.green}>{`"`}</span>{endCaret}</span>];
    let newIdx = idx + 1;
    while (newIdx < value.length) {
      const newHasCaret = caret === newIdx ? <span style={colors.cursor} className="blink">|</span> : '';
      const newEndCaret = caret === newIdx + 1 ? <span style={colors.cursor} className="blink">|</span> : '';
      chars.push(<span key={newIdx}>{newHasCaret}<span style={colors.green}>{value[newIdx]}</span>{newEndCaret}</span>);
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
    html: <span key={idx}>{hasCaret}{char}{endCaret}</span>
  };
}

const formatter = (value, caret) => {
  if (!value) return <span style={colors.cursor} className="blink">|</span>;
  let idx = 0;
  const res = [];
  while (idx < value.length) {
    const hasCaret = caret === idx ? <span style={colors.cursor} className="blink">|</span> : '';
    const endCaret = caret === idx + 1 ? <span style={colors.cursor} className="blink">|</span> : '';
    const { html, diff } = getHtml(value, idx, caret, hasCaret, endCaret);
    res.push(html)
    idx = idx + diff
  }

  return res;
}

export default formatter;
