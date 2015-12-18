/* eslint max-nested-callbacks: [2, 5] handle-callback-err:0*/
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import config from "../config/application.json";
import argv from "yargs";
import { assert } from "chai";
import CouchSession from "../src/CouchSession";

let env = argv.client_environment || "qa";
describe("TwitterReaderSpec", () => {
    const serverURL = "http://" + config[env].serverIpAddress + ":" + config[env].serverPort;
    let accessToken = null;
    before("TwitterReaderSpec", (done)=> {
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });
    describe("TwitterReaderRoutes", () => {
        it("responds to /twitter-feeds with 401 if user is not logged in", (done) => {
            request(serverURL)
                .get("/twitter-feeds")
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, res.statusCode);
                    done();
                });
        });

        it("should return data if the url is valid", (done) => {
            let expectedValues = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, { "id": 2, "id_str": "124", "text": "Tweet 2" }] };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
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
            let expectedValues = { "message": "myTest is not a valid twitter handler" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/twitter-feeds?url=myTest&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(res.statusCode, HttpResponseHandler.codes.NOT_FOUND);
                    assert.strictEqual("myTest is not a valid twitter handler", expectedValues.message);
                    done();
                });
        });
    });
});
