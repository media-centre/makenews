/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";

import BatchRequestsRouteHelper from "../../../src/routes/helpers/BatchRequestsRouteHelper.js";
import { assert } from "chai";

describe("BatchRequestsRouteHelper", () => {
    describe("BatchRequestsRouteHelper", () => {
        it("should validate the invalid request data and throw error", () => {
            let response = {};
            let batchFeedsRequest = new BatchRequestsRouteHelper({}, response);
            assert.strictEqual(false, batchFeedsRequest.isValidRequestData());

        });

        it("should return false if id is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds" }
                ]
            };
            let batchFeedsRequest = new BatchRequestsRouteHelper({ "body": requestBody }, {});
            assert.strictEqual(false, batchFeedsRequest.isValidRequestData());
        });

        it("should return false if url is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let batchFeedsRequest = new BatchRequestsRouteHelper({ "body": requestBody }, {});
            assert.strictEqual(false, batchFeedsRequest.isValidRequestData());
        });

        it("should return false if timestamp is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let batchFeedsRequest = new BatchRequestsRouteHelper({ "body": requestBody }, {});
            assert.strictEqual(false, batchFeedsRequest.isValidRequestData());
        });

        it("should not return false if request body is valid", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1", "timestamp": "12556" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let batchFeedsRequest = new BatchRequestsRouteHelper({ "body": requestBody }, {});
            assert.strictEqual(true, batchFeedsRequest.isValidRequestData());
        });
    });
});

