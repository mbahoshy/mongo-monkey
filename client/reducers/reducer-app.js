import { combineReducers } from 'redux'


function results (state=[], action) {
  switch (action.type) {
    case "POST_QUERY_SUCCESS":
      return action.payload;
    case "POST_QUERY_FAIL":
      return [];
    default:
      return state;
  }
}

function recentQueries (state=[], action) {
  switch (action.type) {
    case "SET_RECENT_QUERIES":
      return action.payload;
    default:
      return state;
  }
}

function activeTab (state=0, action) {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return action.payload;
    case "POST_QUERY_SUCCESS":
      return 0;
    default:
      return state;
  }
}

function databases (state=null, action) {
  switch (action.type) {
    case "POST_HOST_SUCCESS":
      return action.payload.databases;
    default:
      return state;
  }
}

function activeHost (state=null, action) {
  switch (action.type) {
    case "POST_HOST_SUCCESS":
      return action.payload.host;
    default:
      return state;
  }
}

function activeDb (state=null, action) {
  switch (action.type) {
    case "SET_ACTIVE_DB":
      return action.payload;
    default:
      return state;
  }
}

function connections (state = [], action) {
  switch (action.type) {
    case 'GET_CONNECTIONS':
    case 'SET_CONNECTIONS':
      return action.payload ? action.payload : [];
    default:
      return state;
  }
}

function resultKey (state = null, action) {
  switch (action.type) {
    case 'POST_QUERY_SUCCESS':
      return new Date().getTime();
    default:
      return state;
  }
}

function showRecentQueries(state = false, action) {
  switch (action.type) {
    case 'TOGGLE_RECENT_QUERIES':
      return !state;
    default:
      return state;
  }
}

export default combineReducers({results, activeTab, databases, activeDb, activeHost, connections, resultKey, recentQueries, showRecentQueries})
