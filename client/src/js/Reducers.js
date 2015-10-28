import { USER_LOGEDIN } from './Actions';
import { combineReducers } from 'redux';

function login(state={}, action) {
  switch (action.type) {
    case USER_LOGEDIN:
      return action.json;
    default:
      return state;
  }
}

const contentDiscoveryApp = combineReducers({
  login
});

export default contentDiscoveryApp;
