import DisplayWebArticle from "./../../../src/js/newsboard/components/DisplayWebArticle";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleWare from "redux-thunk";
import sinon from "sinon";
import * as DisplayArticleActions from "./../../../src/js/newsboard/actions/DisplayArticleActions";

describe("DisplayWebArticle", () => {
    let displayWebMock = null, result = null;
    let sandbox = null, store = null, currentArticle = null;
    beforeEach("DisplayWebArticle", () => {
        sandbox = sinon.sandbox.create();

        currentArticle = {
            "description": "Some Description",
            "link": "some link"
        };
        store = createStore(() => ({
            "webArticleMarkup": "<p>This is the body of the tag</p>",
            "selectedArticle": currentArticle,
            "fetchingWebArticle": false
        }), applyMiddleware(thunkMiddleWare));
    });

    afterEach("DisplayWebArticle", () => {
        sandbox.restore();
    });

    it("should have a div article__desc class", () => {
        displayWebMock = sandbox.mock(DisplayArticleActions).expects("displayWebArticle")
            .withArgs(currentArticle).returns({ "type": null });

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayWebArticle />
            </Provider>
        );

        let renderedDom = ReactDOM.findDOMNode(result);
        expect(renderedDom.className).to.equal("article__desc");
    });

    it("should dispatch displayWebArticle action", () => {
        displayWebMock = sandbox.mock(DisplayArticleActions).expects("displayWebArticle")
            .withArgs(currentArticle).returns({ "type": null });

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayWebArticle />
            </Provider>
        );

        displayWebMock.verify();
    });

    xit("should dispatch displayWebArticle after changing the selectedArticle", () => {
        let node = document.createElement("div");
        displayWebMock = sandbox.mock(DisplayArticleActions).expects("displayWebArticle")
            .twice().returns({ "type": null });

        result = ReactDOM.render(
            <Provider store={store}>
                <DisplayWebArticle />
            </Provider>
        , node);

        result.setState({
            "selectedArticle": {
                "link": "some other link"
            }
        });

        displayWebMock.verify();
    });
});
