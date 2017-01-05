/* eslint consistent-this:0*/
import moment from "moment";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookPostsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.webUrl = this.request.query.webUrl;
        this.since = this.request.query.since;
        this.userName = this.request.query.userName;
        this.options = {};
        if(this.since) {
            this.options.since = moment(this.since).toISOString();
        }
    }

    valid() {
        if(StringUtil.isEmptyString(this.webUrl) || StringUtil.isEmptyString(this.userName) || (this.since && !moment(this.since).isValid())) {
            RouteLogger.instance().warn("FacebookPostsRoute:: invalid facebook feed route with url %s and user name %s.", this.url, this.userName);
            return false;
        }
        return true;
    }

    handle() {
        if (this.valid()) {
            FacebookAccessToken.instance().getAccessToken(this.userName).then((token) => {
                FacebookRequestHandler.instance(token).fetchFeeds(this.webUrl, "posts", this.options).then(feeds => {
                    RouteLogger.instance().debug("FacebookPostsRoute:: successfully fetched facebook feeds for url %s.", this.webUrl);
                    this._handleSuccess({ "posts": feeds });
                }).catch(error => { //eslint-disable-line
                    RouteLogger.instance().error("FacebookPostsRoute:: fetching facebook feeds failed for url %s failed. Error: %s", this.url, error);
                    this._handleBadRequest();
                });
            }).catch(error => { //eslint-disable-line
                RouteLogger.instance().error("FacebookPostsRoute:: fetching facebook feeds failed for url %s failed. Error: %s", this.url, error);
                this._handleBadRequest();
            });
        } else {
            this._handleInvalidRequest({ "message": "invalid parameters" });
        }
    }
}
