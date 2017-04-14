import SourceFilters from "../../../src/js/newsboard/filter/SourceFilters";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";
import { shallow } from "enzyme";

describe("SourceFilters", () => {
    it("should call renderSources with current sourceType and searchKey", () => {
        let sourceFilter = TestUtils.createRenderer();
        let renderSourceFun = (sourceType, searchKey) => {
            assert.strictEqual(sourceType, "twitter");
            assert.strictEqual(searchKey, "the");
        };
        sourceFilter.render(<SourceFilters currentTab={"twitter"} searchKeyword={"the"} renderSources={renderSourceFun} />);
    });

    it("should have a root div with class list-sources-block ", () => {
        const wrapper = shallow(<SourceFilters currentTab="web" searchKeyword={""} renderSources={()=>{}} />);
        assert.strictEqual(wrapper.node.type, "div");
        assert.strictEqual(wrapper.node.props.className, "list-sources-block");
    });

    it("should have a div with class list-source__group", () => {
        const wrapper = shallow(<SourceFilters currentTab="web" searchKeyword={""} renderSources={()=>{}} />);
        const listSourceGroup = wrapper.find(".list-sources__group");

        assert.strictEqual(listSourceGroup.node.type, "div");
        assert.strictEqual(listSourceGroup.node.props.className, "list-sources__group open");
    });

    it("should have a h4 with the heading of Web if currentTab is web", () => {
        const wrapper = shallow(<SourceFilters currentTab="web" searchKeyword={""} renderSources={()=>{}} />);
        const listSourceGroupHeading = wrapper.find(".list-sources__group__heading");

        assert.strictEqual(listSourceGroupHeading.node.type, "h4");
        assert.strictEqual(listSourceGroupHeading.text(), "Web");
    });

    it("should have a h4 with the heading of Twitter if currentTab is twitter", () => {
        const wrapper = shallow(<SourceFilters currentTab="twitter" searchKeyword={""} renderSources={()=>{}} />);
        const listSourceGroupHeading = wrapper.find(".list-sources__group__heading");

        assert.strictEqual(listSourceGroupHeading.node.type, "h4");
        assert.strictEqual(listSourceGroupHeading.text(), "Twitter");
    });

    it("should have two h4 with the heading of Facebook Pages, Facebook Groups if currentTab is not twitter or web", () => {
        const wrapper = shallow(<SourceFilters currentTab="pages" searchKeyword={""} renderSources={()=>{}} />);
        const [page, group] = wrapper.find(".list-sources__group__heading");

        assert.strictEqual(page.type, "h4");
        assert.strictEqual(page.props.children, "Facebook Pages");

        assert.strictEqual(group.type, "h4");
        assert.strictEqual(group.props.children, "Facebook Groups");
    });
});
