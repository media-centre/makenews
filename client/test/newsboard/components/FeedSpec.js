/*eslint no-magic-numbers:0*/
import Feed from "./../../../src/js/newsboard/components/Feed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("Feed", () => {
    let feed = null, renderer = null, feedDom = null, active = null, onToggle = null;
    beforeEach("Feed", () => {
        feed = {
            "images": ["image url"],
            "videos": ["image url"],
            "title": "Some Title",
            "description": "Some Description",
            "sourceType": "rss",
            "tags": "Hindu",
            "pubDate": "someDate"
        };
        active = false;
        onToggle = () => {
        };
        renderer = TestUtils.createRenderer();
        feedDom = renderer.render(<Feed active={active} feed={feed} onToggle={onToggle}/>);
    });

    it("should have three children ", () => {
        expect(feedDom.type).to.equals("div");
        expect(feedDom.props.children.length).to.equals(3);
    });

    it("should have image ", () => {
        let img = feedDom.props.children[0].props;
        feed.videos = [];
        feed.images[0] = false;
        feedDom = renderer.render(<Feed active={active} feed={feed} onToggle={onToggle}/>);
        img = feedDom.props.children[0].props;
        expect(img.className).to.equals("feed-content-withEnclosure");
    });

    it("should have title ", () => {
        let img = feedDom.props.children[0].props;
        let title = img.children[0].props;

        expect(title.className).to.equals("feed-title");
        expect(title.children).to.equals("Some Title");
    });

    it("should have description ", () => {
        let img = feedDom.props.children[0].props;
        let description = img.children[1].props;

        expect(description.className).to.equals("feed-description");
        expect(description.children).to.equals("Some Description");
    });

    it("should have source ", () => {
        let source = feedDom.props.children[2].props;

        expect(source.className).to.equals("feed-source");
        expect(source.children[0].props.className).to.equals("source-type");
        expect(source.children[1].props.className).to.equals("source");
        expect(source.children[1].props.children).to.deep.equals(["Hindu"]);
        expect(source.children[2].props.className).to.equals("date");
    });

    it("should have media ", () => {
        let media = feedDom.props.children[1].props;
        expect(media.className).to.equals("feed-media");
    });
});
