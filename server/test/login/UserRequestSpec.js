import * as UserRequest from "./../../src/login/UserRequest";
import CouchSession from "../../src/CouchSession";
import CouchClient from "./../../src/CouchClient";
import sinon from "sinon";
import { isRejected } from "./../helpers/AsyncTestHelper";
import { assert } from "chai";

describe("UserRequest", () => {
    let userName = null, password = null;
    let sandbox = null;
    before("UserRequest", () => {
        sandbox = sinon.sandbox.create();
        userName = "test_user_name";
        password = "test_password";
    });

    after("UserRequest", () => {
        sandbox.restore();
    });

    describe("getToken", () => {
        let sessionCooke = null, couchSessionLoginMock = null;
        beforeEach("getToken", () => {
            sessionCooke = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
            couchSessionLoginMock = sandbox.mock(CouchSession).expects("login");
        });

        afterEach("getToken", () => {
            sandbox.restore();
        });

        it("should give the valid token if valid credentials are given", async () => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(sessionCooke));

            const actualToken = await UserRequest.getToken(userName, password);

            assert.strictEqual(sessionCooke, actualToken);
            couchSessionLoginMock.verify();
        });

        it("should reject with error if canse of invalid credentials", async () => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.reject("error"));

            await isRejected(UserRequest.getToken(userName, password), "login failed");
        });
    });

    describe("getAuthSessionCookie", () => {
        let sessionCooke = null, couchSessionLoginMock = null;
        beforeEach("getAuthSessionCookie", () => {
            sessionCooke = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
            couchSessionLoginMock = sandbox.mock(CouchSession).expects("login");
        });

        afterEach("getAuthSessionCookie", () => {
            sandbox.restore();
        });

        it("should give the auth session cookie if valid credentials are given", async () => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(sessionCooke));
            const actualSessionCookie = await UserRequest.getAuthSessionCookie(userName, password);
            assert.strictEqual(sessionCooke, actualSessionCookie);
        });

        it("should reject with error if case of invalid credentials", async () => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.reject("error"));
            await isRejected(UserRequest.getAuthSessionCookie(userName, password), "login failed");
        });
    });

    describe("updatePassword", () => {
        let username = null, newPassword = null, currentPassword = null;
        const token = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
        beforeEach("updatePassword", () => {
            sandbox = sinon.sandbox.create();
            username = "test";
            newPassword = "new_password";
            currentPassword = "current_password";
        });
        afterEach("updatePassword", () => {
            sandbox.restore();
        });
        it("should update the password if old passwords is correct", async () => {
            const couchSessionLogin = sandbox.mock(CouchSession).expects("login").withArgs(username, currentPassword).returns(Promise.resolve(token));
            sandbox.mock(UserRequest).expects("getToken").withArgs(username, currentPassword).returns(Promise.resolve("dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA"));
            sandbox.mock(CouchSession).expects("updatePassword").returns(Promise.resolve({ "body": { "ok": true, "id": "org.couchdb.user:test", "rev": "new revision" } }));
            const response = await UserRequest.updatePassword(username, newPassword, currentPassword);
            assert.deepEqual(response.body.ok, true);
            couchSessionLogin.verify();
        });

        it("should not update the password if old password is incorrect", async () => {
            sandbox.mock(CouchSession).expects("login").withArgs(username, currentPassword).returns(Promise.reject("error"));
            sandbox.mock(UserRequest).expects("getToken").withArgs(username, currentPassword).returns(Promise.reject("error"));

            await isRejected(UserRequest.updatePassword(username, newPassword, currentPassword), "login failed");
        });

        it("should not update the password when couchdb password updation fails", async () => {
            const couchSessionLogin = sandbox.mock(CouchSession).expects("login").withArgs(username, currentPassword).returns(Promise.resolve(token));
            sandbox.mock(UserRequest).expects("getToken").returns(Promise.resolve(token));
            sandbox.mock(CouchSession).expects("updatePassword").withArgs(username, newPassword, "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA").returns(Promise.reject("Updation failed"));
            await isRejected(UserRequest.updatePassword(username, newPassword, currentPassword), "Updation failed");
            couchSessionLogin.verify();
        });
    });

    describe("getUserDetails", () => {
        sandbox = sinon.sandbox.create();
        afterEach("getuserDetails", () => {
            sandbox.restore();
        });

        it("should get the user details", async () => {
            const name = "test", token = "token";
            const expectedUserDetails = { "takenTour": false };
            const couchClient = new CouchClient(token, "_users");
            sandbox.stub(CouchClient, "instance").withArgs(token, "_users").returns(couchClient);
            const getMock = sandbox.mock(couchClient).expects("get");
            getMock.withArgs(`/_users/org.couchdb.user:${name}`).returns(Promise.resolve(expectedUserDetails));

            const userDetails = await UserRequest.getUserDetails(token, name);

            assert.deepEqual(userDetails, expectedUserDetails);
            getMock.verify();
        });

        it("should reject with error if fetch fails", async () => {
            const name = "test", token = "token";
            const couchClient = new CouchClient(token, "_users");
            sandbox.stub(CouchClient, "instance").withArgs(token, "_users").returns(couchClient);
            const getMock = sandbox.mock(couchClient).expects("get");
            getMock.withArgs(`/_users/org.couchdb.user:${name}`).returns(Promise.reject("error"));

            await isRejected(UserRequest.getUserDetails(token, name), "error");
        });
    });
    
    describe("MarkAsVisitedUser", () => {
        const token = "token";
        let couchClient = null, couchClientUser = null;
        const updatedUserDetails = {
            "_id": "org.couchdb.user:test_user_name",
            "_rev": "12345",
            "derived_key": "test derived key",
            "iterations": 10,
            "name": "test_user",
            "password_scheme": "scheme",
            "roles": [],
            "salt": "123324124124",
            "type": "user",
            "visitedUser": true
        };
        beforeEach("MarkAsVisitedUser", () => {
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient(token, "_users");
            couchClientUser = new CouchClient(token);
            let couchInstanceMock = sandbox.mock(CouchClient).expects("instance").twice();
            couchInstanceMock.onFirstCall().returns(couchClient);
            couchInstanceMock.onSecondCall().returns(couchClientUser);
        });

        afterEach("MarkAsVisitedUser", () => {
            sandbox.restore();
        });

        it("should update the userDetails document with visitedUser as true and return success response", async () => {
            const getDocumentMock = sandbox.mock(couchClient).expects("getDocument");
            const findDocumentMock = sandbox.mock(couchClientUser).expects("findDocuments");
            getDocumentMock.returns(Promise.resolve({
                "_id": "org.couchdb.user:" + userName,
                "_rev": "12345",
                "derived_key": "test derived key",
                "iterations": 10,
                "name": "test_user",
                "password_scheme": "scheme",
                "roles": [],
                "salt": "123324124124",
                "type": "user"
            }));
            findDocumentMock.returns(Promise.resolve({ "docs": [{
                "_id": "newsclick.in",
                "docType": "source",
                "sourceType": "web"
            }] }));

            sandbox.mock(couchClient).expects("updateDocument")
                .returns(Promise.resolve(true));

            const response = await UserRequest.markAsVisitedUser(token, userName);

            assert.deepEqual(response, true);
        });

        it("should reject with error if getDocument returns an error", async () => {
            sandbox.mock(couchClient).expects("getDocument").returns(Promise.reject("Error"));

            await isRejected(UserRequest.markAsVisitedUser(token, userName), { "message": "not able to update" });
        });

        it("should reject with an error if update document returns with an error", async () => {
            const getDocumentMock = sandbox.mock(couchClient).expects("getDocument");
            getDocumentMock.returns(Promise.resolve({
                "_id": "org.couchdb.user:" + userName,
                "_rev": "12345",
                "derived_key": "test derived key",
                "iterations": 10,
                "name": "test_user",
                "password_scheme": "scheme",
                "roles": [],
                "salt": "123324124124",
                "type": "user"
            }));
            sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(updatedUserDetails).returns(Promise.reject("Error"));

            await isRejected(UserRequest.markAsVisitedUser(token, userName), { "message": "not able to update" });
        });
    });
});
