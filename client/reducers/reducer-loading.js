import { combineReducers } from 'redux'


function loading (state = {}, action) {
  switch (action.type) {
    case "POST_QUERY_SUBMIT":
      return Object.assign({}, state, { queryLoading: true });
    case "POST_QUERY_FAIL":
    case "POST_QUERY_SUCCESS":
      return Object.assign({}, state, { queryLoading: false });
    case "POST_HOST_SUBMIT":
      return Object.assign({}, state, { dbLoading: true });
    case "POST_HOST_FAIL":
    case "POST_HOST_SUCCESS":
      return Object.assign({}, state, { dbLoading: false });
    default:
      return state;
  }
}


export default combineReducers({ loading });
