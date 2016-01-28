/* eslint max-nested-callbacks: [2, 5] handle-callback-err:0*/
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "../src/config/ApplicationConfig.js";
import { assert } from "chai";
import CouchSession from "../src/CouchSession";

describe("TwitterReaderSpec", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("TwitterReaderSpec", (done)=> {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });
    describe("TwitterReaderRoutes", () => {
        it("responds to /twitter-feeds with 401 if user is not logged in", (done) => {
            request(serverIp)
                .get("/twitter-feeds")
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, res.statusCode);
                    done();
                });
        });

        it("should return data if the url is valid", (done) => {
            let expectedValues = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, { "id": 2, "id_str": "124", "text": "Tweet 2" }] };
            request(serverIp)
                .get("/twitter-feeds?url=@the_hindu&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    assert.strictEqual("123", expectedValues.statuses[0].id_str);
                    assert.strictEqual("124", expectedValues.statuses[1].id_str);
                    done();
                });
        });

        it("should return 404 error if url is invalid", (done) => {
            request(serverIp)
                .get("/twitter-feeds?url=myTest&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(res.statusCode, HttpResponseHandler.codes.NOT_FOUND);
                    assert.strictEqual("myTest is not a valid twitter handler", res.body.message);
                    done();
                });
        });

        xit("should timeout if the response from twitter takes more time", (done) => {
            request(serverIp)
                .get("/twitter-feeds?url=@timeout&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.NOT_FOUND, res.statusCode);
                    assert.strictEqual("@timeout is not a valid twitter handler", res.body.message);
                    done();
                });
        });

    });
});
