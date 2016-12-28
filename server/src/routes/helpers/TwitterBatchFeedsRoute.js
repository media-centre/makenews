/* eslint consistent-this:0*/
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtil from "../../../../common/src/util/StringUtil";


export default class TwitterBatchFeedsRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.userName;
    }
    valid() {
        if(!this.isValidRequestData() || StringUtil.isEmptyString(this.userName)) {
            return false;
        }
        return true;
    }
    handle() {       //eslint-disable-line consistent-return
        if(!this.valid()) {
            RouteLogger.instance().warn("TwitterBatchFeedsRoute:: invalid twitter feed batch request for user %s.", this.userName);
            return this._handleInvalidRequest({ "message": "missing parameters" });
        }

        let allFeeds = {};
        let counter = 0;
        let twitterRequestHandler = TwitterRequestHandler.instance();

        this.request.body.data.forEach((item)=> {
            twitterRequestHandler.fetchTweetsRequest(item.url, this.userName, item.timestamp).then(feeds => {
                allFeeds[item.id] = feeds;
                if (this.request.body.data.length - 1 === counter) { //eslint-disable-line no-magic-numbers
                    RouteLogger.instance().debug("TwitterFeedsRoute:: successfully fetched twitter feeds for url %s.", item.url);
                    this._handleSuccess(allFeeds);
                }
                counter += 1; //eslint-disable-line no-magic-numbers
            }).catch(() => {
                RouteLogger.instance().debug("TwitterFeedsRoute:: fetching twitter feeds for url %s returned no feeds.", item.url);
                allFeeds[item.id] = "failed";
                if (this.request.body.data.length - 1 === counter) { //eslint-disable-line no-magic-numbers
                    this._handleSuccess(allFeeds);
                }
                counter += 1; //eslint-disable-line no-magic-numbers
            });
        });
    }
}
