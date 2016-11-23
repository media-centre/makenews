import UserRequest from "../../../src/login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ClientConfig from "../../../src/config/ClientConfig";
import RouteLogger from "../RouteLogger";
import Route from "./Route";
import StringUtil from "../../../../common/src/util/StringUtil";

export default class LoginRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.username;
        this.password = this.request.body.password;
    }

    valid() {
        if(StringUtil.isEmptyString(this.userName) || StringUtil.isEmptyString(this.password)) {
            return false;
        }
        return true;
    }

    handle() {  //eslint-disable-line consistent-return
        try {
            if(!this.valid()) {
                return this._handleFailure({ "message": "unauthorized" });
            }
            RouteLogger.instance().info("LoginRoute::handle Login request received for the user = %s", this.request.body.username);

            let userRequest = UserRequest.instance(this.userName, this.password);
            userRequest.getAuthSessionCookie().then(authSessionCookie => {
                this._handleLoginSuccess(authSessionCookie);
            }).catch(error => { //eslint-disable-line
                RouteLogger.instance().error("LoginRoute::handle Failed while fetching auth session cookie");
                this._handleFailure({ "message": "unauthorized" });
            });
        } catch(error) {
            RouteLogger.instance().error("LoginRoute::handle Unexpected error = %s", error);
            this._handleFailure({ "message": "unauthorized" });
        }
    }

    _handleLoginSuccess(authSessionCookie) {
        let dbJson = ClientConfig.instance().db();
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", authSessionCookie)
            .json({ "userName": this.userName, "dbParameters": dbJson });

        RouteLogger.instance().info("LoginRoute::_handleLoginSuccess: Login request successful");
        RouteLogger.instance().debug("LoginRoute::_handleLoginSuccess: response = " + JSON.stringify({ "userName": this.userName, "dbParameters": dbJson }));
    }

    _handleFailure(error) {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED);
        this.response.json(error);
    }
}
