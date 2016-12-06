import { expect } from "chai";
import CouchClient from "../../src/CouchClient";
import SourceConfigRequestHandler from "../../src/sourceConfig/SourceConfigRequestHandler";
import { sourceTypes } from "../../src/util/Constants";
import sinon from "sinon";

describe("SourceConfigRequestHandler", () => {
    let sandbox = null, dbName = null, body = null, sourceRequestHandler = null, couchClient = null;
    beforeEach("SourceConfigRequestHandler", () => {
        sandbox = sinon.sandbox.create();
        dbName = "db_name";
        body = {
            "selector": {
                "docType": {
                    "$eq": "configuredSource"
                }
            },
            "limit": 1000
        };
        sourceRequestHandler = new SourceConfigRequestHandler();
        couchClient = new CouchClient(dbName, "accessToken");
        sandbox.mock(CouchClient).expects("createInstance").returns(Promise.resolve(couchClient));
    });

    afterEach("SourceConfigRequestHandler", () => {
        sandbox.restore();
    });

    it("should get the configured Sources", (done) => {
        let result = { "docs":
        [{ "_id": "7535677770c76f0bf6045a0e1401ccf4",
            "_rev": "1-23d11b676e21bca63e16d032a03b0826",
            "docType": "source",
            "sourceType": sourceTypes.fb_profile,
            "url": "http://www.facebook.com/profile1",
            "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
            { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                "docType": "source",
                "sourceType": sourceTypes.fb_page,
                "url": "http://www.facebook.com/profile1",
                "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
            { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                "docType": "source",
                "sourceType": sourceTypes.fb_group,
                "url": "http://www.facebook.com/profile1",
                "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
            { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                "docType": "source",
                "sourceType": "twitter",
                "url": "http://www.facebook.com/profile1",
                "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
            { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                "docType": "source",
                "sourceType": "web",
                "url": "http://www.facebook.com/profile1",
                "latestFeedTimestamp": "2016-11-21T01:57:48Z" }] };

        sandbox.stub(couchClient, "findDocuments").withArgs(body).returns(Promise.resolve(result));

        sourceRequestHandler.fetchConfiguredSources().then(data => {
            try {
                expect(data.profiles).to.deep.equal([result.docs[0]]); //eslint-disable-line no-magic-numbers
                expect(data.pages).to.deep.equal([result.docs[1]]); //eslint-disable-line no-magic-numbers
                expect(data.groups).to.deep.equal([result.docs[2]]); //eslint-disable-line no-magic-numbers
                expect(data.twitter).to.deep.equal([result.docs[3]]); //eslint-disable-line no-magic-numbers
                expect(data.web).to.deep.equal([result.docs[4]]); //eslint-disable-line no-magic-numbers
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("should reject with error when database gives an error", (done) => {
        let errorMessage = "unexpected response from the db";
        sandbox.stub(couchClient, "post").returns(Promise.reject(errorMessage));
        sourceRequestHandler.fetchConfiguredSources().catch(error => {
            try {
                expect(error).to.equal(errorMessage);
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});
