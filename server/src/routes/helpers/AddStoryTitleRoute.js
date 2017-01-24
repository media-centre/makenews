import Route from "./Route";
import RouteLogger from "../RouteLogger";
import StringUtils from "../../../../common/src/util/StringUtil";
import StoryRequestHandler from "../../storyBoard/StoryRequestHandler";

export default class AddStoryTitleRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.title = this.request.body.title;
        this.accessToken = this.request.cookies.AuthSession;
    }

    inValid() {
        return StringUtils.isEmptyString(this.title) || StringUtils.isEmptyString(this.accessToken);
    }

    async handle() {
        try {
            if (this.inValid()) {
                RouteLogger.instance().warn("AddStoryDocument:: invalid Title %s.", this.title);
                return this._handleInvalidRequest({ "message": "missing parameters" });
            }
            let storyRequesthandler = StoryRequestHandler.instance();
            let response = await storyRequesthandler.addStory(this.title, this.accessToken);
            RouteLogger.instance().debug("AddStoryDocument:: successfully saved the document");
            return this._handleSuccess(response);
        } catch (error) {
            RouteLogger.instance().debug("AddStoryDocument:: failed to save the document Error: %j", error);
            throw this._handleInvalidRequest({ "message": error });
        }
    }
}
