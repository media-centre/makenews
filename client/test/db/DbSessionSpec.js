/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import DbParameters from "../../src/js/db/config/DbParameters.js";
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
        it("should create the new pouch db instance for the first time", () => {
            dbParametesMock.expects("instance").atLeast(1).returns(parametersFake);

            assert.isDefined(DbSession.instance());
            assert.isDefined(DbSession.instance());
            assert.isDefined(DbSession.instance());
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
