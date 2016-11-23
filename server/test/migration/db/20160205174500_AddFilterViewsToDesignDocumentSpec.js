/* eslint max-nested-callbacks: [2, 7]*/


import AddFilterViewsToDesignDocument from "../../../src/migration/db/20160205174500_AddFilterViewsToDesignDocument";
import DesignDocumentMigration from "../../../src/migration/helpers/DesignDocumentMigration";
import Migration from "../../../src/migration/Migration";
import { assert } from "chai";
import sinon from "sinon";


describe("AddFilterViewsToDesignDocument", ()=> {
    const accessToken = "testToken", dbName = "testDb", designDocId = "_design/category";
    let sandbox = null, newViews = null, migrationLoggerStub = null;

    before("AddFilterViewsToDesignDocument", () => {
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

    after("AddFilterViewsToDesignDocument", () => {
        sandbox.restore();
    });

    describe("up", () => {
        let designDocumentInstanceMock = null, designDocObj = null;
        beforeEach("up", () => {
            designDocumentInstanceMock = sandbox.mock(DesignDocumentMigration).expects("instance");
            newViews = {
                "surfFilter": {
                    "map": "function(doc) { if(doc.docType == 'surf-filter') {emit(doc._id, doc)} }"
                },
                "latestFeeds": {
                    "map": "function(doc) { if(doc.docType == 'feed' && (!doc.status || doc.status != 'park')) {emit(doc.postedDate, doc)} }"
                }
            };
            designDocObj = new DesignDocumentMigration(dbName, accessToken, designDocId);
        });

        afterEach("up", () => {
            sandbox.restore();
        });

        it("should add the filter views to the design document", (done) => {
            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.resolve("success"));

            let addFilterViewsToDesignDoc = new AddFilterViewsToDesignDocument(dbName, accessToken);
            addFilterViewsToDesignDoc.up().then(response => { //eslint-disable-line
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });

        it("should reject with error message if the adding views is failed", (done) => {
            designDocumentInstanceMock.withArgs(dbName, accessToken, designDocId).returns(designDocObj);
            let designDockAddNewViewsMock = sandbox.mock(designDocObj).expects("addOrUpdateViews");
            designDockAddNewViewsMock.withArgs(newViews).returns(Promise.reject("error"));

            let addFilterViewsToDesignDoc = new AddFilterViewsToDesignDocument(dbName, accessToken);
            addFilterViewsToDesignDoc.up().catch(error => { //eslint-disable-line
                assert.strictEqual("error", error);
                designDocumentInstanceMock.verify();
                designDockAddNewViewsMock.verify();
                done();
            });
        });
    });
});
