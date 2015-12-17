"use strict";

import LogoutRouterHelper from "../../../src/routes/helpers/LogoutRouteHelper.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";

describe("LogoutRouteHelper", () => {
    it("should return response with empty AuthSession cookie", () => {
        const cookie = "AuthSession=;Version=1; Path=/; HttpOnly";
        let response = {
            "status": function(data) {
                expect(HttpResponseHandler.codes.OK).to.equal(data);
                return response;
            },
            "append": function(cookieName, cookieValue) {
                expect(cookieName).to.equal("Set-Cookie");
                expect(cookieValue).to.equal(cookie);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "logout successful" });
            }
        };
        LogoutRouterHelper.logoutCallback(response);
    });
});
