/*eslint no-magic-numbers:0*/
import { MainHeader } from "./../../../src/js/header/components/MainHeader";
import Header from "./../../../src/js/header/components/Header";
import React from "react";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";

describe("MainHeader", () => {
    let result = null, currentHeaderTab = null, mainHeaderStrings = null, store = null, childElement = null;

    beforeEach("MainHeader", () => {
        store = {
            "getState": ()=>{
                return { "state": {
                    "mainHeaderStrings": mainHeaderStrings,
                    "currentHeaderTab": currentHeaderTab
                }
                };
            }
        };
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
        childElement = <div>{"main-page children"}</div>;
        let renderer = TestUtils.createRenderer();
        result = renderer.render(<MainHeader store= {store} children={childElement} mainHeaderStrings={mainHeaderStrings} currentHeaderTab={"Scan News"} dispatch={() => {}}/>);
    });

    it("should have Header element", () => {
        let renderedSources = findAllWithType(result, Header);
        let ONE = 1;
        expect(renderedSources).to.have.lengthOf(ONE);
    });
    it("should have logo ", () => {
        let div = result.props.children[0];
        let image = div.props.children[0].props;
        expect(div.type).to.equals("div");
        expect(div.props.className).to.equals("header");
        expect(image.className).to.equals("header__logo");
        expect(image.children.type).to.equals("img");
        expect(image.children.props.src).to.equals(".../../../images/makenews-logo.png");
    });

});
