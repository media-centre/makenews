import RouteLogger from "./RouteLogger";
import DeleteHashtagRoute from "./helpers/DeleteHashtagRoute";

export default (app) => {
    app.get("/delete-hashtag-feeds", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /story request received");
        new DeleteHashtagRoute(request, response, next).process();
    });
};
