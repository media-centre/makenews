/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import UserRequest from "../../login/UserRequest";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

export default class ChangePasswordRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.userName;
        this.currentPassword = this.request.body.currentPassword;
        this.newPassword = this.request.body.newPassword;
    }

    valid() {
        if(StringUtil.isEmptyString(this.userName) || StringUtil.isEmptyString(this.currentPassword) || StringUtil.isEmptyString(this.newPassword)) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            RouteLogger.instance().warn("ChangePasswordRoute:: invalid user name %s.", this.userName);
            return this._handleInvalidRoute();
        }
        UserRequest.instance(this.userName, this.currentPassword).updatePassword(this.newPassword).then(response => { //eslint-disable-line
            RouteLogger.instance().debug("ChangePasswordRoute:: password updated succesfully for user %s.", this.userName);
            this._handleSuccess({ "message": "Password updation successful" });
        }).catch(error => {
            RouteLogger.instance().debug("ChangePasswordRoute:: password updation failed for user %s with error %s", this.userName, error);
            if(error === "login failed") {
                this._handleLoginFailure();
            } else {
                this._handleFailure({ "message": "Password updation failed" });
            }
        });

    }

    _handleLoginFailure() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED);
        this.response.json({ "message": "Incorrect user credentials" });
    }
}
