import Route from "./Route";
import RouteLogger from "../RouteLogger";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";
export default class FetchAllConfiguredFeeds extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
    }

    async fetchFeeds() { //eslint-disable-line consistent-return
        try {
            let feedsRequestHandler = FeedsRequestHandler.instance();
            let feeds = await feedsRequestHandler.fetchFeeds(this.authSession);
            RouteLogger.instance().debug("FeedsRequestHandler:: successfully fetched the feeds");
            return this._handleSuccess(feeds);

        } catch (error) {
            RouteLogger.instance().debug("FeedsRequestHandler:: failed to fetch the feeds . Error: %s", error);
            this._handleBadRequest();
        }
    }
}
