import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { userDetails } from "../../Factory";
import Route from "./Route";
import DeleteHashtagsHandler from "../../hashtags/DeleteHashtagsHandler";

export default class LogoutRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    async handle() {
        let deleteHashtagHandler = DeleteHashtagsHandler.instance();
        await deleteHashtagHandler.deleteHashtags(this.request.cookies.AuthSession);
        userDetails.removeUser(this.request.cookies.AuthSession);
        this.response.status(HttpResponseHandler.codes.OK)
            .append("Set-Cookie", "AuthSession=;Version=1; Path=/; HttpOnly")
            .json({ "message": "logout successful" });
    }
}
