/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookSetAccessTokenRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.body.accessToken;
        this.authSession = this.request.cookies.AuthSession;
    }
    
    async handle() { //eslint-disable-line consistent-return
        if (StringUtil.isEmptyString(this.accessToken)) {
            return this._handleInvalidRequest();
        }
        try {
            const facebookReqHandler = FacebookRequestHandler.instance(this.accessToken);
            const expiresAfter = await facebookReqHandler.setToken(this.authSession);
            RouteLogger.instance().debug("FacebookSetAccessTokenRoute:: successfully fetched facebook long lived token.");
            this._handleSuccess({ "expires_after": expiresAfter });
        } catch(error) {
            RouteLogger.instance().error(`FacebookSetAccessTokenRoute:: error fetching facebook long lived token. Error: ${JSON.stringify(error)}`);
            this._handleFailure(error);
        }
    }
}
