/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import CryptUtil from "../../util/CryptUtil";

export default class UserDbNameRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.params.userName;
    }

    valid() {
        return !StringUtil.isEmptyString(this.userName);
    }

    handle() {          //eslint-disable-line consistent-return
        if(!this.valid()) {
            RouteLogger.instance().warn("UserDbNameRoute:: invalid user name %s.", this.userName);
            return this._handleInvalidRoute();
        }
        this._handleSuccess({ "dbName": CryptUtil.dbNameHash(this.userName) });
        RouteLogger.instance().debug("UserDbNameRoute:: db name for the user %s.", this.userName);

    }

    _handleLoginFailure() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED);
        this.response.json({ "message": "Incorrect user credentials" });
    }
}
