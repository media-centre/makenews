import CouchSession from "../src/CouchSession.js";
import nock from 'nock';
import chai from './helpers/chai';

describe("SessionSpec", () => {
    describe("login", () => {
        it("should login user with given username and password", (done) => {
            let username = "test_user";
            let password = "test_password";
            var scope = nock('http://localhost:5984')
                .post('/_session', {
                    name: username,
                    password: password
                })
                .reply(200, '', {
                    "set-cookie": ["test_token"]
                });

              CouchSession.login(username, password).then((token) => {
                expect(token).to.have.string("test_token");
                done();
              });
        });

        it("should fail if username/password are invalid", (done) => {
            let username = "test_user";
            let password = "test_password";
            var scope = nock('http://localhost:5984')
                .post('/_session', {
                    name: username,
                    password: password
                })
                .replyWithError({
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 5984
                });

            CouchSession.login(username, password).catch((error) => {
                expect(error.code).to.have.string("ECONNREFUSED");
                expect(error.errno).to.have.string("ECONNREFUSED");
                done();
            });
          });
    });

    //describe("currentUser", () => {
    //    it("should return current user name", (done) => {
    //        let username = "srk";
    //        let password = "password";
    //        let createUser = helper.createUser(username, password);
    //        createUser.then(() => {
    //          CouchSession.login(username, password).then((cookie) => {
    //            let token = cookie.split(";")[0].substring(12);
    //            CouchSession.currentUser(token).then((name) => {
    //              expect(name).to.eq(username);
    //              done();
    //          });
    //        });
    //      });
    //    });
    //
    //    it("should return undefined if user is not logged in", (done) => {
    //        CouchSession.currentUser("cmlub2Q6NTYyOEM0Q0Y674hIiGA9xPnFJn-vr75SIjlPJYc").catch(() => {
    //          done();
    //      });
    //    });
    //});
});
