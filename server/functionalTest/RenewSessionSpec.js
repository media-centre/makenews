/* eslint max-nested-callbacks: [2, 5] handle-callback-err: 0 */
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import CouchSession from "../src/CouchSession";
import { expect } from "chai";
import argv from "yargs";
import config from "../config/application.json";

let env = argv.client_environment || "default";
describe("RenewSession", () => {
    it("should return 401 if no user logged in", (done) => {
        request(config[env].serverIpAddress + ":" + config[env].serverPort)
            .get("/renew_session")
            .end((err, res) => {
                expect(res.statusCode).to.eq(HttpResponseHandler.codes.BAD_REQUEST);
                done();
            });
    });

    it("should renew session if user is logged in", (done) => {
        CouchSession.login("test", "test").then((token) => {
            let accessToken = token;
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/renew_session")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    let cookies = res.headers["set-cookie"].pop().split(";");
                    expect(cookies[0]).to.contain("AuthSession=");
                    done();
                });
        });
    });
});
