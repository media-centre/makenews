/*eslint react/jsx-no-bind:0*/
import { ConfigureSourcesPage } from "./../../../src/js/config/components/ConfigureSourcesPage";
import FacebookLogin from "./../../../src/js/facebook/FacebookLogin";
import React from "react";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";
import { findAllWithType } from "react-shallow-testutils";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import ConfiguredPane from "../../../src/js/config/components/ConfiguredPane";
import ConfigurePane from "./../../../src/js/config/components/ConfigurePane";
import { expect } from "chai";
import History from "./../../../src/js/History";
import Locale from "./../../../src/js/utils/Locale";

describe("ConfigureSourcesPage", () => {
    let ZERO = 0, ONE = 1;
    const mainHeaderStrings = {
        "newsBoard": "Scan News",
        "storyBoard": "Write a Story",
        "configure": "Configure"
    };
    const dispatchFun = () => {};

    describe("switchSourceTab", () => {
        let sandbox = null, renderer = null;
        beforeEach("switchSourceTab", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(FacebookLogin, "instance").returns({});
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "mainHeaderStrings": mainHeaderStrings
                }
            });
            renderer = TestUtils.createRenderer();
            /* we have to render it twice inorder to trigger componentwillreviceprops because of shallow rendering*/ // eslint-disable-line
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "bla" }} sourcesAuthenticationInfo = {{ "facebook": true }} dispatch={dispatchFun} />
            );
        });

        afterEach("switchSourceTab", () => {
            sandbox.restore();
        });

        it("should dispatch switchSourceTab with WEB if configure sourceType is web", () => {
            const switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("web");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "web" }} dispatch={dispatchFun}/>
            );

            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with GROUPS if configure sourceType is facebook and subType is groups", () => {
            const switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("groups");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "groups" }} dispatch={dispatchFun}/>
            );

            switchTabsMock.verify();
        });

        it("should redirect to /configure/web if currentSource type is some random", () => {
            const historyPushSpy = sandbox.spy();
            sandbox.stub(History, "getHistory").returns({ "push": historyPushSpy });

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "random" }} dispatch={dispatchFun}/>
            );

            expect(historyPushSpy.calledWith("/configure/web")).to.be.true; //eslint-disable-line no-unused-expressions
        });
    });

    describe("children", () => {
        let renderer = null;
        let result = null, sandbox = null;

        beforeEach("children", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(FacebookLogin, "instance").returns({});
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "mainHeaderStrings": mainHeaderStrings
                }
            });
        });

        afterEach("children", () => {
            sandbox.restore();
        });

        it("should have ConfiguredSources component", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={dispatchFun}/>);
            result = renderer.getRenderOutput();
            let configuredPane = findAllWithType(result, ConfiguredPane);
            expect(configuredPane).to.have.lengthOf(ONE);
        });

        it("should have ConfigurePage component", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={dispatchFun}/>);
            result = renderer.getRenderOutput();
            let configurePane = findAllWithType(result, ConfigurePane);
            expect(configurePane).to.have.lengthOf(ONE);
        });

        xit("should not have ConfiguredSources component if sourceType is facebook and expireTime is ZERO", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={dispatchFun} expireTime={ZERO}/>);
            result = renderer.getRenderOutput();
            let configuredPane = findAllWithType(result, ConfiguredPane);
            expect(configuredPane).to.have.lengthOf(ZERO);
        });


        xit("should not have ConfiguredSources component if sourceType is twitter and twitterAuthenticated is False", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "twitter" }} dispatch={dispatchFun} twitterAuthenticated={false}/>);
            result = renderer.getRenderOutput();
            let configuredPane = findAllWithType(result, ConfiguredPane);
            expect(configuredPane).to.have.lengthOf(ZERO);
        });

        it("should have ConfiguredSources component if sourceType is twitter and twitterAuthenticated is true", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "twitter" }} dispatch={dispatchFun} twitterAuthenticated={true}/>); //eslint-disable-line react/jsx-boolean-value
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfigurePane);
            expect(configuredSources).to.have.lengthOf(ONE);
        });
    });
});
