import WebRequestHandler from "../../web/WebRequestHandler";
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

    handle() {                                   //eslint-disable-line consistent-return
        if(!this.valid()) {
            RouteLogger.instance().warn("SearchURLsRoute:: invalid rss feed url %s.", this.url);
            return this._handleInvalidRoute();
        }
        let webRequestHandler = WebRequestHandler.instance();
        webRequestHandler.searchUrl(this.url).then(feeds => {
            RouteLogger.instance().debug("Web URL's Route:: successfully searched for the url %s .", this.url);
            this._handleSuccess(feeds);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("SearchURLsRoute:: failed to search for url  %s. Error: %s", this.url, error);
            this._handleBadRequest();
        });
    }
}
