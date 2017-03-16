/*eslint max-nested-callbacks:0*/
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import sinon from "sinon";
import { assert } from "chai";

describe("AppSessionStorage", ()=> {
    let key = null, value = null;
    before("AppSessionStorage", () => {
        key = "test_key";
        value = 1234; // eslint-disable-line no-magic-numbers
    });

    describe("setItem", () => {
        it("should set the value with the given key", (done) => {
            let sessionStorage = {
                "setItem": (actualKey, actualValue) => {
                    assert.strictEqual(key, actualKey);
                    assert.strictEqual(value, actualValue);
                    done();
                }
            };

            let appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getSessionStorage").returns(sessionStorage);
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

        it("should throw an error if value is undefined", () => {
            let appSessionStorage = new AppSessionStorage();
            let setValueFn = () => {
                appSessionStorage.setValue(key);
            };
            assert.throw(setValueFn, "Key or value cannot be empty");
        });
    });

    describe("getItem", () => {
        it("should get the value with the given key", (done) => {
            const sessionStorage = {
                "getItem": (actualKey) => {
                    assert.strictEqual(key, actualKey);
                    done();
                }
            };

            const appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getSessionStorage").returns(sessionStorage);
            appSessionStorage.getValue(key);
        });

        it("should throw an error if key is empty", () => {
            const appSessionStorage = new AppSessionStorage();
            const setValueFn = () => {
                appSessionStorage.getValue("  ");
            };
            assert.throw(setValueFn, "Key cannot be empty");
        });
    });

    describe("deleteKey", () => {
        it("should delete the key from local storage", (done) => {
            const sessionStorage = {
                "removeItem": (actualKey) => {
                    assert.strictEqual(key, actualKey);
                    done();
                }
            };

            const appSessionStorage = new AppSessionStorage();
            sinon.stub(appSessionStorage, "getSessionStorage").returns(sessionStorage);
            appSessionStorage.remove(key);
        });
    });
});
