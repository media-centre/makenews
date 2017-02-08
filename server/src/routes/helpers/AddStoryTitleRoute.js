import Route from "./Route";
import { addStory } from "../../storyBoard/StoryRequestHandler";

export default class AddStoryTitleRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.story = this.request.body.title;
        this.accessToken = this.request.cookies.AuthSession;
    }

    validate() {
        if(super.validate(this.story.title) && super.validate(this.story.body)) {
            return "";
        }
        return "cannot save empty story";
    }

    async handle() {
        return await addStory(this.story, this.accessToken);
    }
}
