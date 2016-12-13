import authorizationRoutes from "./AuthorizationRoutes";
import rssReaderRoutes from "./RssRoutes";
import facebookReaderRoutes from "./FacebookRoutes";
import twitterReaderRoutes from "./TwitterRoutes";
import fetchAllFeedsRoutes from "../fetchAllFeeds/FetchFeedsFromAllSourcesRoutes";
import fetchAllConfiguredFeedsRoute from "./FetchFeedsRoutes";
import configurationRoutes from "./ConfigurationRoutes";
import fetchAllConfiguredFeedsRoute from "./FetchFeedsRoutes";

export default function(app) {
    authorizationRoutes(app);
    configurationRoutes(app);
    rssReaderRoutes(app);
    facebookReaderRoutes(app);
    twitterReaderRoutes(app);
    fetchAllFeedsRoutes(app);
    fetchAllConfiguredFeedsRoute(app);
}
