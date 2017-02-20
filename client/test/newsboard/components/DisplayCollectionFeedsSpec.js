import { DisplayCollectionFeeds } from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import DisplayArticle from "../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
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
                <DisplayCollectionFeeds collectionName = {collectionName} dispatch = {() => {}} feeds = {feeds} tab="Scan News" />);
        result = renderer.getRenderOutput();
    });


    it("should render the feeds", () => {
        let renderedSources = findAllWithType(result, CollectionFeed);
        let [source1, source2] = renderedSources;
        assert.isDefined(source1);
        assert.isDefined(source2);
    });

    it("should have collections class", () => {
        assert.equal(result.type, "div");
        assert.equal(result.props.className, "collections");
    });

    it("should have display-collection class", () => {
        let [, collection] = result.props.children;

        assert.equal(collection.type, "div");
        assert.equal(collection.ref, "collection");
        assert.equal(collection.props.className, "display-collection");
    });

    it("should have header class", () => {
        let [, collection] = result.props.children;
        let [header] = collection.props.children;
        assert.equal(header.type, "header");
        assert.equal(header.props.className, "collection-header");
    });


    it("should have collection-feeds class", () => {
        let [, collection] = result.props.children;
        let [, collectionFeeds] = collection.props.children;

        assert.equal(collectionFeeds.type, "div");
        assert.equal(collectionFeeds.props.className, "collection-feeds");
    });

    it("should have display Article", () => {
        let renderedSources = findAllWithType(result, DisplayArticle);
        let [source] = renderedSources;
        assert.isDefined(source);
    });

    it("should not have style when current tab scan news", () => {
        assert.deepEqual(result.props.style, {});
    });

    describe("header", () => {

        beforeEach("header", () => {
            renderer.render(
                <DisplayCollectionFeeds collectionName={collectionName} dispatch={() => {}} feeds={feeds} tab="Write a Story"/>);
            result = renderer.getRenderOutput();
        });

        it("should have style when current tab write a story", () => {
            let style = { "flex": "0", "flex-basis": "420px" };
            assert.deepEqual(result.props.style, style);
        });

        it("should have button class for all collections", () => {
            let [, collection] = result.props.children;
            let [header] = collection.props.children;
            let allCollection = header.props.children;
            let [arrow, text] = allCollection.props.children;

            assert.equal(allCollection.type, "button");
            assert.equal(allCollection.props.className, "all-collections");
            assert.equal(arrow.type, "i");
            assert.equal(arrow.props.className, "fa fa-arrow-left");
            assert.equal(text, "All Collections");
        });
    });

});

