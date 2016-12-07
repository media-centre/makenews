/* eslint no-magic-numbers:0 */
import Header from "./../../../src/js/header/components/Header";
import HeaderTab from "./../../../src/js/header/components/HeaderTab";
import ConfigureTab from "./../../../src/js/header/components/ConfigureTab";
import UserProfileTab from "./../../../src/js/header/components/UserProfileTab";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { findAllWithType } from "react-shallow-testutils";

describe("Header component", () => {
    let result = null, currentHeaderTab = null, mainHeaderStrings = null, header = null; //eslint-disable-line no-unused-vars
    beforeEach("Header component", () => {
        currentHeaderTab = "Scan News";
        mainHeaderStrings = {
            "newsBoard": {
                "Name": "Scan News"
            },
            "storyBoard": {
                "Name": "Write a Story"
            },
            "configure": {
                "Name": "Configure"
            }
        };
        let renderer = TestUtils.createRenderer();
        header = renderer.render(<Header mainHeaderStrings ={mainHeaderStrings} currentHeaderTab={currentHeaderTab}/>);
        result = renderer.getRenderOutput();
    });

    it("should have headerTab element", () => {
        let renderedSources = findAllWithType(result, HeaderTab);
        expect(renderedSources).to.have.lengthOf(2);
    });

    it("should have ConfigureTab element", () => {
        let renderedSources = findAllWithType(result, ConfigureTab);
        expect(renderedSources).to.have.lengthOf(1);
    });

    it("should have UserProfileTab element", () => {
        let renderedSources = findAllWithType(result, UserProfileTab);
        expect(renderedSources).to.have.lengthOf(1);
    });
});
