"use strict";
import UserRequest from "../../../src/login/UserRequest.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ClientConfig from "../../../src/config/ClientConfig.js";
import RouteLogger from "../RouteLogger.js";

export default class LoginRoute {
    static instance(request, response, next) {
        return new LoginRoute(request, response, next);
    }
    constructor(request, response, next) {
        if(!request || !response) {
            throw new Error("request or response can not be empty");
        }

        this.request = request;
        this.response = response;
        this.next = next;
    }

    handle() {
        try {
            RouteLogger.instance().info("LoginRoute::handle Login request received for the user = " + this.request.body.username);

            let userRequest = UserRequest.instance(this.request.body.username, this.request.body.password);
            userRequest.getAuthSessionCookie().then(authSessionCookie => {
                let token = userRequest.extractToken(authSessionCookie);
                userRequest.getUserName(token).then(userName => {
                    this._handleLoginSuccess(authSessionCookie, userName);
                }).catch(error => { //eslint-disable-line
                    RouteLogger.instance().error("LoginRoute::handle Failed while fetching the user name");
                    this._handleLoginFailure();
                });
            }).catch(error => { //eslint-disable-line
                RouteLogger.instance().error("LoginRoute::handle Failed while fetching auth session cookie");
                this._handleLoginFailure();
            });
        } catch(error) {
            RouteLogger.instance().error("LoginRoute::handle Unexpected error = ", error);
            this._handleLoginFailure();
        }
    }

    _handleLoginSuccess(authSessionCookie, userName) {
        let dbJson = ClientConfig.instance().db();
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", authSessionCookie)
            .json({ "userName": userName, "dbParameters": dbJson });

        RouteLogger.instance().info("LoginRoute::_handleLoginSuccess: Login request successful");
        RouteLogger.instance().debug("LoginRoute::_handleLoginSuccess: response = " + JSON.stringify({ "userName": userName, "dbParameters": dbJson }));

        this.next();
    }

    _handleLoginFailure() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED)
            .json({ "message": "unauthorized" });
        RouteLogger.instance().error("LoginRoute::_handleLoginFailure: Login request failed for the user = ", this.request.body.username);
        this.next();
    }
}
