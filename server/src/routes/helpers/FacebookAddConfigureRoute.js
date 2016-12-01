import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import R from "ramda"; //eslint-disable-line id-length

export default class FacebookAddConfigureRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.dbName = this.request.body.dbName;
        this.source = this.request.body.source;
        if(this.request.cookies) {
            this.authSession = this.request.cookies.AuthSession;
        }
    }

    _checkRequiredParams(params) {
        if(R.any(StringUtil.isEmptyString)(params)) {
            RouteLogger.instance().warn("FacebookAddConfigureRoute:: invalid facebook feed route with url %s and user name %s.", this.url, this.userName);
            this._handleInvalidRoute();
        }
    }

    async addConfiguredSource(sourceType) {
        this._checkRequiredParams([this.dbName, this.authSession, this.source.name, this.source.url]);
        try {
            let status = await FacebookRequestHandler.instance("token").addConfiguredSource(sourceType, this.source, this.dbName, this.authSession);
            RouteLogger.instance().debug("FacebookAddConfigureRoute:: successfully added configured source to db");
            this._handleSuccess(status);
        } catch(error) {
            RouteLogger.instance().error(`FacebookAddConfigureRoute:: Error adding configured source. Error: ${error}`);
            this._handleBadRequest();
        }
    }
}
