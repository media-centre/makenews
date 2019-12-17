import HeaderTab from "../../../src/js/header/components/HeaderTab";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { Link } from "react-router";
import { assert } from "chai";

describe("HeaderTab", () => {
    let headerTab = null;

    beforeEach("HeaderTab", () => {
        headerTab = TestUtils.renderIntoDocument(<HeaderTab name="test" url="/test" currentHeaderTab="test" />);
    });
    it("should have link to url", () => {
        const linkElement = TestUtils.scryRenderedComponentsWithType(headerTab, Link);
        const linkProps = linkElement[0].props; //eslint-disable-line no-magic-numbers
        const link = linkProps.children.props;
        assert.strictEqual(linkProps.to, "/test");
        assert.strictEqual(link.children.props.className, "header-tabs--left__item__name");
        assert.strictEqual(link.children.props.children, "test");
    });
});
