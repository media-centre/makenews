import Route from "./Route";
import { markAsVisitedUser } from "./../../login/UserRequest";
import { userDetails } from "./../../Factory";

export default class MarkVisitedUserRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
    }

    async handle() {
        const username = userDetails.getUser(this.accessToken).userName;
        return await markAsVisitedUser(this.accessToken, username);
    }
}
