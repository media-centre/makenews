import Route from "./Route";
import RouteLogger from "../RouteLogger";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";
export default class FetchAllConfiguredFeeds extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.lastIndex = this.request.body.lastIndex;
        this.sourceType = this.request.body.sourceType;
    }

    index() {
        let ZERO = 0;
        if(!Number.isInteger(this.lastIndex) || this.lastIndex < ZERO) {
            return ZERO;
        }
        return this.lastIndex;
    }

    async fetchFeeds() { //eslint-disable-line consistent-return
        try {
            let feedsRequestHandler = FeedsRequestHandler.instance();
            let feeds = await feedsRequestHandler.fetchFeeds(this.authSession, this.index(), this.sourceType);
            RouteLogger.instance().debug("FeedsRequestHandler:: successfully fetched the feeds");
            return this._handleSuccess(feeds);

        } catch (error) {
            RouteLogger.instance().debug("FeedsRequestHandler:: failed to fetch the feeds . Error: %s", error);
            this._handleBadRequest();
        }
    }
}
