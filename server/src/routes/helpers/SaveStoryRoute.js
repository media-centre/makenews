import Route from "./Route";
import { saveStory } from "../../storyBoard/StoryRequestHandler";

export default class SaveStoryRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.story = this.request.body.story;
        this.accessToken = this.request.cookies.AuthSession;
    }

    validate() {
        if(super.validate(this.story.title) && super.validate(this.story.body)) {
            return "Cannot save empty story";
        }
        return null;
    }

    async handle() {
        return await saveStory(this.story, this.accessToken);
    }
}
