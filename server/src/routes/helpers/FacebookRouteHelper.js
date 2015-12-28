/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import ResponseUtil from "../../util/ResponseUtil";

export default class FacebookRouteHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    pageRouter() {
        let pageName = this.request.query.nodeName;
        let accessTokenName = this.request.query.accessToken;
        let facebookRequestHandler = FacebookRequestHandler.instance(accessTokenName);
        facebookRequestHandler.pagePosts(pageName).then(feeds => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, { "posts": feeds });
        }).catch(error => {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.NOT_FOUND, error);
        });
    }
}
