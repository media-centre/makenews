import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class AddURLDocumentRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.body.query.url;
    }

    valid() {
        if (Object.keys(this.url).length === 0 || StringUtils.isEmptyString(this.url.name)) { //eslint-disable-line no-magic-numbers
            return false;
        }
        return true;
    }

    handle() { //eslint-disable-line consistent-return
        if (!this.valid()) {
            RouteLogger.instance().warn("AddURLDocument:: invalid URL Document %s.", this.url);
            return this._handleInvalidRoute();
        }
        let rssRequestHandler = RssRequestHandler.instance();
        rssRequestHandler.addDocument(this.url.name, this.url).then(document => {
            RouteLogger.instance().debug("AddURLDocument:: successfully saved the document");
            this._handleSuccess(document);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("AddURLDocument:: failed to save the document Error: %s", error);
            this._handleBadRequest();
        });
    }
}
