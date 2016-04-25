/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbParameters from "../../../src/js/db/DbParameters.js";
import AppSessionStorage from "../../../src/js/utils/AppSessionStorage.js";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";
import AppWindow from "../../../src/js/utils/AppWindow";

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

        it("should return remote db url", (done) => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.REMOTEDBURL).returns(remoteDbUrl);
            sinon.stub(instance, "getLocalDbUrl").returns(Promise.resolve(localDbName));
            instance.getRemoteDbUrl().then(dbUrl => {
                assert.strictEqual(remoteDbUrl + "/" + localDbName, dbUrl);
                instance.getLocalDbUrl.restore();
                done();
            });
        });

        it("should throw error if there is no remote db url", (done) => {
            appSessionStorageGetValueMock.withArgs(AppSessionStorage.KEYS.REMOTEDBURL).returns("  ");
            instance.getRemoteDbUrl().catch(error => {
                assert.strictEqual(error, "remote db url can not be empty");
                appSessionStorageGetValueMock.verify();
                done();
            });
        });
    });

    describe("getLocalDbUrl", () => {
        let appSessionStorage = null, appSessionStorageGetValueMock = null, instance = null, ajaxMock = null, ajaxGetMock = null, sandbox = null;
        beforeEach("getLocalDbUrl", () => {
            appSessionStorage = new AppSessionStorage();
            sandbox = sinon.sandbox.create();
            sinon.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            appSessionStorageGetValueMock = sinon.mock(appSessionStorage).expects("getValue");
            sandbox.stub(AppWindow, "instance").returns({ "get": () => {
                return "url";
            } });
            ajaxMock = new AjaxClient("/user_db", true);
            ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
            sandbox.stub(AjaxClient, "instance").withArgs(`/user_db/${localDbName}`).returns(ajaxMock);
            instance = new DbParameters();
        });

        afterEach("getLocalDbUrl", () => {
            appSessionStorageGetValueMock.verify();
            appSessionStorage.getValue.restore();
            AppSessionStorage.instance.restore();
            sandbox.restore();

        });

        it("should return local db url", (done) => {
            appSessionStorageGetValueMock.returns(localDbName);
            let responseJson = { "hash": "db_0da7fa00f1d40002e108eb16f1d3690a9e096b009d610eff32ac973a11cb5671" };
            ajaxGetMock.returns(Promise.resolve(responseJson));
            instance.getLocalDbUrl().then(response => {
                assert.strictEqual("db_0da7fa00f1d40002e108eb16f1d3690a9e096b009d610eff32ac973a11cb5671", response);
                done();
            });
        });

        it("should throw error if there is no local db url", () => {
            appSessionStorageGetValueMock.returns("  ");
            instance.getLocalDbUrl().catch(error => {
                assert.throw(error, "local db url can not be empty");
            });
            appSessionStorageGetValueMock.verify();
        });
    });
});
