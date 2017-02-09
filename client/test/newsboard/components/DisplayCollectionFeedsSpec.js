import { DisplayCollectionFeeds } from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import DisplayArticle from "../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType, findWithClass } from "react-shallow-testutils";
import { assert } from "chai";

describe("DisplayCollectionFeeds", () => {
    let result = null, feeds = null, collectionName = null;

    beforeEach("DisplayCollectionFeeds", () => {
        collectionName = "test";
        feeds = [
            { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];

        const renderer = TestUtils.createRenderer();
        renderer.render(
                <DisplayCollectionFeeds collectionName = {collectionName} dispatch = {() => {}} feeds = {feeds} />);
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
});

