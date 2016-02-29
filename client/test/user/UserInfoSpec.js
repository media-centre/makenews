/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../src/js/db/PouchClient.js";
import UserInfo from "../../src/js/user/UserInfo.js";
import sinon from "sinon";

describe("UserInfo", () => {
    describe("createOrUpdateTokenDocument", () => {
        let getDocumentMock = null, sandbox = sinon.sandbox.create(), userInfoId = "userInfo";
        beforeEach("before", () => {
            getDocumentMock = sandbox.mock(PouchClient).expects("getDocument").withArgs(userInfoId);
        });

        afterEach("after", () => {
            getDocumentMock.verify();
            sandbox.restore();
        });
        describe("create", () => {
            let createDocumentMock = null;
            beforeEach("before", () => {
                createDocumentMock = sandbox.mock(PouchClient).expects("createDocument");
            });

            afterEach("after", () => {
                createDocumentMock.verify();
            });

            it("should create new document when document is not present in db for fb", () => {
                let jsonDocument = {
                    "facebookExpiredAfter": 123456
                };

                getDocumentMock.returns(Promise.reject("error"));
                createDocumentMock.withArgs({ "_id": userInfoId, "facebookExpiredAfter": 123456, "twitterAuthenticated": false, "takenTour": false });
                UserInfo.createOrUpdateTokenDocument(jsonDocument);
            });

            it("should create new document with takenTour detail", () => {
                let jsonDocument = {
                    "takenTour": true
                };

                getDocumentMock.returns(Promise.reject("error"));
                createDocumentMock.withArgs({ "_id": userInfoId, "facebookExpiredAfter": undefined, "twitterAuthenticated": false, "takenTour": true });
                UserInfo.createOrUpdateTokenDocument(jsonDocument);
            });

            it("should create new document when document is not present in db for twitter", () => {
                let jsonDocument = {
                    "twitterAuthenticated": true
                };

                getDocumentMock.returns(Promise.reject("error"));
                createDocumentMock.withArgs({ "_id": userInfoId, "twitterAuthenticated": true, "facebookExpiredAfter": undefined, "takenTour": false });
                UserInfo.createOrUpdateTokenDocument(jsonDocument);
            });
        });

        describe("update", () => {
            let updateDocumentMock = null;
            beforeEach("before", () => {
                updateDocumentMock = sandbox.mock(PouchClient).expects("updateDocument");
            });

            afterEach("after", () => {
                updateDocumentMock.verify();
            });

            it("should update document if it is already present", (done) => {
                let jsonDocument = {
                    "twitterAuthenticated": true
                };

                let alreadyCreatedDocument = { "_id": userInfoId, "facebookExpiredAfter": 123456, "twitterAuthenticated": false };
                getDocumentMock.returns(Promise.resolve(alreadyCreatedDocument));
                updateDocumentMock.withArgs({ "_id": userInfoId, "facebookExpiredAfter": 123456, "twitterAuthenticated": true }).returns(Promise.resolve());
                UserInfo.createOrUpdateTokenDocument(jsonDocument).then((value) => {
                    done();
                });
            });
        });
    });
});
