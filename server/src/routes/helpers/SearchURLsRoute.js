import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class SearchURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.key = this.request.query.key;
    }

    valid() {
        if(StringUtils.isEmptyString(this.key)) { //eslint-disable-line no-magic-numbers
            return false;
        }
        return true;
    }

    async handle() {                                   //eslint-disable-line consistent-return
        try {
            if (!this.valid()) {
                RouteLogger.instance().warn("SearchURLsRoute:: invalid rss feed url %s.", this.key);
                return this._handleInvalidRoute();
            }
            let rssRequestHandler = RssRequestHandler.instance();
            let feeds = await rssRequestHandler.searchUrl(this.key);
            RouteLogger.instance().debug("SearchURLsRoute:: successfully searched for the url %s .", this.key);
            return this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug("SearchURLsRoute:: failed to search for url  %s. Error: %s", this.key, error);
            throw this._handleBadRequest();
        }
    }
}
