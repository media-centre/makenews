import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class SearchURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }

    valid() {
        if(Object.keys(this.url).length === 0) { //eslint-disable-line no-magic-numbers
            return false;
        }
        return true;
    }

    async handle() {                                   //eslint-disable-line consistent-return
        try {
            if (!this.valid()) {
                RouteLogger.instance().warn("SearchURLsRoute:: invalid rss feed url %s.", this.url);
                return this._handleInvalidRoute();
            }
            let rssRequestHandler = RssRequestHandler.instance();
            let feeds = await rssRequestHandler.searchUrl(this.url);
            RouteLogger.instance().debug("SearchURLsRoute:: successfully searched for the url %s .", this.url);
            return this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug("SearchURLsRoute:: failed to search for url  %s. Error: %s", this.url, error);
            throw this._handleBadRequest();
        }
    }
}
