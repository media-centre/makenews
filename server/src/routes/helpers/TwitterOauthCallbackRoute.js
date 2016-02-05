/* eslint consistent-this:0*/
"use strict";
import Route from "./Route.js";
import TwitterLogin from "../../twitter/TwitterLogin.js";

export default class TwitterOauthCallbackRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.oauth_token = this.request.query.oauth_token; //eslint-disable-line
    }

    valid() {
        if(!this.oauth_token) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }
        TwitterLogin.instance({ "previouslyFetchedOauthToken": this.oauth_token }).then((twitterLoginInstance) => {
            twitterLoginInstance.accessTokenFromTwitter(this.request.query.oauth_verifier).then((clientRedirectUrl) => {
                this._handleSuccess(clientRedirectUrl);
            });
        });
    }

    _handleSuccess(clientRedirectUrl) {
        this.response.redirect(clientRedirectUrl);
    }

}
