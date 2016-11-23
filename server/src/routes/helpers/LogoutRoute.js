import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import Route from "./Route";

export default class LogoutRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    handle() {
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=;Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
    }
}
