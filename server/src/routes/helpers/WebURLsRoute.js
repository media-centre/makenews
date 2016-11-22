import WebRequestHandler from "../../web/WebRequestHandler";
import Route from "./Route.js";
import RouteLogger from "../RouteLogger.js";

export default class WebURLsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }

    valid() {
        if(Object.keys(this.url).length === 0) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            RouteLogger.instance().warn("WebURLsRoute:: invalid rss feed url %s.", this.url);
            return this._handleInvalidRoute();
        }
        let webRequestHandler = WebRequestHandler.instance();
        webRequestHandler.searchUrl(this.url).then(feeds => {
            RouteLogger.instance().debug("Web URL's Route:: successfully searched for the url %s .", this.url);
            this._handleSuccess(feeds);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("WebURLsRoute:: failed to search for url  %s. Error: %s", this.url, error);
            this._handleBadRequest();
        });
    }
}
