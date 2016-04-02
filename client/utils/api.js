// api
import fetch from 'isomorphic-fetch'

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  const error = new Error(res.statusText);
  error.response = res;
  throw error;
}

export function post (url, body, qs, next) {
  return fetch(url, {
    credentials: 'same-origin',
    method:'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(checkStatus)
  .then(res => res.json())
  .then(result => {
  	next(null, result)
  })
  .catch(err => {
    next(err);
  });
}

export function put (url, body, qs, next) {
  return fetch(url, {
    credentials: 'same-origin',
    method:'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(result => {
    next(null, result)
  })
  .catch(err => {
    next(err);
  });
}

export function get(url, qs, next) {
 return fetch(url, {
    credentials: 'same-origin',
    method:'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(result => {
    next(null, result)
  })
  .catch(err => {
    next(err);
  });
}
