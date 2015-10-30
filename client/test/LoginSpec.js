import Login from '../src/js/Login.js';

import jsdom from 'jsdom';
import sinon from 'sinon';
import { assert } from 'chai';
import React from 'react/addons';
import './TestHelper.js';

let TestUtils = React.addons.TestUtils;

export default function elementsHashById(component, tagName) {
        let elements = TestUtils.scryRenderedDOMComponentsWithTag(
          component,
          tagName
        );

        let elementsJson = {};
        for(var element of elements) {
            elementsJson[element.getAttribute('id')] = element;
        }
        return elementsJson;
}

export default function element(component, tagName, id) {
    return elementsHashById(component, tagName)[id];
}



describe('login component', function(){

  before('render and locate element', function() {
    this.loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={""} />
    );
  });

  it('user name element type should be text', function() {
    let userNameElement = element(this.loginComponent, "input", "userName");
    assert.strictEqual(userNameElement.getAttribute('type'), 'text', 'user name element type is not a text');
  });

  it('password element type should be password', function() {
    let passwordElement = element(this.loginComponent, "input", "password");
    assert(passwordElement.getAttribute('type'), 'password', 'password element type is not password');
  });

  it('error message should be empty', function() {
    let errorElement = element(this.loginComponent, "p", "errorMessage");
    assert.strictEqual(errorElement.innerHTML, '', 'error message is not empty');
  });

  it('error message should be invalid credentials', function() {
    let loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => dispatch(userLogin(userName, password))} errorMessage={"invalid credentials"} />
    );
    let errorElement = element(loginComponent, "p", "errorMessage");

    assert.strictEqual(errorElement.innerHTML, 'invalid credentials', 'unexpected error message');
  });

  it('submit button click should call login action call back' , function() {
    let onSubmitCallback = sinon.spy();
    let loginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => onSubmitCallback(userName, password)} errorMessage={""} />
    );

    let buttonElement = element(loginComponent, "form", "login");
    TestUtils.Simulate.submit(buttonElement);
    assert.isTrue(onSubmitCallback.called);
  });

});

