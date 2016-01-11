/* eslint max-nested-callbacks: [2, 5] handle-callback-err: 0 */
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import argv from "yargs";
import config from "../config/application.json";
import CouchSession from "../src/CouchSession";

let env = argv.client_environment || "default";
describe("FetchAllFeedsSpec", () => {
    let accessToken = null;
    before("RssReaderSpec", (done)=> {
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });

    describe("fetchFeeds", () => {
        xit("response to /fetch-all-feeds-from-all-sources with correct username and correct password ", (done) => {
            let requestData = {
                    "data": [{
                        "url": "http://localhost:3000/thehindu/rss-feeds/",
                        "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                        "timestamp": "1232323"
                    },
                        {
                            "url": "http://localhost:3000/thehindu/error-feeds",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }]
            };

            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/fetch-all-rss")
                .set("Cookie", accessToken)
                .send(requestData)
                .expect(HttpResponseHandler.codes.OK, [], done);
        });
    });
});
