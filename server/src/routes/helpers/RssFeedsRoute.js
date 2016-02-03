/* eslint consistent-this:0*/
"use strict";

import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route.js";

export default class RssFeedsRoute extends Route {
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
}
