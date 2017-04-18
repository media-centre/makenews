import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";

export default class SearchURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.keyword = this.request.query.keyword;
        this.offset = super.validateNumber(this.request.query.offset);
    }

    validate() {
        return typeof this.keyword === "undefined" || this.keyword === null ? "keyword should be present" : null;
    }

    async handle() {
        const rssRequestHandler = RssRequestHandler.instance();
        return await rssRequestHandler.searchUrl(this.keyword, this.offset);
    }
}
