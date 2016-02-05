/* eslint consistent-this:0*/
"use strict";

import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route.js";

export default class RssFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }

    valid() {
        if(StringUtil.isEmptyString(this.url)) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }

        let rssRequestHandler = RssRequestHandler.instance();
        rssRequestHandler.fetchRssFeedRequest(this.url).then(feeds => {
            this._handleSuccess(feeds);
        }).catch(error => { //eslint-disable-line
            this._handleBadRequest();
        });
    }
}
