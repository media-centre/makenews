/* eslint consistent-this:0*/
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import { fbSourceTypesToFetch } from "../../util/Constants";
import R from "ramda";  //eslint-disable-line id-length

export default class FacebookSourceRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.userName;
        this.keyword = this.request.body.keyword;
        this.type = this.request.body.type;
        this.paging = this.request.body.paging;
        this.options = {};
    }

    async searchSources() {
        if(this.checkInvalidParameters(this.userName, this.type, this.keyword) ||
            R.not(fbSourceTypesToFetch[this.type])) {
            RouteLogger.instance().warn(`FacebookSourceRoute:: invalid facebook search route with user name ${this.userName}, type ${this.type} and keyword ${this.keyword}.`);
            this._handleInvalidRequest({ "message": "missing parameters" });
        } else {
            await this._getSources();
        }
    }

    async _getSources() {
        let params = {
            "q": this.keyword,
            "type": fbSourceTypesToFetch[this.type]
        };
        try {
            let token = await FacebookAccessToken.instance().getAccessToken(this.userName);
            let data = await FacebookRequestHandler.instance(token).fetchSourceUrls(params, this.paging);
            RouteLogger.instance().debug(`FacebookPostsRoute:: ${this.type} :: successfully fetched data for ${this.userName}`);
            this._handleSuccess(data);
        } catch(err) {
            RouteLogger.instance().error(`FacebookPostsRoute:: ${this.type} :: fetching data failed for user: ${this.userName}. Error: ${err}`);
            this._handleBadRequest();
        }
    }
}
