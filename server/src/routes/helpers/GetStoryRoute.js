import Route from "./Route";
import StoryRequestHandler from "../../storyBoard/StoryRequestHandler";

export default class GetStoryRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.id = this.request.query.id;
        this.accessToken = this.request.cookies.AuthSession;
    }

    async handle() {
        let storyRequestHandler = StoryRequestHandler.instance();
        return await storyRequestHandler.getStory(this.id, this.accessToken);
    }
}
