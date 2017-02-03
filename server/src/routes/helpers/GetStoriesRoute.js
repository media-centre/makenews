import Route from "./Route";
import { getStories } from "../../storyBoard/StoryRequestHandler";

export default class GetStoriesRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }
    
    async handle() {
        return await getStories(this.request.cookies.AuthSession);
    }
}
