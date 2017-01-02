/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import RssBatchFeedsRoute from "../../../src/routes/helpers/RssBatchFeedsRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
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

    describe("feedsForAllUrls", () => {
        const zero = 0, one = 1;
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
                },
                "cookies": {
                    "AuthSession": "auth session"
                }
            };


            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": { "message": "success" } });
            let rssRouteHelper = new RssBatchFeedsRoute(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[zero].url, "auth session").returns(Promise.resolve("success"));
            fetchRssFeedRequestMock.withArgs(requestData.body.data[one].url, "auth session").returns(Promise.resolve("success"));
            rssRouteHelper.handle();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });

        it("should set invalid response only for the particular url, if fetching fails", (done) => {
            let requestData = {
                "body": {
                    "data": [

                        {
                            "url": "www.rssurl2.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }
                    ]
                },
                "cookies": {
                    "AuthSession": "auth session"
                }
            };

            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": { "message": "sucessfully added feeds" } });
            let rssRouteHelper = new RssBatchFeedsRoute(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);
            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[zero].url).returns(Promise.reject("some error"));
            rssRouteHelper.handle();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });
    });
});
