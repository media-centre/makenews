"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import CouchSession from "../../CouchSession.js";
import RouteLogger from "../RouteLogger.js";
import Route from "./Route.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class RenewSessionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }
    }

    valid() {
        if(StringUtil.isEmptyString(this.authSession)) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            RouteLogger.instance().warn("RenewSessionRoute:: invalid authSession %s.", this.authSession);
            return this._handleInvalidRoute();
        }

        CouchSession.authenticate(this.authSession).then(newAuthSessionCookie => {
            RouteLogger.instance().debug("RenewSessionRoute:: successfully renewed couch session.");
            this._handleSuccess(newAuthSessionCookie);
        }).catch(() => {
            this._handleError();
        });
    }

    _handleSuccess(newAuthSessionCookie) {
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", newAuthSessionCookie)
            .json({ "message": "session renewed" });
    }

    _handleError() {
        this.response.status(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR)
            .json({ "message": "Unable to renew session" });
        RouteLogger.instance().error("RenewSessionRoute:: Renew session request failed");
    }

    _handleUnauthorisedError() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED)
            .json({ "message": "Set AuthSession cookie in request header" });
        RouteLogger.instance().error("RenewSessionRoute:: AuthSession cookie is not present in request header");
    }
}
