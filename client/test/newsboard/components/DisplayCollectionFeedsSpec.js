import { DisplayCollectionFeeds } from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import DisplayArticle from "../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { assert } from "chai";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayCollectionFeeds", () => {
    let result = null;
    const feeds = [
                { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
                { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }];
    const collectionName = "test";
    const sandbox = sinon.sandbox.create();
    const anonymousFun = () => {};

    beforeEach("DisplayCollectionFeeds", () => {
        const newsBoardStrings = {
            "collection": {
                "defaultMessage": "No feeds added to collection",
                "allCollections": "All Collections",
                "selectCollection": "SELECT A COLLECTION",
                "createCollection": "Create new collection",
                "readMoreButton": "Read More",
                "backButton": "BACK",
                "saveButton": "SAVE",
                "confirmDelete": "Do you really want to delete collection?"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings
            }
        });
    });

    afterEach("DisplayCollectionFeeds", () => {
        sandbox.restore();
    });

    describe("Feeds", () => {
        let renderer = null;
        beforeEach("Feeds", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <DisplayCollectionFeeds collection = {{ "name": collectionName, "id": "collectionId" }} dispatch = {anonymousFun} feeds = {feeds} tab="Scan News" />);
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
    });

    describe("header", () => {
        let renderer = null;
        beforeEach("header", () => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <DisplayCollectionFeeds collection={{ "name": collectionName, "id": "collectionId" }} dispatch={anonymousFun} feeds={feeds} tab="Write a Story"/>);
            result = renderer.getRenderOutput();
        });

        it("should have new className when current tab write a story", () => {
            assert.deepEqual(result.props.className, "collections story-board-collections");
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

