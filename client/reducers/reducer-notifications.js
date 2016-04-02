import { combineReducers } from 'redux'


function notifications (state = null, action) {
  switch (action.type) {
    case 'POST_HOST_FAIL':
    case 'POST_QUERY_FAIL':
      alert(action.err);
      return state;
    default:
      return state;
  }
}


export default combineReducers({ notifications });
