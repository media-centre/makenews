import CollectionFeedsRoute from "./../../../src/routes/helpers/CollectionFeedsRoute";
import * as CollectionFeedsRequestHandler from "./../../../src/collection/CollectionFeedsRequestHandler";
import { expect } from "chai";
import sinon from "sinon";

describe("CollectionFeedsRoute", () => {
    describe("validate", () => {
        let offset = 0, collectionName = "test", authSession = "test_token";
        it("should return error message of missing params if collection Name  is empty", () => {
            let request = {
                "cookies": { "AuthSession": authSession },
                "query": {
                    "collectionName": "",
                    offset
                }
            };
            let collectionFeed = new CollectionFeedsRoute(request, {});

            expect(collectionFeed.validate()).to.equal("missing parameters");
        });

        it("should return error message of missing params if auth session is empty", () => {
            let request = {
                "cookies": { "AuthSession": "" },
                "query": {
                    collectionName,
                    offset
                }
            };
            let collectionFeed = new CollectionFeedsRoute(request, {});

            expect(collectionFeed.validate()).to.equal("missing parameters");
        });
    });

    describe("handle", () => {
        let sandbox = null, authSession = "test_token", collectionName = "test", offset = 0;

        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should get collected feeds", async () => {
            let request = {
                "cookies": { "AuthSession": authSession },
                "query": { collectionName, offset }
            };
            let collectionFeed = new CollectionFeedsRoute(request, {});

            let feeds = {
                "docs": [
                    {
                        "_id": "b9c4a434f0e4aa72f7cf55f21ac1c18218a22d896dbfcd39fec7e55e9cbefd7352853c9656edcb45308bf0476e000678",
                        "docType": "collectionFeed",
                        "feedId": "b9c4a434f0e4aa72f7cf55f21ac1c18218a22d896dbfcd39fec7e55e9cbefd73",
                        "collection": collectionName
                    }
                ]
            };

            sandbox.mock(CollectionFeedsRequestHandler).expects("getCollectedFeeds")
                .returns(feeds);

            let result = await collectionFeed.handle();
            expect(result).to.deep.equal(feeds);
        });
    });
});
