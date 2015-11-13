"use strict";
import AllUrlHelper from "./helpers/AllUrlHelper.js";
import LoginRouteHelper from "./helpers/LoginRouteHelper.js";

export default (app) => {
    app.post("/login", (request, response, next) => {
        LoginRouteHelper.loginCallback(request, response, next);
    });

    app.use((request, response, next) => {
        AllUrlHelper.allUrlsCallback(request, next);
    });
};
