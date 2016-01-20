/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import DbParameters from "../../src/js/db/DbParameters.js";
import { assert } from "chai";
import sinon from "sinon";
import PouchDB from "pouchdb";

describe("DbSession", () => {
    let parametersFake = null, dbParametesMock = null;
    before("DbSession", () => {
        parametersFake = {
            "type": () => {
                return "PouchDB";
            },
            "getLocalDb": () => {
                return "localDb";
            },
            "getRemoteDb": () => {
                return "remoteDb";
            },
            "clearInstance": () => {}
        };
    });

    beforeEach("DbSession", () => {
        dbParametesMock = sinon.mock(DbParameters);
    });

    afterEach("DbSession", () => {
        DbSession.clearInstance();
        dbParametesMock.verify();
        dbParametesMock.restore();
    });

    describe("clearInstance", () => {
        it("should clear current instance and db parameter instance", () => {
            dbParametesMock.expects("instance").atLeast(2).returns(parametersFake);
            DbSession.instance();
            DbSession.clearInstance();
            DbSession.instance();
        });
    });

    describe("instance", () => {
        it("should create the new pouch db instance", (done) => {
            DbSession.clearInstance();
            dbParametesMock.expects("instance").atLeast(1).returns(parametersFake);
            let dbSessionSyncMock = sinon.mock(DbSession).expects("sync");
            DbSession.instance().then(session => {
                assert.isDefined(session);
                dbSessionSyncMock.verify();
                DbSession.sync.restore();
                done();
            });
        });
    });

    describe("sync", () => {
        it("should start the pouchd db sync with remote db. Second call should stop the existing sync", () => {
            let cancelReturn = {
                "cancel": function() {
                }
            };
            let cancelSpy = sinon.spy(cancelReturn, "cancel");
            sinon.mock(PouchDB).expects("sync").withArgs("localDb", "remoteDb", {
                "live": true,
                "retry": true
            }).twice().returns({
                "on": function() {
                    return {
                        "on": function() {
                            return {
                                "on": function() {
                                    return {
                                        "on": function() {
                                            return {
                                                "on": function() {
                                                    return {
                                                        "on": function() {
                                                            return cancelReturn;
                                                        }
                                                    };
                                                }
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            });
            dbParametesMock.expects("instance").atLeast(2).returns(parametersFake);

            DbSession.sync();
            DbSession.sync();
            assert.isTrue(cancelSpy.calledOnce);

            cancelSpy.restore();
        });
    });
});
