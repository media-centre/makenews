/* eslint max-nested-callbacks: [2, 7]*/


import ChangeGalleryTypeFeed from "../../../src/migration/db/20160310113335_ChangeGalleryTypeFeed";
import DesignDocumentMigration from "../../../src/migration/helpers/DesignDocumentMigration";
import Migration from "../../../src/migration/Migration";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("ChangeGalleryTypeFeed", ()=> {
    const accessToken = "testToken", dbName = "testDb", designDocId = "_design/category";
    let sandbox = null, newViews = null, migrationLoggerStub = null;

    before("ChangeGalleryTypeFeed", () => {
        sandbox = sinon.sandbox.create();
        migrationLoggerStub = sandbox.stub(Migration, "logger");
        migrationLoggerStub.withArgs(dbName).returns({
            "error": (message, ...insertions) =>{ //eslint-disable-line
            },
            "info": (message, ...insertions)=> { //eslint-disable-line
            },
            "debug": (message, ...insertions)=> { //eslint-disable-line
            }
        });
    });
    after("ChangeGalleryTypeFeed", () => {
        sandbox.restore();
    });

    describe("up", () => {
        let designDocumentInstanceMock = null, designDocObj = null;
        beforeEach("up", () => {
            designDocumentInstanceMock = sandbox.mock(DesignDocumentMigration).expects("instance");
            newViews = {
                "galleryFeeds": {
                    "map": "function(doc) { if(doc.type == 'gallery') {emit(doc._id, doc)} }"
                }
            };
            designDocObj = new DesignDocumentMigration(dbName, accessToken, designDocId);
        });

        afterEach("up", () => {
            sandbox.restore();
        });

        it("should update the gallery feeds to image content", (done) => {
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .get("/" + dbName + "/_design/category/_view/galleryFeeds")
                .reply(HttpResponseHandler.codes.OK, { "rows": [{ "value": { "_id": "12345", "type": "imagecontent" } }] });

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/12345", { "_id": "12345", "type": "imagecontent" })
                .reply(HttpResponseHandler.codes.OK, { "ok": "true" });

            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.resolve("success"));

            let changeGalleryTypeFeed = new ChangeGalleryTypeFeed(dbName, accessToken);
            changeGalleryTypeFeed.up().then(response => { //eslint-disable-line
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });

        it("should reject with error message if the adding views is failed", (done) => {
            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.reject("error"));

            let changeGalleryTypeFeed = new ChangeGalleryTypeFeed(dbName, accessToken);
            changeGalleryTypeFeed.up().catch(error => { //eslint-disable-line
                assert.strictEqual("error", error);
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });
    });
});

