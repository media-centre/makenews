import RouteLogger from "./RouteLogger";
import DeleteSourceRoute from "./helpers/DeleteSourceRoute";

export default (app) => {
    app.post("/delete-sources", (request, response, next) => {
        RouteLogger.instance().info("DeleteRoute:: /delete story request received");
        new DeleteSourceRoute(request, response, next).process();
    });
};
