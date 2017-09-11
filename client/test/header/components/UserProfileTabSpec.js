import UserProfileTab from "./../../../src/js/header/components/UserProfileTab";
import UserProfile from "./../../../src/js/user/UserProfile";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import { findAllWithType } from "react-shallow-testutils";
import sinon from "sinon";
import AppSessionStorage from "./../../../src/js/utils/AppSessionStorage";

describe("UserProfileTab", () => {
    let renderer = null, result = null, sandbox = sinon.sandbox.create();

    beforeEach("UserProfileTab", () => {
        renderer = TestUtils.createRenderer();
        renderer.render(<UserProfileTab />);
        result = renderer.getRenderOutput();
    });

    afterEach("UserProfileTab", () => {
        sandbox.restore();
    });

    it("should have User Profile component", () => {
        let renderedSources = findAllWithType(result, UserProfile);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });

    it("should have user profile div", ()=> {
        expect(result.type).to.be.equals("div");
        expect(result.props.className).to.be.equals("user-profile");
    });

    it("should have image", ()=> {
        let [img] = result.props.children;

        expect(img.type).to.be.equals("span");
        expect(img.props.className).to.be.equals("user-profile__image");
        expect(img.props.children.type).to.be.equals("img");
        expect(img.props.children.props.src).to.be.equals("./images/userprofile-icon.png");
    });

    it("should have default name as user", ()=> {
        let [, name] = result.props.children;

        expect(name.type).to.be.equals("span");
        expect(name.props.className).to.be.equals("user-profile__name");
        expect(name.props.children).to.be.equals("user");
    });

    it("should have name", ()=> {
        const appSessionStorage = AppSessionStorage.instance();
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        sandbox.stub(appSessionStorage, "getValue").withArgs("UserName").returns("user");
        renderer.render(<UserProfileTab />);
        result = renderer.getRenderOutput();
        const [, name] = result.props.children;

        expect(name.props.children).to.be.equals("user");
    });

    it("should have down arrow", ()=> {
        let [, , arrow] = result.props.children;

        expect(arrow.type).to.be.equals("span");
        expect(arrow.props.className).to.be.equals("user-profile__downarrow");
        expect(arrow.props.children.type).to.be.equals("i");
        expect(arrow.props.children.props.className).to.be.equals("fa fa-caret-down");
    });

    it("should have dropdown", ()=> {
        let [, , , dropdown] = result.props.children;

        expect(dropdown.type).to.be.equals("div");
        expect(dropdown.props.className).to.be.equals("user-profile__dropdown");
    });
});
