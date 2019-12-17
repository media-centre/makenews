/*eslint no-magic-numbers:0, react/jsx-no-bind:0*/
import { Main } from "./../../../src/js/header/components/Main";
import Header from "./../../../src/js/header/components/Header";
import React from "react";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";

describe("MainHeader", () => {
    let result = null;
    let currentHeaderTab = null;
    let mainHeaderStrings = null;
    let store = null;
    let childElement = null;
    const anonymousFun = () => {};

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
        const renderer = TestUtils.createRenderer();
        result = renderer.render(<Main store= {store} children={childElement} mainHeaderStrings={mainHeaderStrings} currentHeaderTab={"Scan News"} dispatch={anonymousFun}/>);
    });

    it("should have Header element", () => {
        const renderedSources = findAllWithType(result, Header);
        const ONE = 1;
        expect(renderedSources).to.have.lengthOf(ONE);
    });
    it("should have logo ", () => {
        const div = result.props.children[0];
        const image = div.props.children[0].props;
        expect(div.type).to.equals("div");
        expect(div.props.className).to.equals("header");
        expect(image.className).to.equals("header__logo");
        expect(image.children.type).to.equals("img");
        expect(image.children.props.src).to.equals("./images/makenews-logo.png");
    });
});
