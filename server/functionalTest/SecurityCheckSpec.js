/* eslint max-nested-callbacks: [2, 5] react/jsx-wrap-multilines:0 */
/* eslint handle-callback-err: 0 no-magic-numbers:0  */
import request from "supertest";
import { expect, assert } from "chai";
import argv from "yargs";
import config from "../config/application.json";

let env = argv.client_environment || "default";
describe("SecurityCheckSpec", () => {
    describe("SecurityCheck for x-powered-by:Express", () => {
        it("response to / should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => {
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });

        it("response to /rss-feeds should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => {
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
        it("response to /login should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => {
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
        it("response to /login should   not have x-powered-by with login ", (done) => {
            let user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
    });
    describe("SecurityCheck for x-content-type-options:nosniff", () => {
        it("response to / should  have x-content-type-options:nosniff ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-content-type-options");
                    assert.equal(res.headers["x-content-type-options"], "nosniff");
                    done();
                });
        });
        it("response to /rss-feeds should  have x-content-type-options:nosniff ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-content-type-options");
                    assert.equal(res.headers["x-content-type-options"], "nosniff");
                    done();
                });
        });
        it("response to /login should  have x-content-type-options:nosniff without login ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-content-type-options");
                    assert.equal(res.headers["x-content-type-options"], "nosniff");
                    done();
                });
        });
        it("response to /login should   have x-content-type-options:nosniff with login ", (done) => {
            let user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-content-type-options");
                    assert.equal(res.headers["x-content-type-options"], "nosniff");
                    done();
                });
        });
    });

    describe("SecurityCheck for x-frame-options:DENY", () => {

        it("response to / should  have x-frame-options:DENY ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-frame-options");
                    assert.equal(res.headers["x-frame-options"], "DENY");
                    done();
                });
        });
        it("response to /rss-feeds should  have x-frame-options:DENY ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-frame-options");
                    assert.equal(res.headers["x-frame-options"], "DENY");
                    done();
                });
        });
        it("response to /login should  have x-frame-options:DENY without login ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-frame-options");
                    assert.equal(res.headers["x-frame-options"], "DENY");
                    done();
                });
        });
        it("response to /login should  have x-frame-options:DENY with login ", (done) => {
            let user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-frame-options");
                    assert.equal(res.headers["x-frame-options"], "DENY");
                    done();
                });
        });
    });
    describe("SecurityCheck for x-xss-protection 1; mode=block", () => {
        it("response to / should  havex-xss-protection 1; mode=block ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /rss-feeds should  have x-xss-protection 1; mode=block ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /login should  have x-xss-protection 1; mode=block  without login ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /login should  have x-xss-protection 1; mode=block with login ", (done) => {
            let user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
    });
});
