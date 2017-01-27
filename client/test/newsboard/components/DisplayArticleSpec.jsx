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
            "sourceType": "web",
            "tags": ["Hindu"],
            "pubDate": "someDate"
        };
        active = false;
        renderer = TestUtils.createRenderer();
        displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} dispatch={()=>{}}/>);
    });

    it("should have a div with feed class", () => {
        expect(displayArticleDom.props.className).to.equals("display-article");
    });

    describe("main tag", () => {
        let mainDOM = null;
        beforeEach("", () => {
            mainDOM = displayArticleDom.props.children[1]; //eslint-disable-line no-magic-numbers
        });

        it("should have main tag with article class", () => {
            expect(mainDOM.type).to.equals("main");
            expect(mainDOM.props.className).to.equals("article");
        });

        it("should have article title", () => {
            let [title] = mainDOM.props.children;
            expect(title.type).to.equals("h1");
            expect(title.props.children).to.equals(feed.title);
            expect(title.props.className).to.equals("article__title");
        });

        it("should have article details", () => {
            let [, detailsDOM] = mainDOM.props.children;

            expect(detailsDOM.type).to.equals("div");
            expect(detailsDOM.props.className).to.equals("article__details");

            let [sourceTypeIcon, pubDate, tags] = detailsDOM.props.children;
            expect(sourceTypeIcon.type).to.equals("i");
            expect(sourceTypeIcon.props.className).to.equals(`fa fa-${feed.sourceType}`);

            expect(pubDate.type).to.equals("span");
            expect(pubDate.props.children).to.equals(` | ${feed.pubDate}`);

            expect(tags[0].type).to.equals("span"); //eslint-disable-line no-magic-numbers
            expect(tags[0].props.children).to.equals(` | ${feed.tags[0]}`); //eslint-disable-line no-magic-numbers

        });

        it("should have article images", () => {
            let [, , imagesDOM] = mainDOM.props.children;

            expect(imagesDOM.type).to.equals("div");
            expect(imagesDOM.props.className).to.equals("article__images");

            expect(imagesDOM.props.children).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
            expect(imagesDOM.props.children[0].type).to.equals("img"); //eslint-disable-line no-magic-numbers
            expect(imagesDOM.props.children[0].props.src).to.equals(feed.images[0].url); //eslint-disable-line no-magic-numbers
        });

        it("should have article description", () => {
            let [, , , description] = mainDOM.props.children;
            expect(description.type).to.equals("div");
            expect(description.props.className).to.equals("article__desc");
        });
    });
});
