/*eslint react/jsx-no-bind:0*/
import { SourcePane } from "../../../src/js/config/components/SourcePane";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Sources from "../../../src/js/config/components/Sources";
import AddUrl from "./../../../src/js/config/components/AddUrl";
import FacebookTabs from "../../../src/js/config/components/FacebookTabs";
import { findAllWithType } from "react-shallow-testutils";
import { PROFILES, GROUPS } from "./../../../src/js/config/actions/FacebookConfigureActions";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import * as AddUrlActions from "./../../../src/js/config/actions/AddUrlActions";
import { shallow } from "enzyme";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("SourcePane", () => {
    const sandbox = sinon.sandbox.create();
    const dispatchFun = () => {};

    beforeEach("SourcePane", () => {
        const configurePage = {
            "header": {},
            "addCustomUrl": {
                "name": "Add custom url"
            },
            "addAll": "Add All"
        };

        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });
    });

    afterEach("sourcePane", () => {
        sandbox.restore();
    });

    describe("Sources", () => {
        let result = null;

        beforeEach("Sources", () => {
            let renderer = TestUtils.createRenderer();
            renderer.render(<SourcePane dispatch={dispatchFun} currentTab={PROFILES}/>);
            result = renderer.getRenderOutput();
        });

        afterEach("Sources", () => {
            sandbox.restore();
        });

        it("should have configure-action div", () => {
            const [, configAction] = result.props.children;
            expect(configAction.type).to.equal("div");
            expect(configAction.props.children).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
            expect(configAction.props.className).to.equal("configure-actions");
        });

        it("should have Sources", () => {
            const renderedSources = findAllWithType(result, Sources);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });

    describe("configure-actions", () => {

        afterEach("configure-actions", () => {
            sandbox.restore();
        });

        it("should have a button add-custom-url", () => {
            const wrapper = shallow(<SourcePane dispatch={dispatchFun} currentTab={SourceConfigActions.WEB}/>);
            const customUrl = wrapper.find(".add-custom-url");

            const [icon, text] = customUrl.node.props.children;

            expect(icon.props.className).to.equals("icon fa fa-plus");
            expect(text).to.equals("Add custom url");
        });

        it("should not have a button add-custom-url if current-source type is GROUPS", () => {
            const wrapper = shallow(<SourcePane dispatch={dispatchFun} currentTab={GROUPS}/>);
            const customUrl = wrapper.find(".add-custom-url");

            expect(customUrl.get(0)).to.be.undefined; //eslint-disable-line
        });

        it("should render Add url component if showAddUrl is true", () => {
            const wrapper = shallow(<SourcePane dispatch={dispatchFun} currentTab={SourceConfigActions.WEB} showAddUrl/>);

            const addUrl = wrapper.find(AddUrl);
            expect(addUrl).not.to.be.undefined; //eslint-disable-line no-unused-expressions
        });

        it("should not render Sources if showAddUrl is true", () => {
            const wrapper = shallow(<SourcePane dispatch={dispatchFun} currentTab={SourceConfigActions.WEB} showAddUrl/>);

            expect(wrapper.find(Sources).get(0)).to.be.undefined; //eslint-disable-line
        });

        it("should dispatch showAddUrl if we click on add-custom-url", () => {
            const dispatchSpy = sandbox.spy();
            const showAddUrlSpy = sandbox.spy();
            sandbox.stub(AddUrlActions, "showAddUrl").returns(showAddUrlSpy);

            const wrapper = shallow(<SourcePane dispatch={dispatchSpy} currentTab={SourceConfigActions.WEB}/>);
            const customUrl = wrapper.find(".add-custom-url");

            customUrl.simulate("click");

            expect(dispatchSpy.calledWith(showAddUrlSpy)).to.be.true; //eslint-disable-line no-unused-expressions
        });

        it("should have a button add-all", () => {
            const wrapper = shallow(<SourcePane dispatch={dispatchFun} currentTab={SourceConfigActions.WEB}/>);
            const addAllBtn = wrapper.find(".add-all");

            const [icon, text] = addAllBtn.node.props.children;

            expect(icon.props.className).to.equals("icon fa fa-plus-circle");
            expect(text).to.equals("Add All");
        });

        it("should dispatch add All Sources when we click on add-all button", () => {
            const addAllSourcesSpy = sandbox.spy();
            sandbox.stub(SourceConfigActions, "addAllSources").returns(addAllSourcesSpy);
            const dispatchSpy = sandbox.spy();
            const wrapper = shallow(<SourcePane dispatch={dispatchSpy} currentTab={SourceConfigActions.WEB}/>);
            const addAllBtn = wrapper.find(".add-all");

            addAllBtn.simulate("click");

            expect(dispatchSpy.calledWith(addAllSourcesSpy)).to.be.true; //eslint-disable-line no-unused-expressions
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

        it(`should not have facebook tabs component if current tab is ${SourceConfigActions.WEB}`, () => {
            renderer.render(<SourcePane sources={sources} dispatch={dispatchFun} currentTab={SourceConfigActions.WEB}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });

        it(`should not have facebook tabs component if current tab is ${SourceConfigActions.TWITTER}`, () => {
            renderer.render(<SourcePane sources={sources} dispatch={dispatchFun} currentTab={SourceConfigActions.TWITTER}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(0); //eslint-disable-line no-magic-numbers
        });

        it("should have facebook tabs component", () => {
            renderer.render(<SourcePane sources={sources} dispatch={dispatchFun} currentTab={PROFILES}/>);
            result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, FacebookTabs);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });
});
