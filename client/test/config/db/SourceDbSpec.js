/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

import PouchClient from "../../../src/js/db/PouchClient";
import SourceDb from "../../../src/js/config/db/SourceDb";
import { STATUS_VALID, STATUS_INVALID } from "../../../src/js/config/Source";
import sinon from "sinon";
import { expect, assert } from "chai";

describe("SourceDb", () => {
    describe("fetchSourceConfigurationsByCategoryId", () => {
        it("should fetch all the source configurations for a category id", (done) => {
            let categoryId = "categoryId";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/sourceConfigurations", {
                "include_docs": true,
                "key": categoryId
            }).returns(Promise.resolve("resolved"));
            SourceDb.fetchSourceConfigurationsByCategoryId(categoryId).then((result) => {
                pouchClientMock.verify();
                PouchClient.fetchDocuments.restore();
                done();
            });
        });

        it("should reject if the category id is empty", (done) => {
            SourceDb.fetchSourceConfigurationsByCategoryId("").catch(error => {
                expect("category id should not be empty").to.equal(error);
                done();
            });
        });
    });

    describe("fetchSourceConfigurationByUrl", () => {
        it("should fetch all the source configurations for a url", () => {
            let url = "hindu.com/rss";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allSourcesByUrl", { "include_docs": true, "key": url });
            SourceDb.fetchSourceConfigurationByUrl(url);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });

        it("should reject if the category id is empty", (done) => {
            SourceDb.fetchSourceConfigurationByUrl("").catch(error => {
                expect("url should not be empty").to.equal(error);
                done();
            });
        });
    });

    describe("fetchSourceConfigurationBySourceType", () => {
        it("should fetch all the source configurations for a sourceType", () => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allSourcesBySourceType", { "include_docs": true, "key": "rss" });
            SourceDb.fetchSourceConfigurationBySourceType("rss");
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });
    });

    describe("fetchSortedSourceUrlsObj", () => {

        it("should throw error if the category id is empty", (done) => {
            let categoryId = "";
            SourceDb.fetchSortedSourceUrlsObj(categoryId).catch(error => {
                expect("category id can not be empty").to.equal(error);
                done();
            });
        });

        it("should return list of urls along with the id for a category id", (done) => {
            let categoryId = "test_category";
            let rss = { "_id": "rss_url_id1",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.yahoo.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
            };
            let fb = {
                "_id": "fb_url_id2",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "www.google.com/rss",
                "categoryIds": ["test_category"]
            };
            let result = [rss, fb];
            let expectedRssDetails = {
                "rss": [rss],
                "facebook": [fb]
            };
            let fetchRssConfigurationsStub = sinon.stub(SourceDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            SourceDb.fetchSortedSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
                SourceDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });

        it("should return list of urls in sorted order", (done) => {
            let categoryId = "test_category";
            let rss1 = { "_id": "rss_url_id1",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.yahoo.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
            };
            let rss2 = { "_id": "rss_url_id2",
                "docType": "source",
                "sourceType": "rss",
                "status": STATUS_VALID,
                "url": "www.google.com/rss",
                "categoryIds": ["dummy_category1", "test_category"]
            };
            let fb1 = {
                "_id": "facebook_url_id1",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "https://wwww.facebook.com/chennai",
                "categoryIds": ["test_category"]
            };
            let fb2 = {
                "_id": "facebook_url_id2",
                "docType": "source",
                "sourceType": "facebook",
                "status": STATUS_VALID,
                "url": "https://wwww.facebook.com/SachinTendulkar",
                "categoryIds": ["test_category"]
            };
            let tw1 = {
                "_id": "twitter_url_id1",
                "docType": "source",
                "sourceType": "twitter",
                "status": STATUS_VALID,
                "url": "#obama",
                "categoryIds": ["test_category"]
            };
            let tw2 = {
                "_id": "twitter_url_id2",
                "docType": "source",
                "sourceType": "twitter",
                "status": STATUS_VALID,
                "url": "#sachin",
                "categoryIds": ["test_category"]
            };
            let result = [rss1, rss2, fb2, fb1, tw2, tw1];
            let expectedRssDetails = {
                "rss": [rss2, rss1],
                "facebook": [fb1, fb2],
                "twitter": [tw1, tw2]
            };
            let fetchSourceConfigurationsStub = sinon.stub(SourceDb, "fetchSourceConfigurationsByCategoryId");
            fetchSourceConfigurationsStub.withArgs(categoryId).returns(Promise.resolve(result));
            SourceDb.fetchSortedSourceUrlsObj(categoryId).then(rssDetails => {
                expect(expectedRssDetails).to.deep.equal(rssDetails);
                SourceDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });

        it("should reject in case of any other errors", (done) => {
            let categoryId = "test_category";
            let fetchRssConfigurationsStub = sinon.stub(SourceDb, "fetchSourceConfigurationsByCategoryId");
            fetchRssConfigurationsStub.withArgs(categoryId).returns(Promise.reject("test_error"));
            SourceDb.fetchSortedSourceUrlsObj(categoryId).catch(error => {
                expect("test_error").to.equal(error);
                SourceDb.fetchSourceConfigurationsByCategoryId.restore();
                done();
            });
        });
    });
});
