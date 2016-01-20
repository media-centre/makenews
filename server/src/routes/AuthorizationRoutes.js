"use strict";
import AllUrlHelper from "./helpers/AllUrlHelper.js";
import LoginRoute from "./helpers/LoginRoute.js";
import LogoutRouterHelper from "./helpers/LogoutRouteHelper.js";
import RouteLogger from "./RouteLogger.js";


export default (app) => {
    app.post("/login", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes: /login request received. url = ", request.url);
        try {
            LoginRoute.instance(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("/login error", error);
        }
    });

    app.get("/logout", (request, response) => {
        RouteLogger.instance().info("AuthorizationRoutes: /logout request received");
        try {
            LogoutRouterHelper.logoutCallback(response);
        } catch(error) {
            RouteLogger.instance().error("AuthorizationRoutes: /logout error", error);
        }
    });

    app.use((request, response, next) => {
        try {
            AllUrlHelper.allUrlsCallback(request, next);
        } catch(error) {
            RouteLogger.instance().error("AuthorizationRoutes: all url error", error);
        }
    });
};
