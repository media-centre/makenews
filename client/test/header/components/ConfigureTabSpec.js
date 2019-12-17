import ConfigureTab from "../../../src/js/header/components/ConfigureTab";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { Link } from "react-router";
import { assert } from "chai";

describe("ConfigureTab", () => {
    let configureTab = null;

    beforeEach("ConfigureTab", () => {
        configureTab = TestUtils.renderIntoDocument(<ConfigureTab name="test" url="/test" currentHeaderTab="test" />);
    });
    it("should have link to url", () => {
        const linkElement = TestUtils.scryRenderedComponentsWithType(configureTab, Link);
        const linkProps = linkElement[0].props; //eslint-disable-line no-magic-numbers
        const link = linkProps.children.props;
        const image = link.children.props;
        assert.strictEqual(linkProps.to, "/test");
        assert.strictEqual(linkProps.children.props.className, "header-tabs--configure active");
        assert.strictEqual(link.children.props.className, "header-tabs--configure__image");
        assert.strictEqual(image.children.props.src, "./images/configure-icon.png");
    });
});
