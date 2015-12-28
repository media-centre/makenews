/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import ResponseUtil from "../../util/ResponseUtil";

export default class RssRouteHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    feedsForUrl() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, {});
        } else {
            let rssRequestHandler = RssRequestHandler.instance();
            rssRequestHandler.fetchRssFeedRequest(url).then(feeds => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, feeds);
            }).catch(error => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.NOT_FOUND, error);
            });
        }
    }
}
