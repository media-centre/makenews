import Login from '../src/js/Login.jsx';

import jsdom from 'jsdom';
import sinon from 'sinon';
import { assert } from 'chai';
import ReactDOM from 'react-dom';
import React from 'react/addons';
import './helper/TestHelper.js';

let TestUtils = React.addons.TestUtils;

describe('login component', function(){

  before('render and locate element', function() {
    this.loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={""} />
    );
  });

  it('user name element type should be text', function() {
    let userNameInputDOM = ReactDOM.findDOMNode(this.loginComponent.refs.userName);
    assert.strictEqual('text', userNameInputDOM.getAttribute('type'), 'user name element type is not a text');
  });

  it('password element type should be password', function() {
    let passwordInputDOM = ReactDOM.findDOMNode(this.loginComponent.refs.password);
    assert.strictEqual('password', passwordInputDOM.getAttribute('type'), 'password element type is not a password');
  });

  it('error message should be empty', function() {
    let errorElementDOM = ReactDOM.findDOMNode(this.loginComponent.refs.errorMessage);
    assert.strictEqual('', errorElementDOM.innerHTML, 'error message is not empty');
  });

  it('error message should be invalid credentials', function() {
    let loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={"invalid credentials"} />
    );
    let errorElementDOM = ReactDOM.findDOMNode(loginComponent.refs.errorMessage);
    assert.strictEqual('invalid credentials', errorElementDOM.innerHTML, 'unexpected error message received');
  });

  it('submit button click should call login action call back' , function() {
    let onSubmitCallback = sinon.spy();
    let loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => onSubmitCallback(userName, password)} errorMessage={""} />
    );

    let buttonElementDOM = ReactDOM.findDOMNode(loginComponent.refs.submit);
    TestUtils.Simulate.submit(buttonElementDOM);
    assert.isTrue(onSubmitCallback.called);
  });

});
