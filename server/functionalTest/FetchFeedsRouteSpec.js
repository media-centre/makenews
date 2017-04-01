import request from "supertest";
import { assert } from "chai";
import ApplicationConfig from "../src/config/ApplicationConfig";
import CouchClient from "../src/CouchClient";

describe("FetchFeedsRoute", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("FetchFeedsRoute", (done) => {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        const sourceDocument = {
            "_id": "118170f0e2e427469e66f5f2740009e7",
            "docType": "source",
            "sourceType": "fb_page"
        };

        const user = { "username": "test", "password": "test" };
        request(serverIp)
            .post("/login")
            .send(user)
            .then((resp) => {
                accessToken = resp.headers["set-cookie"].pop().split(";")[0].split("=")[1];  //eslint-disable-line no-magic-numbers
                const couchClient = new CouchClient(accessToken, "db_ad71148c79f21ab9eec51ea5c7dd2b668792f7c0d3534ae66b22f71c61523fb3");
                couchClient.updateDocument(sourceDocument).then(()=> {
                    done();
                });
            }).catch(error => {
                done(new Error(error));
            });

    });

    describe("/fetch-feeds", () => {
        it("should fetch feeds from all sources", () => {
            request(serverIp)
                .post("/fetch-feeds")
                .set("Cookie", accessToken)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    assert.equal(res.statusCode, 200); //eslint-disable-line no-magic-numbers
                    assert.deepEqual(res.body, { "status": true });
                });
        });
    });
});
