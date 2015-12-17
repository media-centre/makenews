"use strict";
import AllUrlHelper from "./helpers/AllUrlHelper.js";
import LoginRouteHelper from "./helpers/LoginRouteHelper.js";
import LogoutRouterHelper from "./helpers/LogoutRouteHelper.js";

export default (app) => {
    app.post("/login", (request, response, next) => {
        LoginRouteHelper.loginCallback(request, response, next);
    });

    app.get("/logout", (request, response) => {
        LogoutRouterHelper.logoutCallback(response);
    });

    app.use((request, response, next) => {
        AllUrlHelper.allUrlsCallback(request, next);
    });
};
