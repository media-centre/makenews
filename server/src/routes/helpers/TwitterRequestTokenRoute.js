/* eslint consistent-this:0*/
"use strict";
import StringUtil from "../../../../common/src/util/StringUtil";
import Route from "./Route.js";
import ApplicationConfig from "../../config/ApplicationConfig.js";
import TwitterLogin from "../../twitter/TwitterLogin.js";

export default class TwitterRequestTokenRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.serverCallbackUrl = this.request.query.serverCallbackUrl;
        this.clientCallbackUrl = this.request.query.clientCallbackUrl;
        this.userName = this.request.query.userName;
    }

    valid() {
        return !StringUtil.isEmptyString(this.userName);
    }
    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }
        TwitterLogin.instance({ "serverCallbackUrl": this.serverCallbackUrl, "clientCallbackUrl": this.clientCallbackUrl, "userName": this.userName }).then((instance) => {
            this._handleSuccess({ "authenticateUrl": ApplicationConfig.instance().twitter().authenticateUrl + "?oauth_token=" + instance.getOauthToken() });
        });
    }
}
