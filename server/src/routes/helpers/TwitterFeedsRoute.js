/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class TwitterFeedsRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
        this.userName = this.request.query.userName;
    }

    valid() {
        if(StringUtil.isEmptyString(this.url) || StringUtil.isEmptyString(this.userName)) {
            return false;
        }
        return true;
    }

    handle() {          //eslint-disable-line consistent-return
        if(!this.valid()) {
            RouteLogger.instance().warn("TwitterFeedsRoute:: invalid twitter feed route with url %s and user name %s.", this.url, this.userName);
            return this._handleInvalidRoute();
        }
        let twitterRequestHandler = TwitterRequestHandler.instance();
        twitterRequestHandler.fetchTweetsRequest(this.url, this.userName).then(feeds => {
            RouteLogger.instance().debug("TwitterFeedsRoute:: successfully fetched twitter feeds for url %s.", this.url);
            this._handleSuccess(feeds);
        }).catch(error => { //eslint-disable-line
            RouteLogger.instance().debug("TwitterFeedsRoute:: fetching twitter feeds failed for url %s. Error: %s", this.url, error);
            this._handleBadRequest();
        });
    }
}

