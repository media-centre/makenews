/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import { expect } from "chai";
import PouchDB from "pouchdb";
import sinon from "sinon";
import PouchClient from "../../src/js/db/PouchClient.js";

describe("PouchClient", () => {
    before("PouchClient", () => {
        let pouch = new PouchDB('myDB', {db: require('memdown')});
        sinon.stub(DbSession, "instance", () => {
            return pouch;
        });

        DbSession.instance().put({
                "docType": "category",
                "name": "Sports"
            }
            , "sportsCategoryId1");
        DbSession.instance().put({
                "docType": "category",
                "name": "Politics"
            }
            , "politicsCategoryId2");

        DbSession.instance().put({
                "docType": "source",
                "sourceType": "rss",
                "url": "www.hindu.com/rss",
                "categoryIds": [ "sportsCategoryId1"]
            }
            , "rssId1");

        DbSession.instance().put({
                "docType": "source",
                "sourceType": "rss",
                "url": "www.yahoo.com/rss",
                "categoryIds": ["politicsCategoryId2"]
            }
            , "rssId2");

        DbSession.instance().put( {
            "language": "javascript",
            "views": {
                "allCategories": {
                    "map": "function(doc) { if(doc.docType === 'category') {emit(doc.docType, doc)} }"
                },
                "rssConfigurations": {
                    "map": "function(doc) { if(doc.docType === 'source' && doc.sourceType === 'rss') {doc.categoryIds.forEach(function(id){emit(id, doc)})} }"
                }
            }}, "_design/category");
    });

    after("PouchClient", () => {
       DbSession.instance.restore();
    });

    describe("fetchDocuments", () => {
        it("should list all documents for the given queryPath", (done) => {
            PouchClient.fetchDocuments("category/allCategories", { "include_docs": true }).then((docs) => {
                expect(docs.map((doc) => {return doc.name})).to.include("Sports");
                expect(docs.map((doc) => {return doc.name})).to.include("Politics");
                done();
            });
        });

        it("should return empty if no design document is present", (done) => {
            PouchClient.fetchDocuments("category/dummyView", { "include_docs": true }).then((docs) => {
                expect(0).to.eq(docs.length);
                done();
            });
        });

        it("should handle error on pouch error", (done) => {
            PouchClient.fetchDocuments(null, { "include_docs": true }).catch(() => {
                done();
            });
        });

        it("should list all rssConfigurations for every categoryId", (done) => {
            PouchClient.fetchDocuments("category/rssConfigurations", { "include_docs": true, "key": "politicsCategoryId2" }).then((docs) => {
                expect(docs.map((doc) => {return doc.url})).to.include("www.yahoo.com/rss");
                expect(docs.map((doc) => {return doc.url})).to.not.include("www.hindu.com/rss");
                done();
            });
        });
    });
});
