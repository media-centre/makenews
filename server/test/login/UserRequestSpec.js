import * as UserRequest from "../../src/login/UserRequest";
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
        let sessionCooke = null, token = null, couchSessionLoginMock = null;
        beforeEach("getToken", () => {
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            sessionCooke = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
            couchSessionLoginMock = sandbox.mock(CouchSession).expects("login");
        });

        afterEach("getToken", () => {
            sandbox.restore();
        });

        it("should give the valid token if valid credentials are given", async () => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(sessionCooke));

            const actualToken = await UserRequest.getToken(userName, password);

            assert.strictEqual(token, actualToken);
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
        let couchSessionUpdatePasswordStub = null, username = null, newPassword = null;
        beforeEach("updatePassword", () => {
            sandbox = sinon.sandbox.create();
            username = "test";
            newPassword = "new_password";
        });
        afterEach("updatePassword", () => {
            sandbox.restore();
        });
        it("should update the password if old passwords is correct", async () => {
            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            couchSessionUpdatePasswordStub.withArgs(username, newPassword, "test_token").returns(Promise.resolve({ "body": { "ok": true, "id": "org.couchdb.user:test", "rev": "new revision" } }));
            sandbox.mock(UserRequest).expects("getToken").returns(Promise.resolve("test_token"));
            const response = await UserRequest.updatePassword(username, newPassword);
            assert.deepEqual(response.body.ok, true);
        });

        it("should not update the password if old password is incorrect", async () => {
            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            sandbox.mock(UserRequest).expects("getToken").returns(Promise.reject("error"));

            await isRejected(UserRequest.updatePassword(username, newPassword), "error");
        });

        it("should not update the password when couchdb password updation fails", async () => {
            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            const getTokenMock = sandbox.mock(UserRequest).expects("getToken").returns(Promise.resolve("test_token"));
            couchSessionUpdatePasswordStub.withArgs(username, newPassword, "test_token").returns(Promise.reject("Updation failed"));
            await isRejected(UserRequest.updatePassword(username, newPassword), "Updation failed");
            getTokenMock.verify();
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
        let couchClient = null;
        const updatedUserDetails = { "_id": "testId", "visitedUser": true };
        beforeEach("MarkAsVisitedUser", () => {
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient(token, "_users");
            sandbox.stub(CouchClient, "instance").withArgs(token, "_users").returns(couchClient);
        });

        afterEach("MarkAsVisitedUser", () => {
            sandbox.restore();
        });

        it("should update the userDetails document with visitedUser as true and return success response", async () => {
            const expectedResponse = { "ok": true };
            const userDetails = { "_id": "testId" };

            sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(updatedUserDetails).returns(Promise.resolve(expectedResponse));
            sandbox.mock(couchClient).expects("get").returns(Promise.resolve(userDetails));

            const response = await UserRequest.markAsVisitedUser(token, userName);

            assert.deepEqual(response, expectedResponse);
        });

        it("should reject with error if getUserDetails returns an error", async () => {
            sandbox.mock(couchClient).expects("get").returns(Promise.reject("Error"));

            await isRejected(UserRequest.markAsVisitedUser(token, userName), { "message": "not able to update" });
        });

        it("should reject with an error if update document returns with an error", async () => {
            sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(updatedUserDetails).returns(Promise.reject("Error"));
            sandbox.mock(couchClient).expects("get").returns(Promise.resolve({ "_id": "testId" }));

            await isRejected(UserRequest.markAsVisitedUser(token, userName), { "message": "not able to update" });
        });
    });
});
