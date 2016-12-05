/* eslint consistent-this:0*/
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import { fbSourceTypes } from "../../util/Constants";
import R from "ramda";  //eslint-disable-line id-length

export default class FacebookSourceRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.query.userName;
        this.keyword = this.request.query.keyword;
        this.type = this.request.query.type;
        this.options = {};
    }

    async searchSources() {
        if(this.checkInvalidParameters(this.userName, this.type, this.keyword) ||
            R.not(fbSourceTypes[this.type])) {
            RouteLogger.instance().warn(`FacebookSourceRoute:: invalid facebook search route with user name ${this.userName}, type ${this.type} and keyword ${this.keyword}.`);
            this._handleInvalidRoute();
        }
        await this._getSources(this.keyword, fbSourceTypes[this.type]);
    }

    async _getSources(keyword, type) {
        try {
            let token = await FacebookAccessToken.instance().getAccessToken(this.userName);
            let data = await FacebookRequestHandler.instance(token).fetchSourceUrls(keyword, type);
            RouteLogger.instance().debug(`FacebookPostsRoute:: ${type} :: successfully fetched data for ${this.userName}`);
            this._handleSuccess(data);
        } catch(err) {
            RouteLogger.instance().error(`FacebookPostsRoute:: ${type} :: fetching data failed for user: ${this.userName}. Error: ${err}`);
            this._handleBadRequest();
        }
    }
}
