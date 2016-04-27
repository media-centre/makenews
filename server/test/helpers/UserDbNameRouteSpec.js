/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import Logger from "../../src/logging/Logger";
import LogTestHelper from "./LogTestHelper";
import UserDbNameRoute from "../../src/routes/helpers/UserDbNameRoute";
import sinon from "sinon";
import { assert } from "chai";


describe("UserDbNameRoute", () => {
    let sandbox = null, request = null, username = null;
    beforeEach("UserDbNameRoute", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("UserDbNameRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        beforeEach("handle", () => {
        });

        afterEach("handle", () => {
        });

        describe("invalid", () => {
            it("should respond with bad request for empty user name", (done) =>{
                let response = {
                    "status": (status) => {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        return response;
                    },
                    "json": (json) => {
                        assert.deepEqual({ "message": "bad request" }, json);
                        done();
                    }
                };
                request = { "params": { "userName": "" } };

                let userDbNameRouter = new UserDbNameRoute(request, response);
                userDbNameRouter.handle();
            });
        });

        it("should give the hash for the given Username ", (done) => {
            username = "test";
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "dbName": "db_ad71148c79f21ab9eec51ea5c7dd2b668792f7c0d3534ae66b22f71c61523fb3" }, json);
                    done();
                }
            };
            request = { "params": { "userName": username } };
            let userDbNameRoute = new UserDbNameRoute(request, response);
            userDbNameRoute.handle();
        
        });
    });

});

