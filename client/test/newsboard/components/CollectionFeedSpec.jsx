/*eslint no-magic-numbers:0*/
import CollectionFeed from "./../../../src/js/newsboard/components/CollectionFeed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("CollectionFeed", () => {
    let feed = null, renderer = null, feedDom = null, active = null, onToggle = null;
    beforeEach("Feed", () => {
        feed = {
            "images": [],
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
        feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
    });

    it("should have a div with feed class", () => {
        expect(feedDom.props.className).to.equals("collection-feed");
    });

    it("should have a div with feed--highlight class when the active prop is true", () => {
        feedDom = renderer.render(<CollectionFeed active feed={feed} toggle={onToggle}/>);
        expect(feedDom.props.className).to.equals("collection-feed active");
    });


    it("should have title ", () => {
        let title = feedDom.props.children[0].props;

        expect(title.className).to.equals("collection-feed__title");
        expect(title.children).to.equals("Some Title");
    });

    it("should have source ", () => {
        let source = feedDom.props.children[1].props;

        expect(source.className).to.equals("collection-feed__source");
        expect(source.children[0].props.className).to.equals("source-type");
        expect(source.children[1].props.className).to.equals("source");
        expect(source.children[1].props.children).to.deep.equals(`${[feed.tags]} |`);
        expect(source.children[2].props.className).to.equals("date");
    });

    it("should have description ", () => {
        let description = feedDom.props.children[2].props;

        expect(description.className).to.equals("collection-feed__description");
        expect(description.children).to.equals("Some Description");
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
            let readMore = feedDom.props.children[3];

            expect(readMore.type).to.equals("button");
            expect(readMore.props.className).to.equals("collection-feed__readmore");
        });

        it("should be visible when when article contain video", ()=> {
            feed.videos = [{ "thumbnail": "video image url" }];
            feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
            let readMore = feedDom.props.children[3];

            expect(readMore.type).to.equals("button");
            expect(readMore.props.className).to.equals("collection-feed__readmore");
        });

        it("should be visible when when article contain image", ()=> {
            feed.images = [{ "url": "image url", "thumbnail": "image url" }];
            feedDom = renderer.render(<CollectionFeed active={active} feed={feed} toggle={onToggle}/>);
            let readMore = feedDom.props.children[3];

            expect(readMore.type).to.equals("button");
            expect(readMore.props.className).to.equals("collection-feed__readmore");
        });
    });

});
