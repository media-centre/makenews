/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import LogoutRoute from "../../../src/routes/helpers/LogoutRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { userDetails } from "../../../src/Factory";
import { expect } from "chai";
import sinon from "sinon";

describe("LogoutRoute", () => {
    let sandbox = sinon.sandbox.create();
    afterEach("LogoutRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        it("should return response with empty AuthSession cookie", () => {
            const cookie = "AuthSession=;Version=1; Path=/; HttpOnly";
            let userDetailsMock = sandbox.mock(userDetails).expects("removeUser");
            let response = {
                "status": (data) => {
                    expect(HttpResponseHandler.codes.OK).to.equal(data);
                    return response;
                },
                "append": (cookieName, cookieValue) => {
                    expect(cookieName).to.equal("Set-Cookie");
                    expect(cookieValue).to.equal(cookie);
                    return response;
                },
                "json": (data) => {
                    expect(data).to.deep.equal({ "message": "logout successful" });
                    userDetailsMock.verify();
                }
            };
            let request = { "cookies": { "AuthSession": "token1" } };
            let next = {};
            userDetailsMock.withArgs("token1");
            new LogoutRoute(request, response, next).handle();
        });
    });
});
