/* eslint no-magic-numbers:0 */
import UserProfile from "../../../src/js/header/components/UserProfile";
import React from "react";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";

describe("UserProfile", () => {
    let div = null;
    beforeEach("UserProfile", () => {
        let renderer = TestUtils.createRenderer();
        div = renderer.render(<UserProfile />);
    });

    it("should have change password, help & FAQs and logout options", () => {
        let children = div.props.children;
        expect(children.props.children.length).to.equal(3);
        expect(children.props.children[0].props.children).to.equal("Change Password");
        expect(children.props.children[1].props.children).to.equal("Help & FAQs");
        expect(children.props.children[2].props.children).to.equal("Logout");
    });
});