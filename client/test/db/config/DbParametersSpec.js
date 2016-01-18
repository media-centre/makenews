/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbParameters from "../../../src/js/db/DbParameters.js";
import { assert } from "chai";

describe("DbParameters", () => {
    let localDbUrl = null, remoteDbUrl = null;
    before("DbParameters", () => {
        localDbUrl = "local_db_url";
        remoteDbUrl = "remote_db_url";
    });

    it("should throw error if local db url is empty", () => {
        let dbParamtersNewFun = () => {
            return new DbParameters(" ", remoteDbUrl);
        };
        assert.throw(dbParamtersNewFun, "db parameters can not be empty");
    });

    it("should throw error if remote db url is empty", () => {
        let dbParamtersNewFun = () => {
            return new DbParameters(localDbUrl, " ");
        };
        assert.throw(dbParamtersNewFun, "db parameters can not be empty");
    });

    it("should get the proper local db url", () => {
        let dbParameters = new DbParameters(localDbUrl, remoteDbUrl);
        assert.strictEqual(localDbUrl, dbParameters.getLocalDb());
    });

    it("should get the proper remote db url", () => {
        let dbParameters = new DbParameters(localDbUrl, remoteDbUrl);
        assert.strictEqual(remoteDbUrl + "/" + localDbUrl, dbParameters.getRemoteDb());
    });

    describe("clearInstance", ()=> {
        it("should clear parameter instance", ()=> {
            let instance1 = DbParameters.instance("url1", remoteDbUrl);
            DbParameters.clearInstance();
            assert.isUndefined(instance1.dbParameters);
            let instance2 = DbParameters.instance("url2", remoteDbUrl);
            assert.strictEqual("url2", instance2.getLocalDb());
        });
    });
});
