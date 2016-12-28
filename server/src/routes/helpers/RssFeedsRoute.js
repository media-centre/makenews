/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class RssFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }

    handle() { //eslint-disable-line consistent-return
        if(StringUtil.isEmptyString(this.url)) {
            RouteLogger.instance().warn("RssFeedsRoute:: invalid rss feed url %s.", this.url);
            return this._handleInvalidRequest({ "message": "invalid url" });
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
