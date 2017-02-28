import Route from "./Route";
import DeleteSourceHandler from "../../hashtags/DeleteSourceHandler";

export default class DeleteSourceRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.sources = this.request.body.sources;
    }

    async handle() {
        let deleteSourcesHandler = DeleteSourceHandler.instance();
        return await deleteSourcesHandler.deleteSources(this.sources, this.accessToken);
    }
}
