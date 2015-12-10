/* eslint max-nested-callbacks: [2, 5] */
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import config from "../config/application.json";
import argv from "yargs";

let env = argv.client_environment || "default";

describe("TwitterReaderSpec", () => {
    const serverURL = "http://" + config[env].serverIpAddress + ":" + config[env].serverPort;

    describe("TwitterReaderRoutes", () => {
        it.only("responds to /twitter-feeds with 401 if user is not logged in", () => {
            request(serverURL)
                .get("/twitter-feeds")
                .expect(HttpResponseHandler.codes.UNAUTHORIZED);
        });
    });
});
