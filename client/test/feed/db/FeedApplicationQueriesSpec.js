/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0*/

"use strict";
import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
import sinon from "sinon";
import { expect } from "chai";

describe("FeedApplicationQueries", () => {
    describe("allFeedsWithCategoryNames", () => {
        it("should fetch all surf feeds and return with category name", () => {
            let resultDocs = [{
                "key": "fbId1",
                "id": "fbId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId1",
                "id": "feedId1",
                "value": "rssId1",
                "doc": {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "rssId1",
                    "_id": "feedId1",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53"
                }
            }, {
                "key": "rssId1",
                "id": "rssId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId1",
                "id": "rssId1",
                "value": {
                    "_id": "politicsCategoryId2"
                },
                "doc": {
                    "docType": "category",
                    "name": "Politics",
                    "_id": "politicsCategoryId2",
                    "_rev": "1-175853337b49fcd1db6474777f871d4a"
                }
            }];


            let expectedSources = [{
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1",
                "_id": "feedId1",
                "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                "categoryNames": "Sports, Politics"
            }];

            let fetchAllSourcesWithCategoriesMock = sinon.mock(FeedDb).expects("fetchSurfFeedsAndCategoriesWithSource");
            fetchAllSourcesWithCategoriesMock.returns(Promise.resolve(resultDocs));
            return FeedApplicationQueries.fetchAllFeedsWithCategoryName().then(sources => {
                expect(expectedSources).to.deep.equal(sources);
                fetchAllSourcesWithCategoriesMock.verify();
                FeedDb.fetchSurfFeedsAndCategoriesWithSource.restore();
            });
        });

        it("should reject with error if fetching documents fails", () => {
            let fetchAllSourcesWithCategoriesStub = sinon.stub(FeedDb, "fetchSurfFeedsAndCategoriesWithSource");
            fetchAllSourcesWithCategoriesStub.returns(Promise.reject("error"));
            return FeedApplicationQueries.fetchAllFeedsWithCategoryName().catch(error => {
                expect(error).to.eq("error");
                FeedDb.fetchSurfFeedsAndCategoriesWithSource.restore();
            });
        });
    });

    describe("fetchAllParkedFeeds", () => {
        it("should fetch all parked feeds and return with category name", () => {
            let resultDocs = [{
                "key": "fbId1",
                "id": "fbId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId1",
                "id": "feedId2",
                "value": "rssId1",
                "doc": {
                    "docType": "feed",
                    "status": "park",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "rssId1",
                    "_id": "feedId2",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53"
                }
            }, {
                "key": "rssId1",
                "id": "rssId1",
                "value": {
                    "_id": "sportsCategoryId1"
                },
                "doc": {
                    "docType": "category",
                    "name": "Sports",
                    "_id": "sportsCategoryId1",
                    "_rev": "1-4b61e9edacc78ab1f189b68345d4d410"
                }
            }, {
                "key": "rssId1",
                "id": "rssId1",
                "value": {
                    "_id": "politicsCategoryId2"
                },
                "doc": {
                    "docType": "category",
                    "name": "Politics",
                    "_id": "politicsCategoryId2",
                    "_rev": "1-175853337b49fcd1db6474777f871d4a"
                }
            }];


            let expectedSources = [{
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1",
                "_id": "feedId2",
                "status": "park",
                "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                "categoryNames": "Sports, Politics"
            }];

            let fetchParkFeedssMock = sinon.mock(FeedDb).expects("fetchParkFeeds");
            fetchParkFeedssMock.returns(Promise.resolve(resultDocs));
            return FeedApplicationQueries.fetchAllParkedFeeds().then(sources => {
                expect(expectedSources).to.deep.equal(sources);
                fetchParkFeedssMock.verify();
                FeedDb.fetchParkFeeds.restore();
            });
        });

        it("should reject with error if fetching documents fails", () => {
            let fetchParkedFeedsStub = sinon.stub(FeedDb, "fetchParkFeeds");
            fetchParkedFeedsStub.returns(Promise.reject("error"));
            return FeedApplicationQueries.fetchAllParkedFeeds().catch(error => {
                expect(error).to.eq("error");
                FeedDb.fetchParkFeeds.restore();
            });
        });
    });

    describe("updateFeed", () => {
        it("should update feed after filtering required fields", () => {
            let rawFeedDoc = {
                _id: "feedid",
                _rev: "1-5ec67a3c5068912d169a4d30f4526eea",
                categoryNames: "hindu",
                content: "The company has set aside Rs. 1,100 cr for interest free salary advances",
                docType: "feed",
                feedType: "rss",
                sourceId: "52359499-59E9-2D9E-AC38-922DBBB25A63",
                tags: [],
                title: "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                type: "description"
            };

            let expectedFeedDoc = {
                _id: "feedid",
                _rev: "1-5ec67a3c5068912d169a4d30f4526eea",
                content: "The company has set aside Rs. 1,100 cr for interest free salary advances",
                docType: "feed",
                feedType: "rss",
                sourceId: "52359499-59E9-2D9E-AC38-922DBBB25A63",
                tags: [],
                title: "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                type: "description",
                status: "park"
            };
            let feedDbMock = sinon.mock(FeedDb).expects("updateFeed");
            feedDbMock.withArgs(expectedFeedDoc).returns(Promise.resolve({"status": "ok"}))
            return FeedApplicationQueries.updateFeed(rawFeedDoc).then(response => {
                feedDbMock.verify();
                FeedDb.updateFeed.restore();
            });
        });
    });
});
