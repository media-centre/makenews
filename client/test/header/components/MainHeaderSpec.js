/*eslint no-magic-numbers:0*/
import MainHeader from "./../../../src/js/header/components/MainHeader";
import MainHeaderTabs from "./../../../src/js/header/components/MainHeaderTabs";
import React from "react";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";

describe("MainHeader", () => {
    let div = null, result = null;

    beforeEach("MainHeader", () =>{
        let renderer = TestUtils.createRenderer();
        div = renderer.render(<MainHeader />);
        result = renderer.getRenderOutput();
    });

    it("should have logo", () => {
        let children = div.props.children;
        let image = children[0].props.children;

        expect(children.length).to.equal(2);
        expect(children[0].props.className).to.equal("header__logo");
        expect(image.props.src).to.equal(".../../../images/makenews-logo.png");
    });

    it("should have main header tabs component", () => {
        let renderedSources = findAllWithType(result, MainHeaderTabs);
        expect(renderedSources).to.have.lengthOf(1);
    });
});
