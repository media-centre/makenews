import RouteLogger from "./RouteLogger";
import SaveStoryRoute from "./helpers/SaveStoryRoute";
import GetStoryRoute from "./helpers/GetStoryRoute";
import GetStoriesRoute from "./helpers/GetStoriesRoute";
import DeleteStoryRoute from "./helpers/DeleteStoryRoute";

export default (app) => {
    app.put("/save-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /save-story request received. title = %s", request.title);
        new SaveStoryRoute(request, response, next).process();
    });

    app.get("/story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /story request received");
        new GetStoryRoute(request, response, next).process();
    });

    app.get("/stories", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /stories request received");
        new GetStoriesRoute(request, response, next).process();
    });

    app.post("/delete-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /delete-story request received");
        new DeleteStoryRoute(request, response, next).process();
    });
};
