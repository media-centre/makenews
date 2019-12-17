/* eslint handle-callback-err: 0 no-magic-numbers:0  */
import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import { expect, assert } from "chai";
import argv from "yargs";
import config from "../config/application";

let cookies = "";
const env = argv.client_environment || "default";
describe("UserLoginTests", () => {
    describe("UserLoginPage", () => {
        it("response to /login with correct username and correct password ", () => {
            const user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .expect(HttpResponseHandler.codes.OK)
                .then(response => {
                    expect(response.body.serverUrl).to.equals("http://localhost:5000");
                    expect(response.body.remoteDbUrl).to.equals("http://localhost:5984");
                });


        });
        it("response to /login correct  username and wrong password ", (done) => {
            const user = { "username": "test", "password": "asdfasdf" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, "{\"message\":\"unauthorized\"}", done);

        });
        it("response to /login empty  username and password ", (done) => {
            const user = { "username": "", "password": "" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, "{\"message\":\"unauthorized\"}", done);

        });
        it("response to /login long  username and password ", (done) => {
            const user = {
                "username": "kfghjfkjykjhhgvghdkjthgkuyhtrsysrchtrajtystffrrtuytsrfs",
                "password": "ytrgftjkkjhtvrtsouyfduteyiufrtfiuyeiugftfuyiydtryfutyigfryedghsiustcrt"
            };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, "{\"message\":\"unauthorized\"}", done);

        });

        it(" verifying cookie against couchdb  on correct username and correct password at /login ", (done) => {
            const user = { "username": "test", "password": "test" };
            let userName = "";
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((serverError, serverResponse) => {
                    cookies = serverResponse.headers["set-cookie"].pop().split(";")[0];
                    request(config[env].couchDbUrl)
                        .get("/_session")
                        .set("Accept", "application/json")
                        .set("Cookie", cookies)
                        .end((couchError, couchResponse) => {
                            userName = couchResponse.body.userCtx.name;
                            assert.equal(userName, user.username);
                            done();
                        });
                });
        });

        it("check set cookie on correct username and password ", (done) => {
            const user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    const thirdCookiePart = 3;
                    cookies = res.headers["set-cookie"].pop().split(";");
                    expect(cookies[0]).to.contain("AuthSession=");
                    assert.equal(" Version=1", cookies[1]);
                    assert.equal(" Path=/", cookies[2]);
                    assert.equal(" HttpOnly", cookies[thirdCookiePart]);
                    done();
                });
        });


        it("cookie not set  on correct username and wrong password ", (done) => {
            const user = { "username": "test", "password": "jkhkh" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    assert.equal(res.headers["set-cookie"], null);
                    done();
                });
        });

        it("cookie not set  on empty username and  password ", (done) => {
            const user = { "username": "", "password": "" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    assert.equal(res.headers["set-cookie"], null);
                    done();
                });
        });
    });
});
