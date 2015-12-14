/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";

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
            this.response.status(HttpResponseHandler.codes.OK);
            this.response.json({ "posts": feeds });
        }).catch(error => {
            this.response.status(HttpResponseHandler.codes.NOT_FOUND);
            this.response.json(error);
        });
    }
}
