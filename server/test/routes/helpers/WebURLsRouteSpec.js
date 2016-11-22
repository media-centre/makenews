import WebURLsRoute from "../../../src/routes/helpers/WebURLsRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import WebRequestHandler from "../../../src/web/WebRequestHandler"
import { expect, assert } from "chai";
import sinon from "sinon";

describe("Web Urls Route", () => {
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

    function mockResponseSuccess(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                assert.strictEqual("web",expectedValues.json.feeds.docs[0].sourceType);
                done();
            }
        };
        return response;
    }

   it("should return bad request if url is not present in request", (done) => {
       let request = {
           "query": {
               "url": {}
           }
       };
       let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
       
       new WebURLsRoute(request, response, {}).handle()
   });

   it("should return feeds for correct request", (done) => {
       let sandbox = sinon.sandbox.create();
       let request = {
           "query": {
               "url": {
                   "selector": {
                       "name": {
                           "$regex": "test"
                       }
                   }
               }
           }
       };
       let feeds = { "docs":
           [ { _id: '1',
               docType: 'test',
               sourceType: 'web',
               name: 'url1 test',
               url: 'http://www.thehindu.com/news/international/?service' },
               { _id: '2',
                   docType: 'test',
                   sourceType: 'web',
                   name: 'url test',
                   url: 'http://www.thehindu.com/sport/?service' }]
       };
       let requestHandlerInstance = new WebRequestHandler();
       sandbox.stub(WebRequestHandler, "instance").returns(requestHandlerInstance);
       let requestHandlerMock = sandbox.mock(requestHandlerInstance).expects("searchUrl");
       requestHandlerMock.withArgs(request.query.url).returns(Promise.resolve(feeds));
       let response = mockResponseSuccess(done, { "status": HttpResponseHandler.codes.OK, "json": { feeds } });
       let webURLsRoute = new WebURLsRoute(request, response, {});
       webURLsRoute.handle();
   });
});
