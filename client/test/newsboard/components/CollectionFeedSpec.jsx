/*eslint no-magic-numbers:0*/
import CollectionFeed from "./../../../src/js/newsboard/components/CollectionFeed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("CollectionFeed", () => {
    let feed = null, renderer = null, feedDom = null, active = null, onToggle = null;
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
        renderer = TestUtils.createRenderer();
        feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle} tab="Scan News"/>);
    });

    it("should have a div with feed class", () => {
        expect(feedDom.props.className).to.equals("collection-feed");
    });

    it("should have body ", () => {
        let [body] = feedDom.props.children;
        expect(body.props.className).to.equals("collection-feed__body");
        expect(body.type).to.equals("div");
    });

    it("should have title ", () => {
        let [body] = feedDom.props.children;
        let [title] = body.props.children;

        expect(title.props.className).to.equals("collection-feed__title");
        expect(title.props.children).to.equals("Some Title");
    });

    it("should have media ", () => {
        let [body] = feedDom.props.children;
        let [, media] = body.props.children;

        expect(media.props.className).to.equals("collection-feed__media");
        expect(media.props.children.props.src).to.equals("some link");
    });

    it("should have description ", () => {
        let [body] = feedDom.props.children;
        let [,, description] = body.props.children;

        expect(description.props.className).to.equals("collection-feed__description");
        expect(description.props.children).to.equals("Some Description");
    });

    it("should have source ", () => {
        let [body] = feedDom.props.children;
        let [,,, source] = body.props.children;
        let [sourceType, tag, date] = source.props.children;

        expect(source.props.className).to.equals("collection-feed__source");
        expect(sourceType.props.className).to.equals("source-type");
        expect(tag.props.className).to.equals("source");
        expect(tag.props.children).to.deep.equals(`${[feed.tags]} |`);
        expect(date.props.className).to.equals("date");
    });


    it("should have story-collection feed class when current tab write a story", () => {
        feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle} tab="Write a Story"/>);
        expect(feedDom.props.className).to.deep.equals("story-collection-feed");
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
            feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
            let [, readMore] = feedDom.props.children;
            let button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });

        it("should be visible when when article contain video", ()=> {
            feed.videos = [{ "thumbnail": "video image url" }];
            feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
            let [, readMore] = feedDom.props.children;
            let button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });

        it("should be visible when when article contain image", ()=> {
            feed.images = [{ "url": "image url", "thumbnail": "image url" }];
            feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
            let [, readMore] = feedDom.props.children;
            let button = readMore.props.children;

            expect(readMore.type).to.equals("div");
            expect(button.type).to.equals("button");
            expect(button.props.className).to.equals("collection-feed__readmore-button");
        });
    });

});
