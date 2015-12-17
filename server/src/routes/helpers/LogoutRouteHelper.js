"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class LogoutRouteHelper {
    static logoutCallback(response) {
        response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=;Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
    }
}
