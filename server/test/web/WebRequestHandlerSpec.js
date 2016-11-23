import WebRequestHandler from "../../../server/src/web/WebRequestHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import CouchClient from "../../src/CouchClient";
import AdminDbClient from "../../src/db/AdminDbClient";
import { assert } from "chai";
import sinon from "sinon";

describe("Web Request Handler", () => {
   describe("Search URLS", () => {
       let sandbox = null, couchClient = null ;
       beforeEach("Web Request Handler", () => {
           sandbox = sinon.sandbox.create();
           sandbox.stub(WebRequestHandler, "logger").returns(LogTestHelper.instance());
           let applicationConfig = new ApplicationConfig();
           sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
           sandbox.stub(applicationConfig, "adminDetails").returns({
                "couchDbAdmin": {
                    "username": "adminUser",
                    "password": "adminPwd"
                },
               "db": "adminDb"
           });
           couchClient = new CouchClient();
           sandbox.stub(AdminDbClient, "instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));
       });

       afterEach("FacebookAccessToken", () => {
           sandbox.restore();
       });

       it("should return the default URL Documents", (done) => {
           let body = {
               "selector": {
                   "url": {
                       "$eq": "the"
                   }
               }
           };
           let webRequestHandler = WebRequestHandler.instance();
           let getDocStub = sinon.stub(couchClient, "getUrlDocument");
           getDocStub.withArgs(body).returns(Promise.resolve({ "docs":
               [ { _id: '1',
                   docType: 'test',
                   sourceType: 'web',
                   name: 'url1 test',
                   url: 'http://www.thehindu.com/news/international/?service=rss' },
                   { _id: '2',
                       docType: 'test',
                       sourceType: 'web',
                       name: 'url test',
                       url: 'http://www.thehindu.com/sport/?service=rss' }]
           }));
           webRequestHandler.searchUrl(body).then(document => {
               assert.strictEqual("web",document.docs[0].sourceType);
               done();
           })
       });

       it("should reject with an error if the URL document rejects with an error when body is null", (done) => {
           let body = null;
           let webRequestHandler = WebRequestHandler.instance();
           let getDocStub = sinon.stub(couchClient, "getUrlDocument");
           getDocStub.withArgs(body).returns(Promise.reject("No selector found"));
           webRequestHandler.searchUrl(body).catch((error) => {
               assert.strictEqual("No selector found", error);
               done();
           });
       });
   });

    describe.only("Save Document", () => {
        let sandbox = null, couchClient = null ;
        beforeEach("Web Request Handler", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(WebRequestHandler, "logger").returns(LogTestHelper.instance());
            let applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sandbox.stub(applicationConfig, "adminDetails").returns({
                "couchDbAdmin": {
                    "username": "adminUser",
                    "password": "adminPwd"
                },
                "db": "adminDb"
            });
            couchClient = new CouchClient();
            sandbox.stub(AdminDbClient, "instance").withArgs("adminUser", "adminPwd", "adminDb").returns(Promise.resolve(couchClient));
        });

        afterEach("FacebookAccessToken", () => {
            sandbox.restore();
        });

        it("should Save the Document", (done) => {
            let document = {
                "docType": "source",
                "sourceType": "web",
                "name": "NewsClick",
                "url": "http://www.newsclick.in"
            };
            let getDocStub = sinon.stub(couchClient, "saveDocument");
            getDocStub.withArgs(document.name, document).returns(Promise.resolve({
                ok: true,
                id: 'NewsClick',
                rev: 'test_revition'
            }));

            let webRequestHandler = WebRequestHandler.instance();
            webRequestHandler.saveDocument(document.name, document).then((response) => {
                assert.strictEqual("NewsClick", response.id);
                done();
            });
        });

        it("should return Error IF Document Id is not there", (done) => {

            let webRequestHandler = WebRequestHandler.instance();
            webRequestHandler.saveDocument(null, null).catch((error) => {
                assert.strictEqual("unexpected response from the db", error);
                done();
            });
        });
    });
});
