import { combineReducers } from 'redux'


function loading (state = {}, action) {
  switch (action.type) {
    case "POST_QUERY_SUBMIT":
      return Object.assign({}, state, { queryLoading: true });
    case "POST_QUERY_FAIL":
    case "POST_QUERY_SUCCESS":
      return Object.assign({}, state, { queryLoading: false });
    default:
      return state;
  }
}


export default combineReducers({ loading });
