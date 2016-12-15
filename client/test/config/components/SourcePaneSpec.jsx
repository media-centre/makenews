import SourcePane from "../../../src/js/config/components/SourcePane";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Sources from "../../../src/js/config/components/Sources";
import FacebookTabs from "../../../src/js/config/components/FacebookTabs";
import { findAllWithType } from "react-shallow-testutils";
import { PROFILES } from "./../../../src/js/config/actions/FacebookConfigureActions";
import { WEB, TWITTER } from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("SourcePane", () => {

    describe("Sources", () => {
        let sources = null;
        let result = null;

        beforeEach("Sources", () => {
            sources = [
                { "name": "Profile 1" }
            ];
            let renderer = TestUtils.createRenderer();
            renderer.render(<SourcePane sources={sources} dispatch={()=>{}} currentTab={PROFILES}/>);
            result = renderer.getRenderOutput();
        });

        it("should have add all button", () => {
            let [, button] = result.props.children;
            expect(button.type).to.equal("button");
        });

        /* TODO: write the test case*/ //eslint-disable-line no-warning-comments,no-inline-comments
        it("add all button should dispatch allAllSources on click", () => {

        });

        it("should have Sources", () => {
            let renderedSources = findAllWithType(result, Sources);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });

    describe("FacebookTabs", () => {
        let sources = null;
        let result = null, renderer = null;
        beforeEach("FacebookTabs", () => {
            sources = [
                { "name": "Profile 1" }
            ];
            renderer = TestUtils.createRenderer();
        });

        it(`should not have facebook tabs component if current tab is ${WEB}`, () => {
            renderer.render(<SourcePane sources={sources} dispatch={()=>{}} currentTab={WEB}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });

        it(`should not have facebook tabs component if current tab is ${TWITTER}`, () => {
            renderer.render(<SourcePane sources={sources} dispatch={()=>{}} currentTab={TWITTER}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });

        it("should have facebook tabs component", () => {
            renderer.render(<SourcePane sources={sources} dispatch={()=>{}} currentTab={PROFILES}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });
});
