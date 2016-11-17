/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookPostsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.query.userName;
        this.options = {};
    }
    
    handle() {
        if(StringUtil.isEmptyString(this.userName)) {
            RouteLogger.instance().warn("FacebookPostsRoute:: invalid facebook feed route with url %s and user name %s.", this.url, this.userName);
            this._handleInvalidRoute();
        } else {
            FacebookAccessToken.instance().getAccessToken(this.userName).then((token) => {
                FacebookRequestHandler.instance(token).fetchProfiles().then(profiles => {
                    RouteLogger.instance().debug(`FacebookPostsRoute:: successfully fetched facebook profiles for ${this.userName}`);
                    this._handleSuccess({ "profiles": profiles });
                }).catch(error => {
                    RouteLogger.instance().error(`FacebookPostsRoute:: fetching facebook profiles failed for user: ${this.userName}. Error: ${error}`);
                    this._handleBadRequest();
                });
            }).catch(error => {
                RouteLogger.instance().error(`FacebookPostsRoute:: fetching facebook profiles failed for user: ${this.userName}. Error: ${error}`);
                this._handleBadRequest();
            });
        }
    }
}
