/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import LogoutRoute from "../../../src/routes/helpers/LogoutRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { expect } from "chai";

describe("LogoutRoute", () => {
    describe("handle", () => {
        it("should return response with empty AuthSession cookie", () => {
            const cookie = "AuthSession=;Version=1; Path=/; HttpOnly";
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
                }
            };
            let request = {};
            let next = {};
            new LogoutRoute(request, response, next).handle();
        });
    });
});
