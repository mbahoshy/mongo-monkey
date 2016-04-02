import { combineReducers } from 'redux'


function results (state=[], action) {
  switch (action.type) {
    case "POST_QUERY_SUCCESS":
      return action.payload;
    default:
      return state;
  }
}

function activeTab (state=0, action) {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return action.payload;
    default:
      return state;
  }
}

function databases (state=null, action) {
  switch (action.type) {
    case "POST_HOST_SUCCESS":
      return action.payload;
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


export default combineReducers({results, activeTab, databases, activeDb, connections})
