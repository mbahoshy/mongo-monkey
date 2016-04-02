import { combineReducers } from 'redux'


function loading (state = false, action) {
  switch (action.type) {
    default:
      return state;
  }
}


export default combineReducers({ loading });
