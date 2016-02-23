/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import AppSessionStorage from "../../../src/js/utils/AppSessionStorage.js";
import Logout from "../../../src/js/login/components/Logout.jsx";
import DbSession from "../../../src/js/db/DbSession";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import { assert } from "chai";
import sinon from "sinon";
import "../../helper/TestHelper.js";
import ReactDOM from "react-dom";

describe("Logout", () => {
    let logoutComponent = null, logoutButton = null;

    before("Logout", () => {
        logoutButton = {
            "Name": "Logout Test"
        };

        logoutComponent = TestUtils.renderIntoDocument(
            <Logout logoutButton={logoutButton}/>
        );
    });

    it("should have Logout", () => {
        let listComponents = TestUtils.scryRenderedComponentsWithType(logoutComponent, Link);
        expect(listComponents[0].props.to).to.equal("/");
        expect(listComponents[0].props.className).to.equal("link highlight-on-hover");
    });

    it("Logout OnClick event", () => {
        let listComponents = TestUtils.scryRenderedComponentsWithType(logoutComponent, Link);
        TestUtils.Simulate.click(listComponents[0]);
    });

    it("should display the button name from the locale file", () => {
        assert.strictEqual("Logout Test", logoutComponent.refs.logoutLabel.innerHTML);
    });

    it("should clear the authsession cookie and localstorage on logout", () => {
        let sandbox = sinon.sandbox.create();
        let appSessionStorage = new AppSessionStorage();
        let ajaxClient = new AjaxClient();
        sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        let appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("clear");
        sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
        let ajaxClientMock = sandbox.mock(ajaxClient).expects("get");
        sandbox.stub(DbSession, "clearInstance").returns(ajaxClient);
        let linkElementDOM = ReactDOM.findDOMNode(logoutComponent.refs.logoutLink);
        TestUtils.Simulate.click(linkElementDOM);

        appSessionStorageClearMock.verify();
        ajaxClientMock.verify();
        sandbox.restore();

    });
});

