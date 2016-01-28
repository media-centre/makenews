/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0*/

"use strict";
import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import PouchClient from "../../../src/js/db/PouchClient";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
import sinon from "sinon";
import { expect, assert } from "chai";

describe("FeedApplicationQueries", () => {
    describe("allFeedsWithCategoryNames", () => {
        it("should fetch all surf feeds and return with category name", () => {
            let resultDocs = [
                {
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
                "key": "2015-10-03T04:09:17+00:00",
                "id": "feedId1",
                "value": "rssId1",
                "doc": {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "rssId1",
                    "postedDate": "2015-10-03T04:09:17+00:00",
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
            }, {
                "key": "noCategoryUrl",
                "id": "test1",
                "value": {
                    "_id": "politicsCategoryId2"
                },
                "doc": {
                        "docType": "category",
                        "name": "noCategoryUrl",
                        "_id": "politicsCategoryId2",
                        "_rev": "1-175853337b49fcd1db6474777f871d4a"
                    }
            }, {
                "key": "2015-10-04T04:09:17+00:00",
                "id": "test1",
                "value": "noCategoryUrl",
                "doc": {
                    "docType": "feed",
                    "title": "test title",
                    "description": "www.facebooksports.com",
                    "sourceId": "noCategoryUrl",
                    "postedDate": "2015-10-04T04:09:17+00:00",
                    "_id": "feed2",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53"
                }
            }
            ];


            let expectedSources = [
                {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "rssId1",
                    "postedDate": "2015-10-03T04:09:17+00:00",
                    "_id": "feedId1",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                    "categoryNames": ["Sports", "Politics"]
                }, {
                "docType": "feed",
                "title": "test title",
                "description": "www.facebooksports.com",
                "sourceId": "noCategoryUrl",
                "postedDate": "2015-10-04T04:09:17+00:00",
                "_id": "feed2",
                "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                "categoryNames": ["noCategoryUrl"]
            }
            ];

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
                    "sourceId": "fbId1",
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
                "categoryNames": ["Sports", "Politics"]
            }];

            let fetchParkFeedssMock = sinon.mock(FeedDb).expects("fetchParkFeeds");
            fetchParkFeedssMock.returns(Promise.resolve(resultDocs));
            return FeedApplicationQueries.fetchAllParkedFeeds().then(sources => {
                expect(expectedSources).to.deep.equal(sources);
                fetchParkFeedssMock.verify();
                FeedDb.fetchParkFeeds.restore();
            });
        });

        it("should append category name as empty if the parked feeds does not have the source id", () => {
            let resultDocs = [{
                "key": "",
                "id": "feedId2",
                "value": "rssId1",
                "doc": {
                    "docType": "feed",
                    "status": "park",
                    "title": "tn",
                    "description": "www.facebookpolitics.com",
                    "sourceId": "",
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
            }];


            let expectedSources = [{
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "",
                "_id": "feedId2",
                "status": "park",
                "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                "categoryNames": []
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
                "_id": "feedid",
                "_rev": "1-5ec67a3c5068912d169a4d30f4526eea",
                "categoryNames": "hindu",
                "content": "The company has set aside Rs. 1,100 cr for interest free salary advances",
                "docType": "feed",
                "feedType": "rss",
                "sourceId": "52359499-59E9-2D9E-AC38-922DBBB25A63",
                "tags": [],
                "title": "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                "type": "description"
            };
            let feedStatus = "park";

            let expectedFeedDoc = {
                "_id": "feedid",
                "_rev": "1-5ec67a3c5068912d169a4d30f4526eea",
                "content": "The company has set aside Rs. 1,100 cr for interest free salary advances",
                "docType": "feed",
                "feedType": "rss",
                "sourceId": "52359499-59E9-2D9E-AC38-922DBBB25A63",
                "tags": [],
                "title": "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                "type": "description",
                "status": "park"
            };
            let feedDbMock = sinon.mock(FeedDb).expects("updateFeed");
            feedDbMock.withArgs(expectedFeedDoc).returns(Promise.resolve({ "status": "ok" }));
            return FeedApplicationQueries.updateFeed(rawFeedDoc, feedStatus).then(() => {
                feedDbMock.verify();
                FeedDb.updateFeed.restore();
            });
        });

        it("should update feed after unparked", () => {
            let rawFeedDoc = {
                "_id": "feedid",
                "_rev": "1-5ec67a3c5068912d169a4d30f4526eea",
                "content": "The company has set aside Rs. 1,100 cr for interest free salary advances",
                "docType": "feed",
                "feedType": "rss",
                "sourceId": "52359499-59E9-2D9E-AC38-922DBBB25A63",
                "tags": [],
                "title": "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                "type": "description",
                "status": "park"
            };
            let feedStatus = "surf";

            let expectedFeedDoc = {
                "_id": "feedid",
                "_rev": "1-5ec67a3c5068912d169a4d30f4526eea",
                "content": "The company has set aside Rs. 1,100 cr for interest free salary advances",
                "docType": "feed",
                "feedType": "rss",
                "sourceId": "52359499-59E9-2D9E-AC38-922DBBB25A63",
                "tags": [],
                "title": "Tata Consultancy offers cash incentives for flood-hit Chennai staff",
                "type": "description",
                "status": "surf"
            };
            let feedDbMock = sinon.mock(FeedDb).expects("updateFeed");
            feedDbMock.withArgs(expectedFeedDoc).returns(Promise.resolve({ "status": "ok" }));
            return FeedApplicationQueries.updateFeed(rawFeedDoc, feedStatus).then(() => {
                feedDbMock.verify();
                FeedDb.updateFeed.restore();
            });
        });
    });

    describe("deleteSurfFeeds", () => {
        let sourceId = null, surfFeeds = null, deletedSurfFeeds = null;
        before("surfFeeds", () => {
            sourceId = "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48";
            surfFeeds = [{
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Chennai Connect at The Hindu",
                "feedType": "facebook",
                "content": "Chennai patient receives heart from brain-dead man in CMC",
                "tags": [
                    "Dec 29 2015    7:47:59"
                ],
                "url": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xpl1/v/t1.0-0/s130x130/10402743_1012773958745185_3635117216496008201_n.jpg?oh=6654df3ae8d6a2accce78a8d39bd0e22&oe=5709CE3C&__gda__=1459644057_ac6d4414114d43b6cf927a34ba7e5612"
            }, {
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Timeline Photos",
                "feedType": "facebook",
                "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                "tags": [
                    "Dec 29 2015    8:9:17"
                ],
                "url": "https://fbcdn-photos-h-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/s130x130/993834_968914649869205_4718370789719324851_n.jpg?oh=c00c3e984da0d49a65fb6342e5ffb272&oe=57191FE6&__gda__=1461844690_a1b41bffa7af2d1bd8f80072af88adff"
            }];

            deletedSurfFeeds = [{
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Chennai Connect at The Hindu",
                "feedType": "facebook",
                "content": "Chennai patient receives heart from brain-dead man in CMC",
                "_deleted": true,
                "tags": [
                    "Dec 29 2015    7:47:59"
                ],
                "url": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xpl1/v/t1.0-0/s130x130/10402743_1012773958745185_3635117216496008201_n.jpg?oh=6654df3ae8d6a2accce78a8d39bd0e22&oe=5709CE3C&__gda__=1459644057_ac6d4414114d43b6cf927a34ba7e5612"
            }, {
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Timeline Photos",
                "feedType": "facebook",
                "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                "_deleted": true,
                "tags": [
                    "Dec 29 2015    8:9:17"
                ],
                "url": "https://fbcdn-photos-h-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/s130x130/993834_968914649869205_4718370789719324851_n.jpg?oh=c00c3e984da0d49a65fb6342e5ffb272&oe=57191FE6&__gda__=1461844690_a1b41bffa7af2d1bd8f80072af88adff"
            }];
        });

        it("should delete surf feeds of given source id", (done) => {
            let feedDbSurfFeedsMock = sinon.mock(FeedDb).expects("surfFeeds");
            feedDbSurfFeedsMock.withArgs(sourceId).returns(Promise.resolve(surfFeeds));
            let pouchClientMock = sinon.mock(PouchClient).expects("bulkDocuments");
            pouchClientMock.withArgs(deletedSurfFeeds).returns(Promise.resolve("surf feeds of given sourceId deleted"));

            FeedApplicationQueries.deleteSurfFeeds(sourceId).then((response) => {

                assert.strictEqual("surf feeds of given sourceId deleted", response);
                feedDbSurfFeedsMock.verify();
                pouchClientMock.verify();
                FeedDb.surfFeeds.restore();
                PouchClient.bulkDocuments.restore();
                done();
            });
        });

        it("should reject with error if fetching surf feeds  fails", (done) => {
            sourceId = "TestSourceId";
            let feedDbSurfFeedsMock = sinon.mock(FeedDb).expects("surfFeeds");
            feedDbSurfFeedsMock.withArgs(sourceId).returns(Promise.reject("Invalid Source Id"));
            FeedApplicationQueries.deleteSurfFeeds(sourceId).catch((error) => {
                assert.strictEqual("Invalid Source Id", error);
                feedDbSurfFeedsMock.verify();
                FeedDb.surfFeeds.restore();
                done();
            });
        });

        it("should reject with error if deleting documents fails", (done) => {
            let feedDbSurfFeedsMock = sinon.mock(FeedDb).expects("surfFeeds");
            feedDbSurfFeedsMock.withArgs(sourceId).returns(Promise.resolve(surfFeeds));
            let pouchClientMock = sinon.mock(PouchClient).expects("bulkDocuments");
            pouchClientMock.withArgs(deletedSurfFeeds).returns(Promise.reject("Invalid Source Id"));

            FeedApplicationQueries.deleteSurfFeeds(sourceId).catch((error) => {

                assert.strictEqual("Invalid Source Id", error);

                feedDbSurfFeedsMock.verify();
                pouchClientMock.verify();
                FeedDb.surfFeeds.restore();
                PouchClient.bulkDocuments.restore();
                done();
            });
        });
    });

    describe("removeParkFeedsSourceReference", () => {
        let sourceId = null, parkFeeds = null, updatedParkFeeds = null;
        before("removeParkFeedsSourceReference", () => {
            sourceId = "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48";
            parkFeeds = [
                {
                    "docType": "feed",
                    "sourceId": "0AD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "status": "park",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd.net"
                },
                {
                    "docType": "feed",
                    "sourceId": "0AD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "status": "park",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd1.net"
                }
            ];
            updatedParkFeeds = [
                {
                    "docType": "feed",
                    "sourceId": "",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "status": "park",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd.net"
                },
                {
                    "docType": "feed",
                    "sourceId": "",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "status": "park",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd1.net"
                }
            ];
        });

        it("should remove the source reference for a park feeds", (done) => {
            let feedDbSourceparkFeedsMock = sinon.mock(FeedDb).expects("sourceParkFeeds");
            feedDbSourceparkFeedsMock.withArgs(sourceId).returns(Promise.resolve(parkFeeds));
            let pouchClientBulkDocuments = sinon.mock(PouchClient).expects("bulkDocuments");
            pouchClientBulkDocuments.withArgs(updatedParkFeeds).returns(Promise.resolve("success"));
            FeedApplicationQueries.removeParkFeedsSourceReference(sourceId).then(response => {
                feedDbSourceparkFeedsMock.verify();
                pouchClientBulkDocuments.verify();
                FeedDb.sourceParkFeeds.restore();
                PouchClient.bulkDocuments.restore();
                done();
            });
        });

        it("should reject with false if there is error while updating bulk documents", (done) => {
            let feedDbSourceparkFeedsMock = sinon.mock(FeedDb).expects("sourceParkFeeds");
            feedDbSourceparkFeedsMock.withArgs(sourceId).returns(Promise.resolve(parkFeeds));
            let pouchClientBulkDocuments = sinon.mock(PouchClient).expects("bulkDocuments");
            pouchClientBulkDocuments.withArgs(updatedParkFeeds).returns(Promise.reject("Error occured"));
            FeedApplicationQueries.removeParkFeedsSourceReference(sourceId).catch(error => {
                feedDbSourceparkFeedsMock.verify();
                pouchClientBulkDocuments.verify();
                FeedDb.sourceParkFeeds.restore();
                PouchClient.bulkDocuments.restore();
                done();
            });
        });

        it("should reject with false if there is an error while fetching the source park feeds", (done) => {
            let feedDbSourceparkFeedsMock = sinon.mock(FeedDb).expects("sourceParkFeeds");
            feedDbSourceparkFeedsMock.withArgs(sourceId).returns(Promise.reject("Error occured"));

            FeedApplicationQueries.removeParkFeedsSourceReference(sourceId).catch(error => {

                assert.isFalse(error);
                feedDbSourceparkFeedsMock.verify();
                FeedDb.sourceParkFeeds.restore();
                done();
            });
        });

        it("should resolve true if there are no park feeds", (done) => {
            let feedDbSourceparkFeedsMock = sinon.mock(FeedDb).expects("sourceParkFeeds");
            feedDbSourceparkFeedsMock.withArgs(sourceId).returns(Promise.resolve([]));


            FeedApplicationQueries.removeParkFeedsSourceReference(sourceId).then(response => {

                feedDbSourceparkFeedsMock.verify();
                FeedDb.sourceParkFeeds.restore();
                done();
            });
        });

    });
});
