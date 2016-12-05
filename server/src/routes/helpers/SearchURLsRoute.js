import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class SearchURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.key = this.request.query.key;
        this.offset = this.request.query.offset;
    }

    offsetValue() {
        let ZERO = 0;
        if(!Number.isInteger(this.offset) || this.offset < ZERO) {
            return ZERO;
        }
        return this.offset;
    }

    async handle() {
        try {
            if (StringUtils.isEmptyString(this.key)) {
                RouteLogger.instance().warn("SearchURLsRoute:: invalid rss feed url %s.", this.key);
                return this._handleInvalidRoute();
            }
            let rssRequestHandler = RssRequestHandler.instance();
            let offSetValue = this.offsetValue();
            let feeds = await rssRequestHandler.searchUrl(this.key, offSetValue);
            RouteLogger.instance().debug("SearchURLsRoute:: successfully searched for the url %s .", this.key);
            return this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug("SearchURLsRoute:: failed to search for url  %s. Error: %s", this.key, error);
            throw this._handleBadRequest();
        }
    }
}
