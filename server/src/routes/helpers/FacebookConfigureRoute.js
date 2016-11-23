import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookConfigureRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.dbName = this.request.query.dbName;
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }
    }

    fetchProfiles() {
        if(StringUtil.isEmptyString(this.dbName) && StringUtil.isEmptyString(this.authSession)) {
            RouteLogger.instance().warn(`FacebookPostsRoute:: invalid facebook feed route with url ${this.url}`);
            this._handleInvalidRoute();
        } else {
            FacebookRequestHandler.instance("token").fetchConfiguredSourcesOf("profiles", this.dbName, this.authSession).then(profiles => {
                RouteLogger.instance().debug("FacebookConfigureRoute:: successfully fetched configured facebook profiles");
                this._handleSuccess({ "profiles": profiles });
            }).catch(error => {
                RouteLogger.instance().error(`FacebookConfigureRoute:: fetching configured facebook profiles failed. Error: ${error}`);
                this._handleBadRequest();
            });
        }
    }
}
