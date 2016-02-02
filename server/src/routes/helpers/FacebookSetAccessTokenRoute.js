/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import Route from "./Route.js";

export default class FacebookSetAccessTokenRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.body.accessToken;
        this.userName = this.request.body.userName;
    }

    valid() {
        if(StringUtil.isEmptyString(this.accessToken) || StringUtil.isEmptyString(this.userName)) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }

        let facebookReqHan = FacebookRequestHandler.instance(this.accessToken);
        facebookReqHan.setToken(this.userName).then(expiresAfter => {
            this._handleSuccess({ "expires_after": expiresAfter });
        }).catch(error => {
            this._handleFailure(error);
        });

    }
}
