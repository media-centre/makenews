import './helper/TestHelper.js';
import {App} from '../src/js/App.jsx';

import { assert } from 'chai';
import React from 'react/addons';

let TestUtils = React.addons.TestUtils;

describe('app component', function(){
  it('should have two children in properties', function() {
    let children = [<App key="1"/>, <App key="2"/>];
    this.loginPage = TestUtils.renderIntoDocument(
        <App children={children}/>
    );
    assert.strictEqual(2, this.loginPage.props.children.length);
  });
});
