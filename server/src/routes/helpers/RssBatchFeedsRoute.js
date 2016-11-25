/* eslint consistent-this:0*/
import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class RssBatchFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.authSession;
    }

    handle() {
        if(this.isValidRequestData()) {
            let allFeeds = {};
            let rssRequestHandler = RssRequestHandler.instance();
            let counter = 0;
            this.request.body.data.forEach((item)=> {
                rssRequestHandler.fetchBatchRssFeedsRequest(item.url, this.authSession).then(feeds => {
                    allFeeds[item.id] = feeds;
                    if (this.request.body.data.length - 1 === counter) {  //eslint-disable-line no-magic-numbers
                        RouteLogger.instance().debug("RssBatchFeedsRoute:: successfully fetched rss feeds for url %s.", item.url);
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1; //eslint-disable-line no-magic-numbers
                }).catch(() => {
                    allFeeds[item.id] = "failed";
                    if (this.request.body.data.length - 1 === counter) { //eslint-disable-line no-magic-numbers
                        RouteLogger.instance().debug("RssBatchFeedsRoute:: fetching rss feeds for url %s returned no feeds.", item.url);
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1; //eslint-disable-line no-magic-numbers
                });
            });
        } else {
            this._handleInvalidRoute();
        }
    }
}
