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
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayArticle", () => {
    let feed = null, renderer = null, displayArticleDom = null, active = null;
    const sandbox = sinon.sandbox.create();
    const anonymousFun = () => {};

    beforeEach("DisplayArticle", () => {
        feed = {
            "images": [{ "url": "image url" }],
            "videos": [{ "thumbnail": "video image url" }],
            "title": "Some Title",
            "description": "Some Description",
            "sourceType": "facebook",
            "tags": ["Hindu"],
            "pubDate": "2017-01-31T06:58:27.000Z",
            "bookmark": false,
            "_id": "123"
        };
        active = false;
        const newsBoardStrings = {
            "article": {
                "defaultMessage": "",
                "backButton": "back",
                "addToCollection": "Add to Collection",
                "bookmark": "Bookmark",
                "bookmarked": "Bookmarked",
                "readOriginalArticle": "Read the Original Article"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings
            }
        });

        renderer = TestUtils.createRenderer();
        displayArticleDom = renderer.render(<DisplayArticle article={feed} dispatch={anonymousFun} newsBoardCurrentSourceTab="web" collectionName="test" currentHeaderTab="Scan News"/>);
    });

    afterEach("DisplayArticle", () => {
        sandbox.restore();
    });

    it("should have a div with feed class", () => {
        expect(displayArticleDom.props.className).to.equals("display-article");
    });

    it("should have a div with default-message class if article is not passed", () => {
        let noArticleDom = renderer.render(<DisplayArticle article={{}} dispatch={anonymousFun} newsBoardCurrentSourceTab="web"/>);
        expect(noArticleDom.props.children.props.className).to.equals("default-message");
    });

    describe("main tag", () => {
        let mainDOM = null;
        beforeEach("main tag", () => {
            [, mainDOM] = displayArticleDom.props.children;
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
            let [img] = imagesDOM.props.children;

            expect(imagesDOM.type).to.equals("div");
            expect(imagesDOM.props.className).to.equals("article__images");

            expect(imagesDOM.props.children).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
            expect(img.type).to.equals("img");
            expect(img.props.src).to.equals(feed.images[0].url); //eslint-disable-line no-magic-numbers
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
                "pubDate": "2017-01-31T06:58:27.000Z",
                "_id": 123
            };

            displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} newsBoardCurrentSourceTab="web" dispatch={anonymousFun}/>);
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, DisplayWebArticle);

            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });

    });

    describe("headerTag", () => {

        it("should have header tag with display-article__header class", () => {
            let [headerDOM] = displayArticleDom.props.children;
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
                    <DisplayArticle article={article} dispatch={anonymousFun} newsBoardCurrentSourceTab="web" currentHeaderTab="Scan News"/>
                </Provider>
            );
            let collectionClick = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "collection");
            TestUtils.Simulate.click(collectionClick);
            newsBoardTabSwitchMock.verify();
            addArticleToCollectionMock.verify();
        });

        it("should have add to collection button", () => {
            const [headerDOM] = displayArticleDom.props.children;
            const [, articleHeaderDOM] = headerDOM.props.children;
            const [collectionDOM] = articleHeaderDOM.props.children;

            expect(collectionDOM.props.className).to.equal("collection");
            expect(collectionDOM.type).to.equal("div");

            const [icon] = collectionDOM.props.children;
            expect(icon.props.className).to.equal("icon fa fa-folder");
        });

        it("should have bookmark class when article is not bookmarked", () => {
            let [headerDOM] = displayArticleDom.props.children;
            const [, articleHeaderDOM] = headerDOM.props.children;
            let [, bookmarkDOM] = articleHeaderDOM.props.children;
            expect(bookmarkDOM.props.className).to.equal("bookmark");
            expect(bookmarkDOM.type).to.equal("div");

            const [icon] = bookmarkDOM.props.children;
            expect(icon.props.className).to.equal("icon fa fa-bookmark");
        });

        it("should have bookmark & active classes when article is boomarked", () => {
            feed.bookmark = true;
            displayArticleDom = renderer.render(<DisplayArticle active={active} article={feed} dispatch={anonymousFun} newsBoardCurrentSourceTab={"collection"} currentHeaderTab= "Scan News" />);
            let [headerDOM] = displayArticleDom.props.children;
            const [, articleHeaderDOM] = headerDOM.props.children;
            let [, bookmarkDOM] = articleHeaderDOM.props.children;
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
                    <DisplayArticle article={article} dispatch={anonymousFun} newsBoardCurrentSourceTab="web" currentHeaderTab="Scan News"/>
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
                    <DisplayArticle article={article} dispatch={anonymousFun} newsBoardCurrentSourceTab="web" currentHeaderTab="Scan News"/>
                </Provider>
            );
            let bookmarkClick = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "bookmark active");
            TestUtils.Simulate.click(bookmarkClick);

            bookmarkMock.verify();
        });

        it("should have back button when source Type collection", () => {
            feed = {
                "images": [{ "url": "image url" }],
                "videos": [{ "thumbnail": "video image url" }],
                "title": "Some Title",
                "description": "Some Description",
                "sourceType": "web",
                "tags": ["Hindu"],
                "pubDate": "2017-01-31T06:58:27.000Z",
                "_id": 123
            };

            displayArticleDom = renderer.render(<DisplayArticle article={feed} dispatch={anonymousFun} newsBoardCurrentSourceTab={"collections"} collectionName="test"/>);
            let [mainDOM] = displayArticleDom.props.children;
            let backButton = mainDOM.props.children;
            let [arrowIcon, name] = backButton.props.children;

            expect(mainDOM.type).to.be.equal("header");
            expect(mainDOM.props.className).to.be.equal("display-article__header back");

            expect(backButton.type).to.be.equal("button");
            expect(backButton.props.className).to.be.equal("back__button");
            expect(arrowIcon.type).to.be.equal("i");
            expect(arrowIcon.props.className).to.be.equal("icon fa fa-arrow-left");
            expect(name).to.be.equal("test");
        });

        it("should have back button when current header tab is write a story", () => {
            feed = {
                "images": [{ "url": "image url" }],
                "videos": [{ "thumbnail": "video image url" }],
                "title": "Some Title",
                "description": "Some Description",
                "sourceType": "web",
                "tags": ["Hindu"],
                "pubDate": "2017-01-31T06:58:27.000Z",
                "_id": 123
            };
            let feedsDOM = { "style": { "display": "none" } };
            displayArticleDom = renderer.render(
                <DisplayArticle
                    article={feed} dispatch={anonymousFun}
                    newsBoardCurrentSourceTab={"web"} articleOpen={anonymousFun}
                    feedsDOM={feedsDOM}
                />
            );
            let [mainDOM] = displayArticleDom.props.children;
            let [backButton] = mainDOM.props.children;
            let [arrowIcon,, name] = backButton.props.children;

            expect(mainDOM.type).to.be.equal("header");
            expect(mainDOM.props.className).to.be.equal("display-article__header");

            expect(backButton.type).to.be.equal("button");
            expect(backButton.props.className).to.be.equal("back__button");
            expect(arrowIcon.type).to.be.equal("i");
            expect(arrowIcon.props.className).to.be.equal("icon fa fa-arrow-left");
            expect(name).to.be.equal("back");
        });
    });

   /* TODO: unable to mock window getSelection, getRangeAt methods */ //eslint-disable-line
    xdescribe("ToolTip", () => {
        it("should dispatch addToCollection when there is selectedText and click on add To collection option", () => {
            let article = { "_id": "article id", "description": "article description", "selectText": true };
            let currentTab = "facebook";
            let store = createStore(() => ({
                "selectedArticle": article,
                "newsBoardCurrentSourceTab": currentTab
            }), applyMiddleware(thunkMiddleware));
            let displayArticle = TestUtils.renderIntoDocument(
                <Provider store = {store}>
                    <DisplayArticle article={article} dispatch={anonymousFun} newsBoardCurrentSourceTab="facebook"/>
                </Provider>
            );
            let range = {
                "getBoundingClientRect": () => {
                    return { "left": 1, "right": 3, "top": 4 };
                }
            };
            let selection = {
                "getRangeAt": () => {
                    return range;
                }
            };
            global.window = {
                "getSelection": () => {
                    return selection;
                }
            };
            sinon.stub(window, "getSelection").returns("SelectedData");

            let toolTip = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "article__desc");

            TestUtils.Simulate.mouseUp(toolTip);

            let addToCollection = TestUtils.findRenderedDOMComponentWithClass(displayArticle, "icon fa fa-folder-o");
            TestUtils.Simulate.click(addToCollection);

        });
    });
});
