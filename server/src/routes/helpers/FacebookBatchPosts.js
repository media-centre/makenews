/* eslint consistent-this:0*/
import moment from "moment";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookBatchPosts extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.userName;
    }

    valid() {
        return !(StringUtil.isEmptyString(this.userName) || !this.isValidRequestData());

    }

    handle() {  //eslint-disable-line consistent-return
        if(!this.valid()) {
            RouteLogger.instance().warn("FacebookBatchPosts:: invalid facebook feed batch request for user %s.", this.userName);
            return this._handleInvalidRequest({ "message": "missing parameters" });
        }

        FacebookAccessToken.instance().getAccessToken(this.userName).then((accessToken) => {
            this._fetchPagePosts(accessToken);
        }).catch(error => {
            this._handleFailure(error);
        });
    }

    _fetchPagePosts(accessToken) {
        let allFeeds = {};
        let counter = 0;
        let facebookRequestHandler = FacebookRequestHandler.instance(accessToken);

        this.request.body.data.forEach((item)=> {
            let options = {};

            if (item.timestamp) {
                options.since = moment(item.timestamp).toISOString();
            }
            facebookRequestHandler.fetchFeeds(item.url, "posts", options).then(feeds => {
                allFeeds[item.id] = feeds;
                counter += 1;  //eslint-disable-line no-magic-numbers
                if (this.request.body.data.length === counter) {
                    RouteLogger.instance().debug("FacebookBatchPosts:: successfully fetched facebook feeds for url %s.", item.url);
                    this._handleSuccess({ "posts": allFeeds });
                }
            }).catch(() => {
                counter += 1;  // eslint-disable-line no-magic-numbers
                allFeeds[item.id] = "failed";
                if (this.request.body.data.length === counter) {
                    RouteLogger.instance().debug("FacebookBatchPosts:: fetching facebook feeds for url %s returned no feeds.", item.url);
                    this._handleSuccess({ "posts": allFeeds });
                }
            });
        });
    }
}
