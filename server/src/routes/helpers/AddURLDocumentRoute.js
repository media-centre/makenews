import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class AddURLDocumentRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.body.url;
    }

    valid() {
        if (StringUtils.isEmptyString(this.url)) { //eslint-disable-line no-magic-numbers
            return false;
        }
        return true;
    }

    async handle() {                                                                              //eslint-disable-line consistent-return
        try {
            if (!this.valid()) {
                RouteLogger.instance().warn("AddURLDocument:: invalid URL Document %s.", this.url);
                return this._handleInvalidRoute();
            }
            let rssRequestHandler = RssRequestHandler.instance();
            let response = await rssRequestHandler.addURL(this.url);
            RouteLogger.instance().debug("AddURLDocument:: successfully saved the document");
            return this._handleSuccess(response);

        } catch (error) { //eslint-disable-line
            RouteLogger.instance().debug("AddURLDocument:: failed to save the document Error: %s", error);
            throw this._handleBadRequest();
        }
    }
}
