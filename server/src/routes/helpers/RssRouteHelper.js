/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import ResponseUtil from "../../util/ResponseUtil";
import BatchRequestsRouteHelper from "./BatchRequestsRouteHelper.js";

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

    feedsForAllUrls() {
        let batchRequestsRouteHelper = new BatchRequestsRouteHelper(this.request, this.response);
        if(batchRequestsRouteHelper.isValidRequestData()) {
            let allFeeds = {};
            let rssRequestHandler = RssRequestHandler.instance();
            let counter = 0;
            this.request.body.data.forEach((item)=> {
                rssRequestHandler.fetchRssFeedRequest(item.url).then(feeds => {
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
}
