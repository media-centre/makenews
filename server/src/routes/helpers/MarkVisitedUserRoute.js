import Route from "./Route";
import { markAsVisitedUser } from "./../../login/UserRequest";

export default class MarkVisitedUserRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.username = this.request.body.username;
        this.accessToken = this.request.cookies.AuthSession;
    }

    validate() {
        return super.validate(this.username);
    }

    async handle() {
        return await markAsVisitedUser(this.accessToken, this.username);
    }
}
