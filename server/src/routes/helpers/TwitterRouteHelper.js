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

export default class TwitterRouteHelper {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    twitterRouter() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, {});
        } else {
            let twitterRequestHandler = TwitterRequestHandler.instance();
            twitterRequestHandler.fetchTweetsRequest(url).then(feeds => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, feeds);
            }).catch(error => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.NOT_FOUND, error);
            });
        }
    }

    twitterBatchFetch() {
        let batchRequestsRouteHelper = new BatchRequestsRouteHelper(this.request, this.response);
        if(batchRequestsRouteHelper.isValidRequestData()) {
            let allFeeds = {};
            let counter = 0;
            let twitterRequestHandler = TwitterRequestHandler.instance();

            this.request.body.data.forEach((item)=> {
                twitterRequestHandler.fetchTweetsRequest(item.url, item.timestamp).then(feeds => {
                    allFeeds[item.id] = feeds;
                    if (this.request.body.data.length - 1 === counter) {
                        ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, allFeeds);
                    }
                    counter += 1;
                }).catch(() => {
                    allFeeds[item.id] = "failed";
                    if (this.request.body.data.length - 1 === counter) {
                        ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, allFeeds);

                    }
                    counter += 1;
                });
            });
        } else {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
        }
    }

    requestToken() {
        let serverCallbackUrl = this.request.query.serverCallbackUrl, clientCallbackUrl = this.request.query.clientCallbackUrl;
        TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl }).then((instance) => {
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
