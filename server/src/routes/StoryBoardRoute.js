import RouteLogger from "./RouteLogger";
import AddStoryTitleRoute from "./helpers/AddStoryTitleRoute";
import GetStoryRoute from "./helpers/GetStoryRoute";

export default (app) => {
    app.post("/add-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /add-story request received. title = %s", request.title);
        new AddStoryTitleRoute(request, response, next).process();
    });

    app.get("/get-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /get-story request received");
        new GetStoryRoute(request, response, next).process();
    });
};
