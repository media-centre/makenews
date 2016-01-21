/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import moment from "moment";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../facebook/FacebookAccessToken.js";
import ResponseUtil from "../../util/ResponseUtil";
import BatchRequestsRouteHelper from "./BatchRequestsRouteHelper.js";

export default class FacebookRouteHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    pageRouter() {
        let webUrl = this.request.query.webUrl;
        let since = this.request.query.since;
        let userName = this.request.query.userName;
        if(StringUtil.isEmptyString(webUrl) || StringUtil.isEmptyString(userName) || (since && !moment(since).isValid())) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
            return;
        }
        let options = {};
        if(since) {
            options.since = moment(since).toISOString();
        }
        FacebookAccessToken.instance().getAccessToken(userName).then((token) => {
            FacebookRequestHandler.instance(token).pagePosts(webUrl, options).then(feeds => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "posts": feeds });
            }).catch(error => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, error);
            });
        }).catch(error => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, error);
        });
    }

    tokenRouter() {
        let accessToken = this.request.body.accessToken;
        let userName = this.request.body.userName;
        if(StringUtil.isEmptyString(accessToken) || StringUtil.isEmptyString(userName)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
            return;
        }
        FacebookRequestHandler.instance(accessToken).setToken(userName).then(expiresAfter => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "expires_after": expiresAfter });
        }).catch(error => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, error);
        });
    }

    fetchMultiplePages() {
        let batchRequestsRouteHelper = new BatchRequestsRouteHelper(this.request, this.response);
        if(batchRequestsRouteHelper.isValidRequestData()) {
            let userName = this.request.body.userName;
            FacebookAccessToken.instance().getAccessToken(userName).then((accessToken) => {
                let facebookRequestHandler = FacebookRequestHandler.instance(accessToken);

                let allFeeds = {};
                let counter = 0;
                this.request.body.data.forEach((item)=> {
                    let options = {};
                    if (item.timestamp) {
                        options.since = moment(item.timestamp).toISOString();

                    }
                    facebookRequestHandler.pagePosts(item.url, options).then(feeds => { // eslint-disable-line max-nested-callbacks
                        allFeeds[item.id] = feeds;
                        if (this.request.body.data.length - 1 === counter) {
                            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "posts": allFeeds });
                        }
                        counter += 1;
                    }).catch(() => { // eslint-disable-line max-nested-callbacks
                        allFeeds[item.id] = "failed";
                        if (this.request.body.data.length - 1 === counter) {
                            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "posts": allFeeds });
                        }
                        counter += 1;
                    });
                });
            }).catch(error => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, error);
            });
        } else {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
        }
    }
}
