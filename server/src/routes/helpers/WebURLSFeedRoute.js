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
        webRequestHandler.saveDocument(this.url.name, this.url).then(response => {
            RouteLogger.instance().debug("WebURLsRoute:: successfully saved the document");
            this._handleSuccess(response);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("WebURLsRoute:: failed to save the document Error: %s", error);
            this._handleBadRequest();
        });
    }
}
