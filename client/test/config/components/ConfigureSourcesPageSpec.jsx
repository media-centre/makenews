import { ConfigureSourcesPage } from "./../../../src/js/config/components/ConfigureSourcesPage";
import React from "react";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";
import { findAllWithType } from "react-shallow-testutils";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import ConfiguredSources from "./../../../src/js/config/components/ConfiguredSources";
import ConfigurePane from "./../../../src/js/config/components/ConfigurePane";
import { expect } from "chai";

describe("ConfigureSourcesPage", () => {

    describe("switchSourceTab", () => {
        let sandbox = null, renderer = null;

        beforeEach("switchSourceTab", () => {
            sandbox = sinon.sandbox.create();
            renderer = TestUtils.createRenderer();
            /* we have to render it twice inorder to trigger componentwillreviceprops because of shallow rendering*/ // eslint-disable-line
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "bla" }} dispatch={()=>{}}/>
            );
        });

        afterEach("switchSourceTab", () => {
            sandbox.restore();
        });

        it("should dispatch switchSourceTab with WEB if configure sourceType is not in the desired list", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("WEB");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "bla" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with TWITTER if configure sourceType is twitter", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("TWITTER");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "twitter" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with WEB if configure sourceType is web", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("WEB");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "web" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with PROFILES if configure sourceType is facebook and subType is not the desired one", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("Profiles");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "bla" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with PROFILES if configure sourceType is profiles", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("Profiles");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "profiles" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with PAGES if configure sourceType is pages", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("Pages");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");

            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "pages" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });

        it("should dispatch switchSourceTab with GROUPS if configure sourceType is groups", () => {
            let switchTabsMock = sandbox.mock(SourceConfigActions)
                .expects("switchSourceTab").withArgs("Groups");
            let clearSourceMock = sandbox.mock(SourceConfigActions)
                .expects("clearSources");


            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook", "sourceSubType": "groups" }} dispatch={()=>{}}/>
            );

            clearSourceMock.verify();
            switchTabsMock.verify();
        });
    });

    describe("children", () => {
        let renderer = TestUtils.createRenderer();
        let result = null;
        beforeEach("children", () => {
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "bla" }} dispatch={()=>{}}/>);
            result = renderer.getRenderOutput();
        });

        it("should have ConfiguredSources component", () => {
            let configuredSources = findAllWithType(result, ConfiguredSources);
            expect(configuredSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });

        it("should have ConfigurePage component", () => {
            let configurePane = findAllWithType(result, ConfigurePane);
            expect(configurePane).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });

        it("should not have ConfiguredSources component if sourceType is facebook and expireTime is ZERO", () => {
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={()=>{}} expireTime = {0}/>);
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfiguredSources);
            expect(configuredSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });

        it("should not have ConfiguredSources component if sourceType is facebook and expireTime is ZERO", () => {
            renderer.render(
                <ConfigureSourcesPage store={{}} params={{ "sourceType": "facebook" }} dispatch={()=>{}} expireTime = {0}/>);
            result = renderer.getRenderOutput();
            let configuredSources = findAllWithType(result, ConfigurePane);
            expect(configuredSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });
    });
});
