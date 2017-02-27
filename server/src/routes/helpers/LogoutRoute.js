import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { userDetails } from "../../Factory";
import Route from "./Route";

export default class LogoutRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    async handle() {
        userDetails.removeUser(this.request.cookies.AuthSession);
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=;Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
    }
}
