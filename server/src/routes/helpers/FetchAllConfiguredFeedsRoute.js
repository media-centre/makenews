import Route from "./Route";
import RouteLogger from "../RouteLogger";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";
export default class FetchAllConfiguredFeeds extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.offset = this.request.body.offset;
        this.sourceType = this.request.body.sourceType;
    }

    async fetchFeeds() {
        try {
            let feedsRequestHandler = FeedsRequestHandler.instance();
            let feeds = await feedsRequestHandler.fetchFeeds(this.authSession, this.validateNumber(this.offset), this.sourceType);
            RouteLogger.instance().debug("FeedsRequestHandler:: successfully fetched the feeds");
            this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug(`FeedsRequestHandler:: failed to fetch the feeds . Error: ${JSON.stringify(error)}`);
            this._handleBadRequest();
        }
    }
}
