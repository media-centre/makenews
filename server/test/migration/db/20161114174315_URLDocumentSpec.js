/* eslint max-nested-callbacks: [2, 7]*/
import URLDocument from "../../../src/migration/db/20161114174315_URLDocument";
import DesignDocumentMigration from "../../../src/migration/helpers/DesignDocumentMigration";
import Migration from "../../../src/migration/Migration";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("URLDocument", ()=> {
    const accessToken = "testToken", dbName = "testDb", designDocId = "_design/category";
    let sandbox = null, newViews = null, migrationLoggerStub = null;

    before("URLDocument", () => {
        sandbox = sinon.sandbox.create();
        migrationLoggerStub = sandbox.stub(Migration, "logger");
        migrationLoggerStub.withArgs(dbName).returns({
            "error": (message, ...insertions) => { //eslint-disable-line
            },
            "info": (message, ...insertions)=> { //eslint-disable-line
            },
            "debug": (message, ...insertions)=> { //eslint-disable-line
            }
        });
    });
    after("URLDocument", () => {
        sandbox.restore();
    });

    describe("up", () => {
        let designDocumentInstanceMock = null, designDocObj = null;
        beforeEach("up", () => {
            designDocumentInstanceMock = sandbox.mock(DesignDocumentMigration).expects("instance");
            newViews = {
                "defaultURLDocuments": {
                    "map": "function(doc) { if(doc.sourceType == 'web') {emit(doc._id, doc)} }"
                }
            };
            designDocObj = new DesignDocumentMigration(dbName, accessToken, designDocId);
        });

        afterEach("up", () => {
            sandbox.restore();
        });

        it("should add the default URL Documents", (done) => {
            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.resolve("success"));

            let urlDocument = new URLDocument(dbName, accessToken);
            urlDocument.up().then(response => { //eslint-disable-line
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });

        it("should reject with error message if the adding views is failed", (done) => {
            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.reject("error"));

            let urlDocument = new URLDocument(dbName, accessToken);
            urlDocument.up().catch(error => { //eslint-disable-line
                assert.strictEqual("error", error);
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });
    });
});

