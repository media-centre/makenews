import RouteLogger from "./RouteLogger";
import AddStoryTitleRoute from "./helpers/AddStoryTitleRoute";

export default (app) => {
    app.post("/add-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /add-story request received. title = %s", request.title);
        new AddStoryTitleRoute(request, response, next).handle();
    });
};
