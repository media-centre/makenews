import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class AddURLDocumentRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.body.url;
        this.accessToken = this.request.cookies.AuthSession;
    }

    inValid() {
        return StringUtils.isEmptyString(this.url) || StringUtils.isEmptyString(this.accessToken);
    }

    async handle() {
        try {
            if (this.inValid()) {
                RouteLogger.instance().warn("AddURLDocument:: invalid URL Document %s.", this.url);
                return this._handleInvalidRequest({ "message": "missing parameters" });
            }
            const rssRequestHandler = RssRequestHandler.instance();
            const response = await rssRequestHandler.addURL(this.url, this.accessToken);
            RouteLogger.instance().debug("AddURLDocument:: successfully saved the document");
            return this._handleSuccess(response);
        } catch (error) {
            RouteLogger.instance().debug(`AddURLDocument:: failed to save the document Error: ${JSON.stringify(error)}`);
            throw this._handleInvalidRequest({ "message": error });
        }
    }
}
