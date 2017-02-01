import { DisplayArticle } from "./../../../src/js/newsboard/components/DisplayArticle";
import DisplayWebArticle from "./../../../src/js/newsboard/components/DisplayWebArticle";
import * as DisplayFeedActions from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import * as DisplayArticleActions from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";
import { findAllWithType } from "react-shallow-testutils";
import sinon from "sinon";

describe("DisplayArticle", () => {
    let feed = null, renderer = null, displayArticleDom = null, active = null, sandbox = null;
    beforeEach("DisplayArticle", () => {
        feed = {
            "images": [{ "url": "image url" }],
            "videos": [{ "thumbnail": "video image url" }],
            "title": "Some Title",
            "description": "Some Description",
            "sourceType": "facebook",
            "tags": ["Hindu"],
            "pubDate": "2017-01-31T06:58:27.000Z",
            "bookmark": false
        };
        active = false;
        sandbox = sinon.sandbox.create();
        renderer = TestUtils.createRenderer();
        displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} dispatch={()=>{}} newsBoardCurrentSourceTab={"collection"} addToCollectionStatus={{ "message": "" }}/>);
    });

    afterEach("DisplayArticle", () => {
        sandbox.restore();
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
            expect(pubDate.props.children).to.equals(" | Jan 31 2017, 12:28:27 PM IST");

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
            expect(description.props.children).to.equals(feed.description);
        });


        it("should have DisplayWebArticle component", () => {
            feed = {
                "images": [{ "url": "image url" }],
                "videos": [{ "thumbnail": "video image url" }],
                "title": "Some Title",
                "description": "Some Description",
                "sourceType": "web",
                "tags": ["Hindu"],
                "pubDate": "2017-01-31T06:58:27.000Z"
            };

            displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} addToCollectionStatus = {"message"} dispatch={()=>{}}/>);
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, DisplayWebArticle);

            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });

    describe("headerTag", () => {

        it("should have header tag with display-article__header class", () => {
            let headerDOM = displayArticleDom.props.children[0]; //eslint-disable-line no-magic-numbers
            expect(headerDOM.props.className).to.equal("display-article__header");
            expect(headerDOM.type).to.equal("header");
        });

        it("should dispatch newsBoardTabSwitch, addArticleToCollection when add to collection clicked", () => {
            let article = { "_id": "article id", "description": "article description" };
            let currentTab = "facebook";
            let store = createStore(() => ({
                "selectedArticle": article,
                "newsBoardCurrentSourceTab": currentTab
            }), applyMiddleware(thunkMiddleware));

            let newsBoardTabSwitchMock = sandbox.mock(DisplayFeedActions)
                .expects("newsBoardTabSwitch")
                .returns({ "type": "" });
            let addArticleToCollectionMock = sandbox.mock(DisplayArticleActions)
                .expects("addArticleToCollection")
                .returns({ "type": "" });

            let displayArticle = TestUtils.renderIntoDocument(
                <Provider store = {store}>
                    <DisplayArticle article={article} dispatch={()=>{}} addToCollectionStatus = {{ "message": "" }}/>
                </Provider>
            );
            let collectionClick = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "collection");
            TestUtils.Simulate.click(collectionClick);
            newsBoardTabSwitchMock.verify();
            addArticleToCollectionMock.verify();
        });

        it("should have bookmark class when article is not bookmarked", () => {
            let headerDOM = displayArticleDom.props.children[0]; //eslint-disable-line no-magic-numbers
            let bookmarkDOM = headerDOM.props.children[1]; //eslint-disable-line no-magic-numbers
            expect(bookmarkDOM.props.className).to.equal("bookmark");
            expect(bookmarkDOM.type).to.equal("div");
        });

        it("should have bookmark & active classes when article is boomarked", () => {
            feed.bookmark = true;
            displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} dispatch={()=>{}} newsBoardCurrentSourceTab={"collection"} addToCollectionStatus={{ "message": "" }}/>);
            let headerDOM = displayArticleDom.props.children[0]; //eslint-disable-line no-magic-numbers
            let bookmarkDOM = headerDOM.props.children[1]; //eslint-disable-line no-magic-numbers
            expect(bookmarkDOM.props.className).to.equal("bookmark active");
            expect(bookmarkDOM.type).to.equal("div");
        });

        it("should dispatch bookmarkArticle when bookmark is clicked", () => {
            let article = { "_id": "article id", "description": "article description" };
            let currentTab = "facebook";
            let store = createStore(() => ({
                "selectedArticle": article,
                "newsBoardCurrentSourceTab": currentTab
            }), applyMiddleware(thunkMiddleware));

            let bookmarkMock = sandbox.mock(DisplayArticleActions)
                .expects("bookmarkArticle")
                .returns({ "type": "" });

            let displayArticle = TestUtils.renderIntoDocument(
                <Provider store = {store}>
                    <DisplayArticle article={article} dispatch={()=>{}} addToCollectionStatus = {{ "message": "" }}/>
                </Provider>
            );
            let bookmarkClick = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "bookmark");
            TestUtils.Simulate.click(bookmarkClick);

            bookmarkMock.verify();
        });

        it("should dispatch bookmarkArticle when bookmarked is clicked", () => {
            let article = { "_id": "article id", "description": "article description", "bookmark": true };
            let currentTab = "facebook";
            let store = createStore(() => ({
                "selectedArticle": article,
                "newsBoardCurrentSourceTab": currentTab
            }), applyMiddleware(thunkMiddleware));

            let bookmarkMock = sandbox.mock(DisplayArticleActions)
                .expects("bookmarkArticle")
                .returns({ "type": "" });

            let displayArticle = TestUtils.renderIntoDocument(
                <Provider store = {store}>
                    <DisplayArticle article={article} dispatch={()=>{}} addToCollectionStatus = {{ "message": "" }}/>
                </Provider>
            );
            let bookmarkClick = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "bookmark active");
            TestUtils.Simulate.click(bookmarkClick);

            bookmarkMock.verify();
        });
    });

    describe("toast", () => {

        it("should not have toast message when there is addToCollectionStatus is empty", () => {
            let toastDiv = displayArticleDom.props.children[2]; //eslint-disable-line no-magic-numbers
            expect(toastDiv).to.equals("");
        });

        it("should have toast message when there is addToCollectionStatus", () => {
            displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} dispatch={()=>{}} newsBoardCurrentSourceTab={"collection"} addToCollectionStatus={{ "message": "successfully added" }}/>);
            let toastDiv = displayArticleDom.props.children[2]; //eslint-disable-line no-magic-numbers
            expect(toastDiv.type).to.equals("div");
            expect(toastDiv.props.className).to.equals("add-to-collection-message");
        });
    });
});
