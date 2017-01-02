/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import UserDbNameRoute from "../../src/routes/helpers/UserDbNameRoute";
import { assert } from "chai";


describe("UserDbNameRoute", () => {
    let request = null, username = null;

    describe("handle", () => {

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

