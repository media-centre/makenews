/* eslint no-magic-numbers:0, react/jsx-no-bind:0 */
import { Header } from "./../../../src/js/header/components/Header";
import HeaderTab from "./../../../src/js/header/components/HeaderTab";
import ConfigureTab from "./../../../src/js/header/components/ConfigureTab";
import UserProfileTab from "./../../../src/js/header/components/UserProfileTab";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { findAllWithType } from "react-shallow-testutils";
import { shallow } from "enzyme";
import ConfirmPopup from "../../../src/js/utils/components/ConfirmPopup/ConfirmPopup";

describe("Header component", () => {
    let result = null;
    let currentHeaderTab = null;
    let mainHeaderStrings = null;
    let header = null; //eslint-disable-line no-unused-vars
    const dispatchFun = () => {};

    const store = {
        "getState": () => {
            return {
                "popUp": {
                    "message": "something",
                    "callback": () => {}
                }
            };
        }
    };

    beforeEach("Header component", () => {
        currentHeaderTab = "Scan News";
        mainHeaderStrings = {
            "newsBoard": "Scan News",
            "storyBoard": "Write a Story",
            "configure": "Configure"
        };
        const renderer = TestUtils.createRenderer();
        header = renderer.render(
            <Header store={store} dispatch={dispatchFun} mainHeaderStrings={mainHeaderStrings}
                currentHeaderTab={currentHeaderTab} confirmPopup={{ "message": "some message" }}
            />);
        result = renderer.getRenderOutput();
    });

    it("should have headerTab element", () => {
        const renderedSources = findAllWithType(result, HeaderTab);
        expect(renderedSources).to.have.lengthOf(2);
    });

    it("should have ConfigureTab element", () => {
        const renderedSources = findAllWithType(result, ConfigureTab);
        expect(renderedSources).to.have.lengthOf(1);
    });

    it("should have UserProfileTab element", () => {
        const renderedSources = findAllWithType(result, UserProfileTab);
        expect(renderedSources).to.have.lengthOf(1);
    });

    it("should not render anything if currentHeaderTab is Configure", () => {
        const headerDOM = shallow(<Header store={store} dispatch={dispatchFun} mainHeaderStrings ={mainHeaderStrings} currentHeaderTab="Configure" confirmPopup={{ "message": "" }}/>);

        expect(headerDOM.get(0)).to.be.null; //eslint-disable-line no-unused-expressions
    });

    describe("ConfirmPopup", () => {
        it("should have ConfirmPopup element", () => {
            const renderedSources = findAllWithType(result, ConfirmPopup);
            expect(renderedSources).to.have.lengthOf(1);
        });
    });
});
