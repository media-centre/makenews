import Route from "./Route";
import { getStory } from "../../storyBoard/StoryRequestHandler";

export default class GetStoryRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.id = this.request.query.id;
        this.accessToken = this.request.cookies.AuthSession;
    }

    validate() {
        return super.validate(this.id);
    }
    
    async handle() {
        return await getStory(this.id, this.accessToken);
    }
}
