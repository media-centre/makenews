import { NewsBoardTabs } from "./../../../src/js/newsboard/components/NewsBoardTabs";
import NewsBoardTab from "./../../../src/js/newsboard/components/NewsBoardTab";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { expect } from "chai";

describe("NewsBoardTabs", () => {
    let result = null;
    beforeEach("NewsBoardTabs", () => {
        const renderer = TestUtils.createRenderer();
        renderer.render(<NewsBoardTabs displayFeedsToast={{ "bookmark": true }}/>);
        result = renderer.getRenderOutput();
    });

    it("should have tabs to switch between sources", () => {
        const renderedSources = findAllWithType(result, NewsBoardTab);
        expect(renderedSources).to.have.lengthOf(6);  //eslint-disable-line no-magic-numbers
    });

    it("should have bookmark tab with toast message div", () => {
        const [, , , , bookmarkTab] = findAllWithType(result, NewsBoardTab);
        const toastDiv = bookmarkTab.props.children;
        expect(toastDiv.type).to.equals("div");
        expect(toastDiv.props.className).to.equals("toast show");
        const [icon, message] = toastDiv.props.children;
        expect(icon.props.className).to.equals("icon fa fa-bookmark");
        expect(message).to.contains("Successfully bookmarked");
    });
});
