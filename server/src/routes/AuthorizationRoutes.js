"use strict";
import DefaultRoute from "./helpers/DefaultRoute.js";
import LoginRoute from "./helpers/LoginRoute.js";
import LogoutRoute from "./helpers/LogoutRoute.js";
import RenewSessionRoute from "./helpers/RenewSessionRoute.js";
import ChangePasswordRoute from "./helpers/ChangePasswordRoute.js";
import RouteLogger from "./RouteLogger.js";
import UserDbNameRoute from "./helpers/UserDbNameRoute";


export default (app) => {
    app.post("/login", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes:: /login request received. url = %s", request.url);
        try {
            new LoginRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("/login error", error);
        }
    });

    app.get("/logout", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes:: /logout request received");
        try {
            new LogoutRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("AuthorizationRoutes:: /logout error. Error: %s", error);
        }
    });

    app.use((request, response, next) => {
        try {
            new DefaultRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("AuthorizationRoutes: all url error. Error: %s", error);
        }
    });

    app.get("/renew_session", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes:: /renew_session request received. url = %s", request.url);
        try {
            new RenewSessionRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("/session error. Error: %s", error);
        }
    });
    
    app.post("/change_password", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes:: /change_password request received. url = %s", request.url);
        try {
            new ChangePasswordRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error("/change_password error. Error: %s", error);
        }
    });
    
    app.get("/user_db/:userName", (request, response, next) => {
        RouteLogger.instance().info("AuthorizationRoutes:: /user_db request received. url = %s", request.url);
        try {
            new UserDbNameRoute(request, response, next).handle();
        } catch(error) {
            RouteLogger.instance().error(`/user_db error. Error: ${error}`);
        }
    });
};
