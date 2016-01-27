"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import CouchSession from "../../CouchSession.js";
import RouteLogger from "../RouteLogger.js";

export default class RenewSessionHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    authenticateAgain() {
        if(this.request.cookies && this.request.cookies.AuthSession) {
            CouchSession.authenticate(this.request.cookies.AuthSession).then(newAuthSessionCookie => {
                this._handleSuccess(newAuthSessionCookie);
            }).catch(() => {
                this._handleError();
            });
        } else {
            this._handleUnauthorisedError();
        }
    }

    _handleSuccess(newAuthSessionCookie) {
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", newAuthSessionCookie)
            .json({ "message": "session renewed" });
    }

    _handleError() {
        this.response.status(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR)
            .json({ "message": "Unable to renew session" });
        RouteLogger.instance().error("Renew session request failed");
    }

    _handleUnauthorisedError() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED)
            .json({ "message": "Set AuthSession cookie in request header" });
        RouteLogger.instance().error("AuthSession cookie is not present in request header");
    }
}
