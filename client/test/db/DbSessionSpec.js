/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import DbParameters from "../../src/js/db/DbParameters.js";
import UserSession from "../../src/js/user/UserSession.js";
import { assert } from "chai";
import sinon from "sinon";
import PouchDB from "pouchdb";

describe("DbSession", () => {
    let parametersFake = null, dbParametesMock = null, userSession = null, userSessionMock = null;
    before("DbSession", () => {
        userSession = new UserSession();
        parametersFake = {
            "type": () => {
                return "PouchDB";
            },
            "getLocalDbUrl": () => {
                return "localDb";
            },
            "getRemoteDbUrl": () => {
                return "remoteDb";
            },
            "clearInstance": () => {}
        };
    });

    beforeEach("DbSession", () => {
        sinon.stub(UserSession, "instance").returns(userSession);
        userSessionMock = sinon.mock(userSession).expects("setLastAccessedTime");
        dbParametesMock = sinon.mock(DbParameters);
    });

    afterEach("DbSession", () => {
        dbParametesMock.verify();
        dbParametesMock.restore();
        UserSession.instance.restore();
        userSession.setLastAccessedTime.restore();
    });

    describe("clearInstance", () => {
        it("should clear current instance and db parameter instance", () => {
            dbParametesMock.expects("instance").atLeast(2).returns(parametersFake);
            userSessionMock.twice();
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

        it("should set lastAccessedTime to currentTime", (done) => {
            let sandbox = sinon.sandbox.create();
            DbSession.clearInstance();
            dbParametesMock.expects("instance").returns(parametersFake);
            sandbox.stub(DbSession, "sync");
            DbSession.instance().then(() => {
                userSessionMock.verify();
                sandbox.restore();
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
