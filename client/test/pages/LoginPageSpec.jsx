import '../helper/TestHelper.js';
import {LoginPage} from '../../src/js/pages/LoginPage.jsx';

import { assert } from 'chai';
import React from 'react/addons';
import ReactDOM from 'react-dom';


let TestUtils = React.addons.TestUtils;

describe('login page component', function(){
  before('login page component', function() {
    let errorMessage = 'invalid credentials';
    this.loginPage = TestUtils.renderIntoDocument(
        <LoginPage errorMessage={errorMessage}/>
    );
  });

  it('should have login component with ref as string login', function() {
    let loginDOM = ReactDOM.findDOMNode(this.loginPage.refs.login);
    assert.strictEqual('login', loginDOM.getAttribute('id'));
  });

  it('should have props errorMessage as invalid credentials', function() {
    assert.strictEqual('invalid credentials', this.loginPage.props.errorMessage);
  });
});
