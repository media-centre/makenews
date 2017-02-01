import Route from "./Route";
import { getStory, getStories } from "../../storyBoard/StoryRequestHandler";

export default class GetStoryRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.id = this.request.query.id;
        this.accessToken = this.request.cookies.AuthSession;
    }

    async handle() {
        if(this.id) {
            return await getStory(this.id, this.accessToken);
        }
        return await getStories(this.accessToken);
    }
}
