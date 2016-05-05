/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import DbParameters from "../../src/js/db/DbParameters.js";
import FeedDb from "../../src/js/feeds/db/FeedDb.js";
import { assert } from "chai";
import sinon from "sinon";

describe("DbSession", () => {
    let parametersFake = null, allSandbox = null;
    before("DbSession", () => {
        allSandbox = sinon.sandbox.create();
        allSandbox.stub(console, "warn");
        parametersFake = {
            "type": () => {
                return "PouchDB";
            },
            "getLocalDbUrl": () => {
                return Promise.resolve("localDb");
            },
            "getRemoteDbUrl": () => {
                return Promise.resolve("remoteDb");
            },
            "clearInstance": () => {}
        };
        allSandbox.stub(DbParameters, "instance").returns(parametersFake);
    });

    after("DbSession", () => {
        allSandbox.restore();
    });

    describe("instance", () => {
        let dbSession = null, sandbox = null;
        beforeEach("DbSession", () => {
            DbSession.clearInstance();

            dbSession = new DbSession();
            sandbox = sinon.sandbox.create();
            sandbox.stub(DbSession, "new").returns(dbSession);
        });

        afterEach("DbSession", () => {
            sandbox.restore();
        });

        it("should create the remote db instance", (done) => {
            let dbSessionRemoteDbInstanceMock = sandbox.mock(dbSession).expects("remoteDbInstance").returns(Promise.resolve("session"));
            DbSession.instance().then(session => {
                assert.strictEqual("session", session);
                assert.strictEqual("session", DbSession.db);
                dbSessionRemoteDbInstanceMock.verify();
                done();
            });
        });

        it("should return the previously created db instance", (done) => {
            let dbSessionRemoteDbInstanceMock = sandbox.mock(dbSession).expects("remoteDbInstance").returns(Promise.resolve("session"));
            DbSession.instance().then(() => {
                DbSession.instance().then(session2 => {
                    assert.strictEqual("session", session2);
                    assert.strictEqual("session", DbSession.db);
                    dbSessionRemoteDbInstanceMock.verify();
                    done();
                });
            });
        });
    });


    describe("remoteDbInstance", () => {
        let dbInstance = null, sandbox = null;
        beforeEach("remoteDbInstance", () => {
            sandbox = sinon.sandbox.create();
            dbInstance = new DbSession();
        });

        afterEach("remoteDbInstance", () => {
            sandbox.restore();
        });

        it("should create pouch db of remote instance and initiate replication", (done) => {
            let remotePouchDbMock = sandbox.mock(DbSession).expects("newRemotePouchDb");
            let replicationMock = null;
            DbSession.localDbUrl = "localDb";
            DbSession.remoteDbUrl = "remoteDB";
            replicationMock = sandbox.mock(dbInstance).expects("replicateDb").withArgs(DbSession.remoteDbUrl, DbSession.localDbUrl, {
                "retry": true,
                "live": false
            }, true);

            remotePouchDbMock.returns(Promise.resolve("session"));
            dbInstance.remoteDbInstance().then(session => {
                assert.strictEqual("session", session);
                remotePouchDbMock.verify();
                replicationMock.verify();
                done();
            });
        });
    });

    describe("sync", () => {
        let dbSession = null;
        beforeEach("Sync", () => {
            dbSession = new DbSession();
        });

        afterEach("Sync", () => {

        });

        it("should start the pouchdb sync with remote db. Second call should stop the existing sync", () => {
            let cancelReturn = {
                "cancel": () => {

                }
            };
            let cancelSpy = sinon.spy(cancelReturn, "cancel");
            DbSession.localDbUrl = "localDb";
            DbSession.remoteDbUrl = "remoteDb";
            let dbSessionReplicateDbMock = allSandbox.mock(dbSession).expects("replicateDb").withArgs("localDb", "remoteDb", {
                "retry": true,
                "live": true
            }, false).returns(cancelReturn).once();
            let THREEMINUTE = 180000;
            let replicateRemoteDbMock = allSandbox.mock(dbSession).expects("replicateRemoteDb");
            replicateRemoteDbMock.withArgs(THREEMINUTE).once();
            let oldFeedsDeleteMock = allSandbox.mock(FeedDb).expects("deletePastFeeds").once();

            dbSession.sync();

            dbSessionReplicateDbMock.verify();
            replicateRemoteDbMock.verify();
            oldFeedsDeleteMock.verify();
            cancelSpy.restore();

        });
    });

    describe("replicate", () => {
        let dbSession = null, sandbox = null, dbSessionPouchDbMock = null, dbSessionLocalPouchDbMock = null, pouchDbSyncMock = null;
        let pouchDbDummy = null;
        beforeEach("replicate", () => {
            sandbox = sinon.sandbox.create();
            dbSession = new DbSession();
            pouchDbDummy = {
                "sync": (toDb, options) => { //eslint-disable-line

                }
            };
            dbSessionPouchDbMock = sandbox.mock(DbSession).expects("newPouchDb");
            dbSessionLocalPouchDbMock = sandbox.mock(DbSession).expects("newLocalPouchDb");
            pouchDbSyncMock = sandbox.mock(pouchDbDummy).expects("sync");
        });

        afterEach("replicate", () => {
            sandbox.restore();
        });

        it("should start the pouchd db replicate with remote db and start sync. Replace db with local db once replication completed", (done) => {
            dbSessionPouchDbMock.withArgs("localDb").returns(pouchDbDummy);
            dbSessionLocalPouchDbMock.returns(Promise.resolve("session"));
            sandbox.mock(dbSession).expects("sync");

            let dbObj = { "on": (action, callback) => {
                callback(); //eslint-disable-line callback-return
                if(action === "complete") {
                    dbSessionLocalPouchDbMock.verify();
                    dbSessionPouchDbMock.verify();
                    pouchDbSyncMock.verify();
                    done();
                }
                return dbObj;
            }
            };

            pouchDbSyncMock.withArgs("remoteDb", {
                "retry": true,
                "live": true
            }).returns(dbObj);

            dbSession.replicateDb("localDb", "remoteDb", {
                "retry": true,
                "live": true
            }, true);
        });
    });
});
