/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import moment from "moment";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../facebook/FacebookAccessToken.js";
import ResponseUtil from "../../util/ResponseUtil";

export default class FacebookRouteHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    pageRouter() {
        let webUrl = this.request.query.webUrl;
        let since = this.request.query.since;
        if(StringUtil.isEmptyString(webUrl) || (since && !moment(since).isValid())) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
            return;
        }
        let options = {};
        if(since) {
            options.since = moment(since).toISOString();
        }
        FacebookAccessToken.instance().getAccesToken().then((token) => {
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
        if(StringUtil.isEmptyString(accessToken)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.BAD_REQUEST, "bad request");
            return;
        }
        FacebookRequestHandler.instance(accessToken).setToken().then(expiresAfter => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "expires_after": expiresAfter });
        }).catch(error => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, error);
        });
    }
}
