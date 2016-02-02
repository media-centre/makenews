/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import NodeErrorHandler from "../../NodeErrorHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import EnvironmentConfig from "../../config/EnvironmentConfig";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import TwitterLogin from "../../twitter/TwitterLogin.js";
import ResponseUtil from "../../util/ResponseUtil";
import restRequest from "request";
import BatchRequestsRouteHelper from "./BatchRequestsRouteHelper.js";
import ApplicationConfig from "../../config/ApplicationConfig.js";
import Route from "./Route.js";

export default class TwitterRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
    }

    twitterRouter() {
        let url = this.request.query.url;
        let userName = this.request.query.userName;
        if(StringUtil.isEmptyString(url)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, {});
        } else {
            let twitterRequestHandler = TwitterRequestHandler.instance();
            twitterRequestHandler.fetchTweetsRequest(url, userName).then(feeds => {
                this._handleSuccess(feeds);
            }).catch(error => {
                this._handleFailure(error);
            });
        }
    }

    twitterBatchFetch() {
        if(this.isValidRequestData()) {
            let allFeeds = {};
            let counter = 0;
            let twitterRequestHandler = TwitterRequestHandler.instance();
            let userName = this.request.body.userName;
            this.request.body.data.forEach((item)=> {
                twitterRequestHandler.fetchTweetsRequest(item.url, userName, item.timestamp).then(feeds => {
                    allFeeds[item.id] = feeds;
                    if (this.request.body.data.length - 1 === counter) {
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1;
                }).catch(() => {
                    allFeeds[item.id] = "failed";
                    if (this.request.body.data.length - 1 === counter) {
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1;
                });
            });
        } else {
            this._handleInvalidRoute();
        }
    }

    requestToken() {
        let serverCallbackUrl = this.request.query.serverCallbackUrl, clientCallbackUrl = this.request.query.clientCallbackUrl, userName = this.request.query.userName;
        TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": userName }).then((instance) => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "authenticateUrl": ApplicationConfig.instance().twitter().authenticateUrl + "?oauth_token=" + instance.getOauthToken() });
        });
    }

    twitterAuthenticateCallback() {
        TwitterLogin.instance({ "previouslyFetchedOauthToken": this.request.query.oauth_token }).then((twitterLoginInstance) => {
            twitterLoginInstance.accessTokenFromTwitter(this.request.query.oauth_verifier).then((clientRedirectUrl) => {
                this.response.redirect(clientRedirectUrl);
            });
        });
    }
}
