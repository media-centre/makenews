import AddURLToUserDbRoute from "../../../src/routes/helpers/AddURLToUserDbRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import sinon from "sinon";
import { expect } from "chai";

describe("Add URL Doc To User Database Route", () => {
    function mockResponse(expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
            }
        };
        return response;
    }

    function mockResponseSuccess(expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
            }
        };
        return response;
    }


    it("should return bad request if URL is not valid", async() => {
        let request = {
            "body": {
                "url": ""
            }
        };
        let response = mockResponse({
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        await new AddURLToUserDbRoute(request, response, {}).handle();

    });


    it("should return bad request if userName is not present", async() => {
        let request = {
            "body": {
                "url": "http://test.com/rss",
                "accessToken": "test_token"
            }
        };
        let response = mockResponse({
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        await new AddURLToUserDbRoute(request, response, {}).handle();

    });


    it("should return bad request if accesToken is not present", async() => {
        let request = {
            "body": {
                "url": "http://test.com/rss",
                "userName": "Test_user"
            }
        };
        let response = mockResponse({
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        await new AddURLToUserDbRoute(request, response, {}).handle();

    });

    it("should add document for correct request", async() => {
        let sandbox = sinon.sandbox.create();
        let accessToken = "AKKLLIJHH";
        let userName = "test";
        let url = "http://www.test.com/?service=rss";
        let request = {
            "body": {
                "url": url,
                "accessToken": accessToken,
                "userName": userName
            }

        };
        let rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURLToUserDb");
        requestHandlerMock.withArgs(accessToken, url, userName).returns(Promise.resolve({ "message": "URL added to Database" }));

        let response = mockResponseSuccess({
            "status": HttpResponseHandler.codes.OK,
            "json": { "message": "URL added to Database" }
        });

        await new AddURLToUserDbRoute(request, response, {}).handle();
        sandbox.restore();
    });

});
