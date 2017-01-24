import authorizationRoutes from "./AuthorizationRoutes";
import rssReaderRoutes from "./RssRoutes";
import facebookReaderRoutes from "./FacebookRoutes";
import twitterReaderRoutes from "./TwitterRoutes";
import fetchAllFeedsRoutes from "../fetchAllFeeds/FetchFeedsFromAllSourcesRoutes";
import configurationRoutes from "./ConfigurationRoutes";
import newsBoardRoutes from "./NewsBoardRoutes";
import storyBoardRoute from "./storyBoardRoute";

export default function(app) {
    authorizationRoutes(app);
    configurationRoutes(app);
    rssReaderRoutes(app);
    facebookReaderRoutes(app);
    twitterReaderRoutes(app);
    fetchAllFeedsRoutes(app);
    newsBoardRoutes(app);
    storyBoardRoute(app);
}
