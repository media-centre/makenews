import FetchAllConfiguredFeeds from "./helpers/FetchAllConfiguredFeedsRoute";
import BookmarkRoute from "./helpers/BookmarkRoute";
import BookmarkedFeedsRoute from "./helpers/BookmarkedFeedsRoute";
import CollectionRoute from "./helpers/CollectionRoute";
import RouteLogger from "./RouteLogger";
import FetchArticleFromUrl from "./helpers/FetchArticleFromUrl";
import CollectionFeedsRoute from "./helpers/CollectionFeedsRoute";
import SearchFeedsRoute from "./helpers/SearchFeedsRoute";
import DeleteCollectionRoute from "./helpers/DeleteCollectionRoute";
import DeleteCollectionFeedRoute from "./helpers/DeleteCollectionFeedRoute";
import DeleteCollectionRoute from "./helpers/DeleteCollectionRoute";

export default (app) => {
    app.get("/feeds", (request, response) => {
        RouteLogger.instance().info("fetchAllConfiguredFeedsRoute:: /feeds-from-all-sources request received. url = %s", request.url);
        new FetchAllConfiguredFeeds(request, response).fetchFeeds();
    });

    app.get("/article", (request, response) => {
        RouteLogger.instance().info(`FetchArticleFromUrlRoute:: received url = ${request.url}`);
        new FetchArticleFromUrl(request, response).process();
    });

    app.post("/bookmarks", (request, response) => {
        RouteLogger.instance().info("bookmarkRoute:: POST /bookmark request received. url = %s", request.url);
        new BookmarkRoute(request, response).bookmarkFeed();
    });

    app.get("/bookmarks", (request, response) => {
        RouteLogger.instance().info("bookmarkedFeedsRoute:: GET /bookmarks request received. url = %s", request.url);
        new BookmarkedFeedsRoute(request, response).getFeeds();
    });

    app.put("/collection", (request, response) => {
        RouteLogger.instance().info("collectionRoute:: PUT /collection request received. url = %s", request.url);
        new CollectionRoute(request, response).addToCollection();
    });

    app.get("/collections", (request, response) => {
        RouteLogger.instance().info("collectionRoute:: GET /collection request received. url = %s", request.url);
        new CollectionRoute(request, response).getAllCollections();
    });

    app.delete("/collection", (request, response) => {
        RouteLogger.instance().info("collectionRoute:: DELETE /collection request received. url = %s", request.url);
        new DeleteCollectionRoute(request, response).process();
    });

    app.get("/collection-feeds", (request, response) => {
        RouteLogger.instance().info("collectionFeedsRoute:: GET /collection-feeds request received url = %s", request.url);
        new CollectionFeedsRoute(request, response).process();
    });

    app.delete("/collection-feed", (request, response) => {
        RouteLogger.instance().info("DeleteCollectionFeedRoute:: DELETE /collection-feed request received url = %s", request.url);
        new DeleteCollectionFeedRoute(request, response).process();
    });

    app.get("/search-feeds", (request, response) => {
        RouteLogger.instance().info("searchFeedsRoute:: GET /search-feeds request received url = %s", request.url);
        new SearchFeedsRoute(request, response).process();
    });
};
