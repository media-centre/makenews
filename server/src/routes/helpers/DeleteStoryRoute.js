import Route from "./Route";
import { deleteStory } from "../../storyBoard/StoryRequestHandler";

export default class DeleteStoryRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.id = this.request.body.id;
    }

    validate() {
        return super.validate(this.id);
    }

    async handle() {
        return await deleteStory(this.id, this.accessToken);
    }
}
