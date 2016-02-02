"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import Route from "./Route.js";

export default class LogoutRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    handle() {
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=;Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
    }
}
