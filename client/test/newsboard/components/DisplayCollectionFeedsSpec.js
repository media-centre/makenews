import { DisplayCollectionFeeds } from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import DisplayArticle from "../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType, findWithClass } from "react-shallow-testutils";
import { assert } from "chai";

describe("DisplayCollectionFeeds", () => {
    let result = null, feeds = null, collectionName = null, renderer = null;

    beforeEach("DisplayCollectionFeeds", () => {
        collectionName = "test";
        feeds = [
            { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];

        renderer = TestUtils.createRenderer();
        renderer.render(
                <DisplayCollectionFeeds collectionName = {collectionName} dispatch = {() => {}} feeds = {feeds} tab="Scan News"/>);
        result = renderer.getRenderOutput();
    });


    it("should render the feeds", () => {
        let renderedSources = findAllWithType(result, CollectionFeed);
        let [source1, source2] = renderedSources;
        assert.isDefined(source1);
        assert.isDefined(source2);
    });

    it("should have display-collection class", () => {
        let displayCollection = findWithClass(result, "display-collection");
        assert.isDefined(displayCollection);
    });

    it("should have header class", () => {
        let collectionHeader = findWithClass(result, "collection-header");
        assert.isDefined(collectionHeader);
    });

    it("should have collection-feeds class", () => {
        let collectionFeeds = findWithClass(result, "collection-feeds");
        assert.isDefined(collectionFeeds);
    });

    it("should have display Article", () => {
        let renderedSources = findAllWithType(result, DisplayArticle);
        let [source] = renderedSources;
        assert.isDefined(source);
    });

    it("should not have style when current tab scan news", () => {
        assert.deepEqual(result.props.style, {});
    });

    it("should have style when current tab write a story", () => {
        let style = { "flex": "0", "flex-basis": "420px" };
        renderer.render(
            <DisplayCollectionFeeds collectionName={collectionName} dispatch={() => {}} feeds={feeds} tab="Write a Story"/>);
        result = renderer.getRenderOutput();

        assert.deepEqual(result.props.style, style);
    });
});

