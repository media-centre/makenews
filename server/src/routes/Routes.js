import authorizationRoutes from "./AuthorizationRoutes";
import rssReaderRoutes from "./RssRoutes";
import facebookReaderRoutes from "./FacebookRoutes";
import twitterReaderRoutes from "./TwitterRoutes";
import fetchAllFeedsRoutes from "../fetchAllFeeds/FetchFeedsFromAllSourcesRoutes";
import webURLsRoutes from "./WebURLsRoutes";
import fetchAllConfiguredFeedsRoute from "../fetchAllFeeds/FetchAllConfiguredFeedsRoute";

export default function(app) {
    authorizationRoutes(app);
    rssReaderRoutes(app);
    facebookReaderRoutes(app);
    twitterReaderRoutes(app);
    fetchAllFeedsRoutes(app);
    webURLsRoutes(app);
    fetchAllConfiguredFeedsRoute(app);
}
