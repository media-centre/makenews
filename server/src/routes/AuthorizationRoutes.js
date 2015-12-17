"use strict";
import AllUrlHelper from "./helpers/AllUrlHelper.js";
import LoginRouteHelper from "./helpers/LoginRouteHelper.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";

export default (app) => {
    app.post("/login", (request, response, next) => {
        LoginRouteHelper.loginCallback(request, response, next);
    });

    app.get("/logout", (request, response, next) => {
        response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=; Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
        next();
    });

    app.use((request, response, next) => {
        AllUrlHelper.allUrlsCallback(request, next);
    });
};
