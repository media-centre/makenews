import CollectionFeedsRoute from "./../../../src/routes/helpers/CollectionFeedsRoute";
import * as CollectionFeedsRequestHandler from "./../../../src/collection/CollectionFeedsRequestHandler";
import { expect } from "chai";
import sinon from "sinon";

describe("CollectionFeedsRoute", () => {
    describe("validate", () => {
        const offset = 0;
        const collection = "bsjzueer1_1jshguejsnmgjeu";
        const authSession = "test_token";
        it("should return error message of missing params if collection Name  is empty", () => {
            const request = {
                "cookies": { "AuthSession": authSession },
                "query": {
                    "collection": "",
                    offset
                }
            };
            const collectionFeed = new CollectionFeedsRoute(request, {});

            expect(collectionFeed.validate()).to.equal("missing parameters");
        });

        it("should return error message of missing params if auth session is empty", () => {
            const request = {
                "cookies": { "AuthSession": "" },
                "query": {
                    collection,
                    offset
                }
            };
            const collectionFeed = new CollectionFeedsRoute(request, {});

            expect(collectionFeed.validate()).to.equal("missing parameters");
        });
    });

    describe("handle", () => {
        let sandbox = null;
        const authSession = "test_token";
        const offset = 0;

        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should get collected feeds", async() => {
            const collection = "bsjzueer1_1jshguejsnmgjeu";
            const request = {
                "cookies": { "AuthSession": authSession },
                "query": { collection, offset }
            };
            const collectionFeed = new CollectionFeedsRoute(request, {});

            const feeds = {
                "docs": [
                    {
                        "_id": "b9c4a434f0e4aa72f7cf55f21ac1c18218a22d896dbfcd39fec7e55e9cbefd7352853c9656edcb45308bf0476e000678",
                        "docType": "feed",
                        "sourceType": "web",
                        "title": "some title",
                        "description": "Some desc"
                    }
                ]
            };

            sandbox.mock(CollectionFeedsRequestHandler).expects("getCollectedFeeds")
                .returns(feeds);

            const result = await collectionFeed.handle();
            expect(result).to.deep.equal(feeds);
        });
    });
});
