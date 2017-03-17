import Route from "./Route";
import RssRequestHandler from "./../../rss/RssRequestHandler";

export default class WebDefaultSourcesRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.skip = super.validateNumber(this.request.query.offset);
    }

    async handle() {
        const rssRequestHandler = RssRequestHandler.instance();
        return await rssRequestHandler.fetchDefaultSources(this.skip);
    }
}
