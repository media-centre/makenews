import { getAuthSessionCookie, getUserDetails } from "../../../src/login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RouteLogger from "../RouteLogger";
import Route from "./Route";
import StringUtil from "../../../../common/src/util/StringUtil";
import { userDetails } from "../../Factory";
import { markAsVisitedUser } from "../../login/UserRequest";
import DeleteSourceHandler from "../../../src/hashtags/DeleteSourceHandler";

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

    handle() { //eslint-disable-line consistent-return
        try {
            if(!this.valid()) {
                return this._handleFailure({ "message": "unauthorized" });
            }
            RouteLogger.instance().info("LoginRoute::handle Login request received for the user = %s", this.request.body.username);

            getAuthSessionCookie(this.userName, this.password).then(async authSessionCookie => {
                const [authSession] = authSessionCookie.split(";");
                const [, token] = authSession.split("=");
                const userData = await getUserDetails(token, this.userName);
                await this._handleLoginSuccess(authSessionCookie, token, userData);
            }).catch(error => {
                RouteLogger.instance().error(`LoginRoute::handle Failed while fetching auth session cookie, Error: ${JSON.stringify(error)}`);
                this._handleFailure({ "message": "unauthorized" });
            });
        } catch(error) {
            RouteLogger.instance().error("LoginRoute::handle Unexpected error = %s", error);
            this._handleFailure({ "message": "unauthorized" });
        }
    }

    async _handleLoginSuccess(authSessionCookie, token, userData) {
        userDetails.updateUser(token, this.userName);
        let deleteSourceHandler = DeleteSourceHandler.instance(token);
        deleteSourceHandler.deleteHashTags();
        deleteSourceHandler.deleteOldFeeds();
        let responseData = { "userName": this.userName };
        if(!userData.visitedUser) {
            let visited = await markAsVisitedUser(token, this.userName);
            responseData.firstTimeUser = !visited;
        }
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", authSessionCookie)
            .json(responseData);

        RouteLogger.instance().info("LoginRoute::_handleLoginSuccess: Login request successful");
        RouteLogger.instance().debug("LoginRoute::_handleLoginSuccess: response = " + JSON.stringify({ "userName": this.userName }));
    }

    _handleFailure(error) {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED);
        this.response.json(error);
    }
}
