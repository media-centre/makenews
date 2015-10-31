import contentDiscoveryApp from '../src/js/Reducers.js';
import { assert } from 'chai';

describe('login reducer', function(){

  it('default state if action type is not handled', function() {
    let action = {type:"undefined"};
    let state = contentDiscoveryApp(undefined, action);
    assert.deepEqual({login: { errorMessage: '' }}, state);
  });

  it('should return error message incase of login failure', function() {
    let action = {type:'LOGIN_FAILED', responseMessage: "login failed"};
    let state = contentDiscoveryApp(undefined, action);
    assert.strictEqual("login failed", state.login.errorMessage);
  });

});
