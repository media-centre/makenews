/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import Route from "../../../src/routes/helpers/Route";
import { assert } from "chai";

describe("Route", () => {
    describe("isValidRequestData", () => {
        let response = null, next = null;
        before("Route", () => {
            response = {};
            next = {};
        });
        it("should validate the invalid request data and throw error", () => {
            let route = new Route({}, response);
            assert.strictEqual(false, route.isValidRequestData());

        });

        it("should return false if id is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds" }
                ]
            };
            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should return false if url is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should return false if timestamp is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should not return false if request body is valid", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1", "timestamp": "12556" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(true, route.isValidRequestData());
        });
    });
});

