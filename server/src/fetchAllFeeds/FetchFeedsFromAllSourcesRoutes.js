import FetchFeedsFromAllSources from "./FetchFeedsFromAllSources";
import FetchFeedsFromHashTag from "./FetchFeedsFromHashtag";
import RouteLogger from "../routes/RouteLogger";

export default (app) => {
    app.post("/fetch-feeds", (request, response) => {
        RouteLogger.instance().info(`FetchFeedsFromAllSourcesRoutes:: /fetch-feeds request received. url = ${request.url}`);
        new FetchFeedsFromAllSources(request, response).fetchFeeds();
    });

    app.post("/fetch-hashtag", (request, response) => {
        RouteLogger.instance().info(`FetchFeedsFromTwitterHashTags:: /fetch-feeds request received. url = ${request.url}`);
        new FetchFeedsFromHashTag(request, response).process();
    });
};
