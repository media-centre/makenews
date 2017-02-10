import RouteLogger from "./RouteLogger";
import SaveStoryRoute from "./helpers/SaveStoryRoute";
import GetStoryRoute from "./helpers/GetStoryRoute";
import GetStoriesRoute from "./helpers/GetStoriesRoute";

export default (app) => {
    app.put("/save-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /add-story request received. title = %s", request.title);
        new SaveStoryRoute(request, response, next).process();
    });

    app.get("/story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /story request received");
        new GetStoryRoute(request, response, next).process();
    });

    app.get("/stories", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /story request received");
        new GetStoriesRoute(request, response, next).process();
    });
};
