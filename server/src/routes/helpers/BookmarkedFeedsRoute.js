import Route from "./Route";
import RouteLogger from "../RouteLogger";
import { getBookmarkedFeeds } from "./../../bookmark/BookmarkRequestHandler";

export default class BookmarkedFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.offset = this.validateNumber(this.request.query.offset);
    }

    async getFeeds() {
        try {
            let response = await getBookmarkedFeeds(this.authSession, this.offset);
            RouteLogger.instance().debug("BookmarkedFeedsRoute:: successfully fetched the feeds");
            this._handleSuccess(response);
        } catch(error) {
            RouteLogger.instance().debug(`BookmarkedFeedsRoute:: Error while getting the bookmarked feeds. Error  ${error}`);
            this._handleBadRequest();
        }
    }
}
