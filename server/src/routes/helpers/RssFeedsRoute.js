/* eslint consistent-this:0*/
"use strict";

import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route.js";
import RouteLogger from "../RouteLogger.js";

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
            RouteLogger.instance().warn("RssFeedsRoute:: invalid rss feed url %s.", this.url);
            return this._handleInvalidRoute();
        }

        let rssRequestHandler = RssRequestHandler.instance();
        rssRequestHandler.fetchRssFeedRequest(this.url).then(feeds => {
            RouteLogger.instance().debug("RssFeedsRoute:: successfully fetched rss feeds for url %s.", this.url);
            this._handleSuccess(feeds);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("RssFeedsRoute:: fetching rss feeds failed for url %s. Error: %s", this.url, error);
            this._handleBadRequest();
        });
    }
}
