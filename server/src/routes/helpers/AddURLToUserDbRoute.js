import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";

export default class AddURLToUserDbRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.body.url;
        this.accessToken = this.request.body.accessToken;
        this.userName = this.request.body.userName;
    }

    valid() {
        if (StringUtils.isEmptyString(this.url) || StringUtils.isEmptyString(this.accessToken) || StringUtils.isEmptyString(this.userName)) { //eslint-disable-line no-magic-numbers
            return false;
        }
        return true;
    }

    async handle() { //eslint-disable-line consistent-return
        try {
            if (!this.valid()) {
                RouteLogger.instance().warn("AddURLToUserDb:: invalid URL Document %s.", this.url);
                return this._handleInvalidRoute();
            }
            let rssRequestHandler = RssRequestHandler.instance();
            let response = await rssRequestHandler.addURLToUserDb(this.accessToken, this.url, this.userName);
            RouteLogger.instance().debug("AddURLToUserDb:: successfully saved the document");
            return this._handleSuccess(response);

        } catch (error) {                               //eslint-disable-line
            RouteLogger.instance().debug("AddURLToUserDb:: failed to save the document Error: %s", error);
            throw this._handleBadRequest();
        }
    }
}
