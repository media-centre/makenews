/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import ResponseUtil from "../../util/ResponseUtil";
import Route from "./Route.js";

export default class RssRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    feedsForUrl() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            this._handleSuccess({});
        } else {
            let rssRequestHandler = RssRequestHandler.instance();
            rssRequestHandler.fetchRssFeedRequest(url).then(feeds => {
                this._handleSuccess(feeds);
            }).catch(error => {
                this._handleFailure(error);
            });
        }
    }

    feedsForAllUrls() {
        if(this.isValidRequestData()) {
            let allFeeds = {};
            let rssRequestHandler = RssRequestHandler.instance();
            let counter = 0;
            this.request.body.data.forEach((item)=> {
                rssRequestHandler.fetchRssFeedRequest(item.url).then(feeds => {
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
}
