/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import FacebookClient from "../../src/facebook/FacebookClient.js";
import nock from "nock";
import { assert } from "chai";

describe("FacebookClient", () => {

    describe("pageFeeds", () => {
        let accessToken = null, appSecretProof = null, pageName = null;
        before("pageFeeds", () => {
            accessToken = "test_token";
            appSecretProof = "test_secret_proof";
            pageName = "thehindu";
        });


        
        it("should return feeds for a public page", (done) => {
            nock("https://graph.facebook.com")
            .get("/v2.5/" + pageName + "/feed?access_token=" + accessToken + "&appsecret_proof=" + appSecretProof)
            .reply(HttpResponseHandler.codes.OK, {
                "data":
                        [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                        { "message": "test news 2", "id": "163974433696568_957850670975603" }]
            });
            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pageFeeds(pageName).then((feeds) => {
                assert.strictEqual("test news 1", feeds[0].message);
                assert.strictEqual("test news 2", feeds[1].message);
                done();
            });
        });
    });
});
