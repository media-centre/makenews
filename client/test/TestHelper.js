import jsdom from 'jsdom';
import './TestHelper.js';
import React from 'react/addons';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

let TestUtils = React.addons.TestUtils;

export function elementsHashById(component, tagName) {
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

export function element(component, tagName, id) {
    return elementsHashById(component, tagName)[id];
}
