import request from "supertest";
import { assert } from "chai";
import ApplicationConfig from "../src/config/ApplicationConfig";
import CouchClient from "../src/CouchClient";
import CryptUtil from "../src/util/CryptUtil";

describe("FetchFeedsRoute", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    let couchClient = null, sourceDocument = null;

    before("FetchFeedsRoute", (done) => {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        sourceDocument = {
            "docs": [{
                "_id": "118170f0e2e427469e66f5f2740009e7",
                "docType": "source",
                "sourceType": "fb_page"
            }, {
                "_id": "128170f0e2e427469e66f5f2740009e7",
                "docType": "source",
                "sourceType": "twitter"
            }, {
                "_id": "http://localhost:3000/https://www.thehindu.com",
                "docType": "source",
                "sourceType": "web"
            }]
        };

        const user = { "username": "test", "password": "test" };
        request(serverIp)
            .post("/login")
            .send(user)
            .then((resp) => {
                accessToken = resp.headers["set-cookie"].pop().split(";")[0].split("=")[1]; //eslint-disable-line no-magic-numbers
                couchClient = new CouchClient(accessToken, CryptUtil.dbNameHash("test"));
                couchClient.saveBulkDocuments(sourceDocument).then(()=> {
                    done();
                }).catch(err => { //eslint-disable-line
                    done();
                });
            }).catch(error => {
                done(new Error(error));
            });

    });

    after("FetchFeedsRoute", (done) => {
        sourceDocument.docs.forEach((doc, index) => {
            couchClient.deleteDocument(encodeURIComponent(doc._id))
                .then(() => {
                    if(index === (sourceDocument.docs.length - 1)) { //eslint-disable-line no-magic-numbers
                        done();
                    }
                })
                .catch(err => {
                    err.msg = `Unable to delete doc ${doc._id}`;
                    done(err);
                });
        });
    });


    describe("/fetch-feeds", () => {
        it("should fetch feeds from all sources", (done) => {
            request(serverIp)
                .post("/fetch-feeds")
                .set("Cookie", `AuthSession=${accessToken}`)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    assert.equal(res.statusCode, 200); //eslint-disable-line no-magic-numbers
                    assert.deepEqual(res.body, { "status": true });
                    done();
                });
        });
    });
});
