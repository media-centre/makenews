import './helper/TestHelper.js';
import {App} from '../src/js/App.jsx';
import ShallowTestingHelper from './helper/ShallowTestingHelper.js';

import { assert } from 'chai';
import React from 'react/addons';


let TestUtils = React.addons.TestUtils;

describe('application component', function(){
  before('render and locate element', function() {
    let appStore = {
      errorMessage: 'invalid credentials'
    };
    this.renderer = TestUtils.createRenderer();
    this.renderer.render(<App login={appStore}/>);
    this.vdom = this.renderer.getRenderOutput();
    this.loginComponents = ShallowTestingHelper.filterChildrenElements(this.vdom.props.children, 'login');
  });

  it('should have login component with ref as string login', function() {
    assert.strictEqual(1, this.loginComponents.length);
  });

  it('should have props errorMessage as invalid credentials', function() {
    assert.strictEqual('invalid credentials', this.loginComponents[0].props.errorMessage);
  });

  it('should have login click call back', function() {
    assert.notStrictEqual('',this.loginComponents[0].props.onLoginClick);
  });

});
