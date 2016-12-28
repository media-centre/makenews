import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class SearchURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.keyword = this.request.query.keyword;
        this.offset = this.request.query.offset;
    }

    offsetValue() {
        let ZERO = 0;
        let offset = Number.parseInt(this.offset, 10);
        return (Number.isInteger(offset) && offset >= ZERO) ? offset : ZERO;
    }

    async handle() {
        if (StringUtils.isEmptyString(this.keyword)) {
            RouteLogger.instance().warn("SearchURLsRoute:: invalid rss feed url %s.", this.keyword);
            return this._handleInvalidRequest({ "message": "keyword missing" });
        }

        let rssRequestHandler = RssRequestHandler.instance();
        try {
            let feeds = await rssRequestHandler.searchUrl(this.keyword, this.offsetValue());
            RouteLogger.instance().debug("SearchURLsRoute:: successfully searched for the url %s .", this.keyword);
            return this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug("SearchURLsRoute:: failed to search for url  %s. Error: %s", this.keyword, error);
            throw this._handleBadRequest();
        }
    }
}
