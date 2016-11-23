/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import CryptUtil from "../../src/util/CryptUtil";
import { assert } from "chai";

describe("CryptUtil", () => {
    describe("hmac", () => {
        let key = null, data = null, algorithm = null, digest = null;
        before("hmac", () => {
            key = "test_key";
            data = "test_data";
            algorithm = "sha256";
            digest = "hex";
        });

        it("should do sha256 hash encryption for the given key, data and hex digest", () => {
            let encryptedKey = CryptUtil.hmac(algorithm, key, digest, data);
            assert.strictEqual("46a5b27b7e6672271c998f4d79ed460ff03c88cacd31355ffc161539e1657824", encryptedKey);
        });

        it("should do sha256 hash encryption for the given key and digest", () => {
            let encryptedKey = CryptUtil.hmac(algorithm, key, digest, null);
            assert.strictEqual("d056b2b640f407a9daeba0b13c3b3966e5b69e84283ec3c7fa0cac56a02208a7", encryptedKey);
        });

        it("should throw error if algorithm is null", () => {
            let hmacFunc = () => {
                CryptUtil.hmac(null, key, digest, data);
            };
            assert.throw(hmacFunc, Error, "algorithm or key or digest can not be empty");
        });

        it("should throw error if key is null", () => {
            let hmacFunc = () => {
                CryptUtil.hmac(algorithm, null, digest, data);
            };
            assert.throw(hmacFunc, Error, "algorithm or key or digest can not be empty");
        });

        it("should throw error if digest is null", () => {
            let hmacFunc = () => {
                CryptUtil.hmac(algorithm, key, null, data);
            };
            assert.throw(hmacFunc, Error, "algorithm or key or digest can not be empty");
        });

    });

    describe("userDbHash", () => {
        it("should return the hash for given user", () => {
            assert.strictEqual(CryptUtil.dbNameHash("test"), "db_ad71148c79f21ab9eec51ea5c7dd2b668792f7c0d3534ae66b22f71c61523fb3");
        });
    });
});
