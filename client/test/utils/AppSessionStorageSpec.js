/*eslint max-nested-callbacks:0*/
"use strict";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage.js";
import sinon from "sinon";
import { assert } from "chai";

describe("AppSessionStorage", ()=> {
    let key = null, value = null;
    before("AppSessionStorage", () => {
        key = "test_key";
        value = 1234;

    });

    describe("setItem", () => {
        it("should set the value with the given key", (done) => {
            let localStorage = {
                "setItem": (actualKey, actualValue) => {
                    assert.strictEqual(key, actualKey);
                    assert.strictEqual(value, actualValue);
                    done();
                }
            };

            let appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getLocalStorage").returns(localStorage);
            appSessionStorage.setValue(key, value);
        });

        it("should throw an error if key is empty", () => {
            let appSessionStorage = new AppSessionStorage();
            let setValueFn = () => {
                appSessionStorage.setValue("  ", value);
            };
            assert.throw(setValueFn, "Key or value cannot be empty");
        });

        it("should throw an error if value is empty", () => {
            let appSessionStorage = new AppSessionStorage();
            let setValueFn = () => {
                appSessionStorage.setValue(key, "");
            };
            assert.throw(setValueFn, "Key or value cannot be empty");
        });
    });

    describe("getItem", () => {
        it("should get the value with the given key", (done) => {
            let localStorage = {
                "getItem": (actualKey) => {
                    assert.strictEqual(key, actualKey);
                    done();
                }
            };

            let appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getLocalStorage").returns(localStorage);
            appSessionStorage.getValue(key);
        });

        it("should throw an error if key is empty", () => {
            let appSessionStorage = new AppSessionStorage();
            let setValueFn = () => {
                appSessionStorage.getValue("  ");
            };
            assert.throw(setValueFn, "Key cannot be empty");
        });
    });

    describe("deleteKey", () => {
        it("should delete the key from local storage", (done) => {
            let localStorage = {
                "removeItem": (actualKey) => {
                    assert.strictEqual(key, actualKey);
                    done();
                }
            };

            let appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getLocalStorage").returns(localStorage);
            appSessionStorage.remove(key);
        });
    });

    describe("clear", () => {
        it("should clear all keys from local storage", () => {
            let appSessionStorage = new AppSessionStorage();
            let appSessionStorageMock = sinon.mock(appSessionStorage).expects("remove");
            appSessionStorageMock.thrice();
            appSessionStorage.clear();
            appSessionStorageMock.verify();
            appSessionStorage.remove.restore();
        });

    });
});
