// import React from 'react';


export const methodSuggestions = [
  { value: 'aggregate()', caretOffset: 0 },
  { value: 'count()', caretOffset: 0 },
  { value: 'createCollection()', caretOffset: -1 },
  { value: 'createIndex()', caretOffset: -1 },
  { value: 'distinct()', caretOffset: -1 },
  { value: 'drop()', caretOffset: 0 },
  { value: 'find()', caretOffset: -1 },
  { value: 'findOne()', caretOffset: -1 },
  { value: 'findAndModify()', caretOffset: -1 },
  { value: 'getCollectionNames()', caretOffset: 0 },
  { value: 'getSiblingDB()', caretOffset: -1 },
  { value: 'group()', caretOffset: -1 },
  { value: 'insert()', caretOffset: -1 },
  { value: 'limit()', caretOffset: -1 },
  { value: 'remove()', caretOffset: -1 },
  { value: 'save()', caretOffset: -1 },
  { value: 'sort()', caretOffset: -1 },
  { value: 'toArray()', caretOffset: 0 },
  { value: 'update()', caretOffset: -1 },
  { value: 'updateOne()', caretOffset: -1 },
];

export const operatorSuggestions = [
  { value: 'geoNear', caretOffset: 0 },
  { value: 'group', caretOffset: 0 },
  { value: 'in', caretOffset: 0 },
  { value: 'match', caretOffset: 0 },
  { value: 'set', caretOffset: 0 },
  { value: 'sum', caretOffset: 0 },
  { value: 'sort', caretOffset: 0 },
]

export const generalSuggestions = [
  { value: 'ObjectID()', caretOffset: -1 },
]


export const specialCodes = [
  186, // ;
  222, // '
  221, // ]
  219, // [
  190, // .
]

export const specialCodesDic = [
  ';',
  "'",
  ']',
  '[',
  '.',
]

export const shiftCodes = [
  57, // (
  48, // )
  186, // :
  222, // "
  221, // }
  219, // {
]

export const shiftCodesDic = [
  '(',
  ')',
  ':',
  '"',
  '}',
  '{',
]

export const getSuggestions = (collections, search, caret) => {
  if (search.length < 3) return [];

  const typing = search.substring(0, caret);

  const mappedCollections = collections.map(v => ({ value: v, caretOffset: 0 }));

  const collectionCheck = checkSuggestions(mappedCollections, 'db.', typing, search);
  if (collectionCheck.length > 0) return collectionCheck;

  const methodCheck = checkSuggestions(methodSuggestions, '.', typing, search);
  if (methodCheck.length > 0) return methodCheck;

  const operatorCheck = checkSuggestions(operatorSuggestions, '$', typing, search);
  if(operatorCheck.length > 0) return operatorCheck;

  const generalCheck = checkSuggestions(generalSuggestions, ' ', typing, search);
  if (generalCheck.length > 0) return generalCheck;

  return [];
};

const checkSuggestions = (arr, base, typing, fullsearch) => {
  if (typing.indexOf(base) === -1) return [];

  const trimmedFull = fullsearch.substring(typing.lastIndexOf(base))
  const search = typing.substring(typing.lastIndexOf(base));

  if (search.length < base.length + 1) return [];

  return arr.filter(v => {
    const { value } = v;
    const compare = `${base}${value.toLowerCase()}`;
    if (trimmedFull.substring(0, compare.length).trim() === compare.trim()) return false;
    if (compare.trim() === search.trim()) return false;
    if (compare.indexOf(search) === 0) return true;
    return false;
  }).map(v => {
    const { value, caretOffset } = v;
    const compare = `${base}${value.toLowerCase()}`;
    return {
      base,
      prev: value.substring(0, (search.length - base.length)),
      next: value.substring(search.length - base.length, value.length),
      caretOffset }
  })
};

export const getCaret = (el) => {
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

export const setSelectionRange = (input, selectionStart, selectionEnd) => {
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
