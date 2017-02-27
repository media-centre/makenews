import Route from "./Route";
import DeleteHashtagHandler from "../../hashtags/DeleteHashtagsHandler";

export default class DeleteHashtagRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
    }

    async handle() {
        let deleteHashtagHandler = DeleteHashtagHandler.instance();
        await deleteHashtagHandler.deleteHashtags(this.accessToken);
    }
}
