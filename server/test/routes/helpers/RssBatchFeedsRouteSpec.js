/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import RssBatchFeedsRoute from "../../../src/routes/helpers/RssBatchFeedsRoute.js";
import RssClient from "../../../src/rss/RssClient";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import LogTestHelper from "../../helpers/LogTestHelper";
import { expect } from "chai";
import sinon from "sinon";

describe("RssBatchFeedsRoute", () => {
    function mockResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
                done();
            }
        };
        return response;
    }

    before("TwitterRouteHelper", () => {
        sinon.stub(RssClient, "logger").returns(LogTestHelper.instance());
    });

    after("TwitterRouteHelper", () => {
        RssClient.logger.restore();
    });

    describe("feedsForAllUrls", () => {
        it("should return the updated rss feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        {
                            "url": "www.rssurl1.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                            "timestamp": "1232323"
                        },
                        {
                            "url": "www.rssurl2.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }
                    ]
                }
            };

            let feedResponse = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": { "items": [{ "title": "test", "description": "news cricket" }] },
                "6E4B3A-5B3E-15CD-95CB-7E9D82343249": { "items": [{ "title": "test1", "description": "news cricket1" }] }
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedResponse });
            let rssRouteHelper = new RssBatchFeedsRoute(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[0].url).returns(Promise.resolve({ "items": [{ "title": "test", "description": "news cricket" }] }));
            fetchRssFeedRequestMock.withArgs(requestData.body.data[1].url).returns(Promise.resolve({ "items": [{ "title": "test1", "description": "news cricket1" }] }));
            rssRouteHelper.feedsForAllUrls();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });

        it("should set invalid response only for the particular url, if fetching fails", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        {
                            "url": "www.rssurl1.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                            "timestamp": "1232323"
                        },
                        {
                            "url": "www.rssurl2.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }
                    ]
                }
            };

            let feedResponse = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": { "items": [{ "title": "test", "description": "news cricket" }] },
                "6E4B3A-5B3E-15CD-95CB-7E9D82343249": "failed"
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedResponse });
            let rssRouteHelper = new RssBatchFeedsRoute(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[0].url).returns(Promise.resolve({ "items": [{ "title": "test", "description": "news cricket" }] }));
            fetchRssFeedRequestMock.withArgs(requestData.body.data[1].url).returns(Promise.reject("some error"));
            rssRouteHelper.feedsForAllUrls();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });
    });
});
