import Route from "./Route";
import RouteLogger from "../RouteLogger";
import { updatePassword } from "../../login/UserRequest";
import { userDetails } from "./../../Factory";

export default class ChangePasswordRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.currentPassword = this.request.body.currentPassword;
        this.newPassword = this.request.body.newPassword;
    }

    validate() {
        return super.validate(this.currentPassword, this.newPassword);
    }

    async handle() {
        try {
            const username = userDetails.getUser(this.accessToken).userName;
            await updatePassword(username, this.newPassword, this.currentPassword);
            RouteLogger.instance().debug("ChangePasswordRoute:: password updated succesfully for user %s.", this.userName);
            this._handleSuccess({ "message": "Password updation successful" });
        } catch(error) {
            RouteLogger.instance().debug("ChangePasswordRoute:: password updation failed for user %s with error %s", this.userName, error);
            if(error === "login failed") {
                this._handleLoginFailure();
            } else {
                this._handleFailure({ "message": "Password updation failed" });
            }
        }
    }
}
