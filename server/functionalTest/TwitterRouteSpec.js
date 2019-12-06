import request from "supertest";
import ApplicationConfig from "../src/config/ApplicationConfig";
import CouchSession from "../src/CouchSession";
import { assert } from "chai";

describe("TwitterRoutesSpec", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("TwitterRoutesSpec", (done)=> {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        }).catch(error => {
            done(new Error(error));
        });
    });

    xdescribe("/twitter-request-token", () => {
        it("it should request token", (done) => {
            request(serverIp)
                .get("/twitter-request-token?serverCallbackUrl=https://localhost:5000")
                .set("Cookie", accessToken)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    let response = { "authenticateUrl": "https://api.twitter.com/oauth/authenticate?oauth_token=" };
                    assert.deepEqual(res.body, response);
                    if(err) {
                        done();
                    }
                    done();
                });
        });
    });

    xdescribe("/twitter-oauth-callback", () => {
        it("it should request access token", (done) => {
            request(serverIp)
                .get("/twitter-oauth-callback?oauth_token=token")
                .set("Cookie", accessToken)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    let response = { "authenticateUrl": "https://api.twitter.com/oauth/authenticate?oauth_token=" };
                    assert.deepEqual(res.body, response);
                    done();
                });
        });
    });

    describe("/twitter-handles", () => {
        it("it should fetch the twitter handles", (done) => {
            request(serverIp)
                .get("/twitter-handles?keyword=key&page=3")
                .set("Cookie", accessToken)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    const response = {
                        "docs": [{ "id": 1277389, "picture": { "data": {} }, "name": "testUser" }],
                        "paging": { "page": 4 },
                        "twitterPreFirstId": 1277389
                    };
                    assert.deepEqual(res.body, response);
                    done();
                });
        });
    });

    describe("/twitter-followings", () => {
        it("it should fetch the twitter followings", (done) => {
            request(serverIp)
                .get("/twitter-followings?page=3")
                .set("Cookie", accessToken)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    const response = {
                        "docs": [{ "id": 1277389, "picture": { "data": {} }, "name": "testUser" }],
                        "paging": { "page": 3 }
                    };
                    assert.deepEqual(res.body, response);
                    done();
                });
        });
    });

});
