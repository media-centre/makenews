import contentDiscoveryApp from '../src/js/Reducers.js';
import { assert } from 'chai';

describe('login reducer', function(){

  it('default state if action type is not handled', function() {
    let action = {type:"undefined"};
    let state = contentDiscoveryApp(undefined, action);
    assert.deepEqual(state, {login: { errorMessage: '' }});
  });

  it('should return error message incase of login failure', function() {
    let action = {type:'LOGIN_FAILED', responseMessage: "login failed"};
    let state = contentDiscoveryApp(undefined, action);
    assert.strictEqual(state.login.errorMessage, "login failed", 'unexpected error message returned');
  });

});