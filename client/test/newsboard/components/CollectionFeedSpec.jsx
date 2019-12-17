/*eslint no-magic-numbers:0*/
import CollectionFeed from "./../../../src/js/newsboard/components/CollectionFeed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Locale from "./../../../src/js/utils/Locale";
import sinon from "sinon";

describe("CollectionFeed", () => {
    let feed = null;
    let renderer = null;
    let feedDom = null;
    let active = null;
    let onToggle = null;
    const collectionId = "collectionId";
    const sandbox = sinon.sandbox.create();

    beforeEach("CollectionFeed", () => {
        feed = {
            "images": [{ "thumbnail": "some link" }],
            "videos": [],
            "title": "Some Title",
            "description": "Some Description",
            "sourceType": "web",
            "tags": "Hindu",
            "pubDate": "someDate"
        };
        active = 0;
        onToggle = () => {
        };
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
        renderer = TestUtils.createRenderer();
        feedDom = renderer.render(<CollectionFeed collectionId = {collectionId} active={active} feed={feed} toggle={onToggle} tab="Scan News"/>);
    });

    afterEach("CollectionFeed", () => {
        sandbox.restore();
    });

    it("should have a div with feed class", () => {
        expect(feedDom.props.className).to.equals("collection-feed");
    });

    it("should have delete-feed class with type button", () => {
        const [button] = feedDom.props.children;
        expect(button.props.className).to.equals("delete-feed");
        expect(button.type).to.equals("button");
    });

    it("should have body ", () => {
        const [, body] = feedDom.props.children;
        expect(body.props.className).to.equals("collection-feed__body");
        expect(body.type).to.equals("div");
    });

    it("should have title ", () => {
        const [, body] = feedDom.props.children;
        const [title] = body.props.children;

        expect(title.props.className).to.equals("collection-feed__title");
        expect(title.props.children).to.equals("Some Title");
    });

    it("should have media ", () => {
        const [, body] = feedDom.props.children;
        const [, media] = body.props.children;

        expect(media.props.className).to.equals("collection-feed__media");
        expect(media.props.children.props.src).to.equals("some link");
    });

    it("should have description ", () => {
        const [, body] = feedDom.props.children;
        const [,, description] = body.props.children;

        expect(description.props.className).to.equals("collection-feed__description");
        expect(description.props.children).to.equals("Some Description");
    });

    it("should have source ", () => {
        const [, body] = feedDom.props.children;
        const [,,, source] = body.props.children;
        const [sourceType, tag, date] = source.props.children;

        expect(source.props.className).to.equals("collection-feed__source");
        expect(sourceType.props.className).to.equals("source-type");
        expect(tag.props.className).to.equals("source");
        expect(tag.props.children).to.deep.equals(`${[feed.tags]} |`);
        expect(date.props.className).to.equals("date");
    });


    it("should have story-collection feed class when current tab write a story", () => {
        feedDom = renderer.render(<CollectionFeed collectionId={collectionId} active={active} feed={feed} toggle={onToggle} tab="Write a Story"/>);
        expect(feedDom.props.className).to.deep.equals("story-collection-feed collection-feed");
    });

    describe("Read more Button", () => {
        beforeEach("Read more Button", ()=> {
            feed = {
                "images": [],
                "videos": [],
                "title": "Some Title",
                "description": "Some Description",
                "sourceType": "facebook",
                "tags": "Hindu",
                "pubDate": "someDate"
            };
            active = 0;
            onToggle = () => {
            };
            renderer = TestUtils.createRenderer();
        });

        it("should be visible when source type is web", ()=> {
            feed.sourceType = "web";
            feedDom = renderer.render(<CollectionFeed collectionId={collectionId} active={active} feed={feed} toggle={onToggle}/>);
            const [,, readMore] = feedDom.props.children;
            const button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });

        it("should be visible when article contain video", ()=> {
            feed.videos = [{ "thumbnail": "video image url" }];
            feedDom = renderer.render(<CollectionFeed collectionId={collectionId} active={active} feed={feed} toggle={onToggle}/>);
            const [,, readMore] = feedDom.props.children;
            const button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });

        it("should be visible when article contain image", ()=> {
            feed.images = [{ "url": "image url", "thumbnail": "image url" }];
            feedDom = renderer.render(<CollectionFeed collectionId={collectionId} active={active} feed={feed} toggle={onToggle}/>);
            const [,, readMore] = feedDom.props.children;
            const button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });

        it("should be visible when article description more than Four lines", ()=> {
            feed.description = "NEEDED: Videographer/Animator We have been working with a young creative " +
                "who has an idea for a website that helps overcome the barriers people face when " +
                "starting their own clothing brand. He needs some help with conveying his business " +
                "proposal through film/animation for an upcoming competition and is looking for an animator " +
                "that can help with this.";
            feedDom = renderer.render(<CollectionFeed collectionId={collectionId} active={active} feed={feed} toggle={onToggle}/>);
            const [,, readMore] = feedDom.props.children;
            const button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });
    });

});
