import request from "supertest";
import { expect, assert } from "chai";
import argv from "yargs";
import config from "../config/application";

const env = argv.client_environment || "default";
describe("SecurityCheckSpec", () => {
    describe("SecurityCheck for x-powered-by:Express", () => {
        it("response to / should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });

        it("response to /rss-feeds should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
        it("response to /login should not have x-powered-by ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
        it("response to /login should   not have x-powered-by with login ", (done) => {
            const user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.not.have.property("x-powered-by");
                    done();
                });
        });
    });

    describe("SecurityCheck for x-xss-protection 1; mode=block", () => {
        it("response to / should  havex-xss-protection 1; mode=block ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /rss-feeds should  have x-xss-protection 1; mode=block ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/rss-feeds")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /login should  have x-xss-protection 1; mode=block  without login ", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
        it("response to /login should  have x-xss-protection 1; mode=block with login ", (done) => {
            const user = { "username": "test", "password": "test" };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/login")
                .send(user)
                .end((err, res) => { //eslint-disable-line handle-callback-err
                    expect(res.headers).to.have.property("x-xss-protection");
                    assert.equal(res.headers["x-xss-protection"], "1; mode=block");
                    done();
                });
        });
    });
});
