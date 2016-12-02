/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import R from "ramda";  //eslint-disable-line id-length

export default class FacebookSourceRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.query.userName;
        this.keyword = this.request.query.keyword;
        this.options = {};
    }
    
    fetchProfiles() {
        this._checkRequiredParams([this.userName]);
        this._getFBDataUsingFuncName("fetchProfiles");
    }
    
    fetchPages() {
        this._checkRequiredParams([this.userName, this.keyword]);
        this._getFBDataUsingFuncName("fetchSourceUrls", [this.keyword, "page"]);
    }

    fetchGroups() {
        this._checkRequiredParams([this.userName, this.keyword]);
        this._getFBDataUsingFuncName("fetchSourceUrls", [this.keyword, "group"]);
    }
    
    _checkRequiredParams(params) {
        if(R.any(StringUtil.isEmptyString)(params)) {
            RouteLogger.instance().warn("FacebookPostsRoute:: invalid facebook feed route with url %s and user name %s.", this.url, this.userName);
            this._handleInvalidRoute();
        }
    }

    async _getFBDataUsingFuncName(funcName, args = []) {
        try {
            let token = await FacebookAccessToken.instance().getAccessToken(this.userName);
            let data = await FacebookRequestHandler.instance(token)[funcName](...args);
            RouteLogger.instance().debug(`FacebookPostsRoute:: ${funcName} :: successfully fetched data for ${this.userName}`);
            this._handleSuccess(data);
        } catch(err) {
            RouteLogger.instance().error(`FacebookPostsRoute:: ${funcName} :: fetching data failed for user: ${this.userName}. Error: ${err}`);
            this._handleBadRequest();
        }
    }
}
