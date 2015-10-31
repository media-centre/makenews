import React from 'react/addons';
let TestUtils = React.addons.TestUtils;

export default class ReactTestUtilitesHelper {
  static elementsHashById(component, tagName) {
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

  static element(component, tagName, id) {
      return ReactTestUtilitesHelper.elementsHashById(component, tagName)[id];
  }

}
