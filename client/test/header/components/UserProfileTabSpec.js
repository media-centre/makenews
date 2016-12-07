import UserProfileTab from "./../../../src/js/header/components/UserProfileTab";
import UserProfile from "./../../../src/js/header/components/UserProfile";
import React from "react";
import TestUtils from "react-addons-test-utils";
import ReactDOM from "react-dom";
import { expect, assert } from "chai";
import { findAllWithType } from "react-shallow-testutils";

describe("UserProfileTab", () => {
    
    it("should have toggle option", () => {
        let userProfile = TestUtils.renderIntoDocument(<UserProfileTab />);
        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-profile__image"));
        assert.isTrue(userProfile.state.show);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-profile__image"));
        assert.isFalse(userProfile.state.show);
    });

    it("should have main header tabs component", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<UserProfileTab />);
        let result = renderer.getRenderOutput();
        let renderedSources = findAllWithType(result, UserProfile);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });
});
