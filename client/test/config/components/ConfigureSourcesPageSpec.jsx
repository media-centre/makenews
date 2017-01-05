import { ConfigureSourcesPage } from "./../../../src/js/config/components/ConfigureSourcesPage";
import FacebookLogin from "./../../../src/js/facebook/FacebookLogin";
import React from "react";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";
import { findAllWithType } from "react-shallow-testutils";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import ConfiguredSources from "./../../../src/js/config/components/ConfiguredSources";
import ConfigurePane from "./../../../src/js/config/components/ConfigurePane";
import { expect } from "chai";

describe("ConfigureSourcesPage", () => {
    let ZERO = 0, ONE = 1;
    describe("switchSourceTab", () => {
        let sandbox = null, renderer = null;

        beforeEach("switchSourceTab", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(FacebookLogin, "instance").returns({});
            renderer = TestUtils.createRenderer();
            /* we have to render it twice inorder to trigger componentwillreviceprops because of shallow rendering*/ // eslint-disable-line
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "bla" }} dispatch={()=>{}} />
            );
        });

        afterEach("switchSourceTab", () => {
            sandbox.restore();
        });

        it("should dispatch switchSourceTab with WEB if configure sourceType is web", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("web");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "web" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with PROFILES if configure sourceType is facebook and subType is PROFILE", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("profiles");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "profiles" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });
    });

    describe("children", () => {
        let renderer = null;
        let result = null, sandbox = null;

        beforeEach("children", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(FacebookLogin, "instance").returns({});
        });

        afterEach("children", () => {
            sandbox.restore();
        });

        it("should have ConfiguredSources component", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={()=>{}}/>);
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfiguredSources);
            expect(configuredSources).to.have.lengthOf(ONE);
        });

        it("should have ConfigurePage component", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={()=>{}}/>);
            result = renderer.getRenderOutput();
            let configurePane = findAllWithType(result, ConfigurePane);
            expect(configurePane).to.have.lengthOf(ONE);
        });

        xit("should not have ConfiguredSources component if sourceType is facebook and expireTime is ZERO", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={()=>{}} expireTime={ZERO}/>);
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfiguredSources);
            expect(configuredSources).to.have.lengthOf(ZERO);
        });


        xit("should not have ConfiguredSources component if sourceType is twitter and twitterAuthenticated is False", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "twitter" }} dispatch={()=>{}} twitterAuthenticated={false}/>);
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfiguredSources);
            expect(configuredSources).to.have.lengthOf(ZERO);
        });

        it("should have ConfiguredSources component if sourceType is twitter and twitterAuthenticated is true", () => {
            renderer = TestUtils.createRenderer();
            renderer = TestUtils.createRenderer();
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "twitter" }} dispatch={()=>{}} twitterAuthenticated={true}/>); //eslint-disable-line
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfigurePane);
            expect(configuredSources).to.have.lengthOf(ONE);
        });
    });
});
