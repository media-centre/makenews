/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbParameters from "../../../src/js/db/DbParameters.js";
import AppSessionStorage from "../../../src/js/utils/AppSessionStorage.js";
import sinon from "sinon";
import { assert } from "chai";

describe("DbParameters", () => {
    let localDbName = null, remoteDbUrl = null;
    before("DbParameters", () => {
        localDbName = "local_db_url";
        remoteDbUrl = "remote_db_url";
    });

    describe("getRemoteDbUrl", () => {
        let appSessionStorage = null, appSessionStorageGetValueMock = null, instance = null;
        beforeEach("getRemoteDbUrl", () => {
            appSessionStorage = new AppSessionStorage();
            sinon.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            appSessionStorageGetValueMock = sinon.mock(appSessionStorage).expects("getValue");
            instance = new DbParameters();
        });

        afterEach("getRemoteDbUrl", () => {
            appSessionStorageGetValueMock.verify();
            appSessionStorage.getValue.restore();
            AppSessionStorage.instance.restore();

        });

        it("should return remote db url", () => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.REMOTEDBURL).returns(remoteDbUrl);
            sinon.stub(instance, "getLocalDbUrl").returns(localDbName);
            let actualRemoteDbUrl = instance.getRemoteDbUrl();
            assert.strictEqual(remoteDbUrl + "/" + localDbName, actualRemoteDbUrl);
            instance.getLocalDbUrl.restore();
        });

        it("should throw error if there is no remote db url", () => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.REMOTEDBURL).returns("  ");
            let remoteDBUrlFn = () => {
                instance.getRemoteDbUrl();
            };
            assert.throw(remoteDBUrlFn, "remote db url can not be empty");
            appSessionStorageGetValueMock.verify();
        });
    });

    describe("getLocalDbUrl", () => {
        let appSessionStorage = null, appSessionStorageGetValueMock = null, instance = null;
        beforeEach("getLocalDbUrl", () => {
            appSessionStorage = new AppSessionStorage();
            sinon.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            appSessionStorageGetValueMock = sinon.mock(appSessionStorage).expects("getValue");
            instance = new DbParameters();
        });

        afterEach("getLocalDbUrl", () => {
            appSessionStorageGetValueMock.verify();
            appSessionStorage.getValue.restore();
            AppSessionStorage.instance.restore();

        });

        it("should return local db url", () => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.USERNAME).returns(localDbName);
            let localDbUrl = instance.getLocalDbUrl();
            assert.strictEqual(localDbName, localDbUrl);
        });

        it("should throw error if there is no local db url", () => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.USERNAME).returns("  ");
            let localDBUrlFn = () => {
                instance.getLocalDbUrl();
            };
            assert.throw(localDBUrlFn, "local db url can not be empty");
            appSessionStorageGetValueMock.verify();
        });
    });
});
