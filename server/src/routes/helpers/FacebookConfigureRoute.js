import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import R from "ramda"; //eslint-disable-line id-length

export default class FacebookConfigureRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.dbName = this.request.query.dbName;
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }
    }

    _checkRequiredParams(params) {
        if(R.any(StringUtil.isEmptyString)(params)) {
            RouteLogger.instance().warn("FacebookConfigureRoute:: invalid facebook feed route with url %s and user name %s.", this.url, this.userName);
            this._handleInvalidRoute();
        }
    }

    fetchProfiles() {
        this._checkRequiredParams([this.dbName, this.authSession]);
        FacebookRequestHandler.instance("token").fetchConfiguredSourcesOf("profiles", this.dbName, this.authSession).then(profiles => {
            RouteLogger.instance().debug("FacebookConfigureRoute:: successfully fetched configured facebook profiles");
            this._handleSuccess({ "profiles": profiles });
        }).catch(error => {
            RouteLogger.instance().error(`FacebookConfigureRoute:: fetching configured facebook profiles failed. Error: ${error}`);
            this._handleBadRequest();
        });
    }
}
