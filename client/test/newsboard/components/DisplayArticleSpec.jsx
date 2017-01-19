import { DisplayArticle } from "./../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("DisplayArticle", () => {
    let feed = null, renderer = null, displayArticleDom = null, active = null;
    beforeEach("DisplayArticle", () => {
        feed = {
            "images": [{ "url": "image url" }],
            "videos": [{ "thumbnail": "video image url" }],
            "title": "Some Title",
            "description": "Some Description",
            "sourceType": "rss",
            "tags": "Hindu",
            "pubDate": "someDate"
        };
        active = false;
        renderer = TestUtils.createRenderer();
        displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed}/>);
    });

    it("should have a div with feed class", () => {
        expect(displayArticleDom.props.className).to.equals("display-article");
    });
});
