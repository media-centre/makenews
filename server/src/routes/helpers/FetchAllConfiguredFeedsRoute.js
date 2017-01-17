import Route from "./Route";
import RouteLogger from "../RouteLogger";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";
import { newsBoardSourceTypes } from "./../../util/Constants";
import StringUtil from "../../../../common/src/util/StringUtil";

export default class FetchAllConfiguredFeeds extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.offset = this.validateNumber(this.request.query.offset);
        this.sourceType = this.request.query.sourceType;
    }

    valid() {
        return !StringUtil.isEmptyString(this.sourceType) && newsBoardSourceTypes[this.sourceType];
    }

    async fetchFeeds() {
        try {
            let feedsRequestHandler = FeedsRequestHandler.instance();
            if(this.valid()) {
                let feeds = await feedsRequestHandler.fetchFeeds(this.authSession, this.offset, newsBoardSourceTypes[this.sourceType]);
                RouteLogger.instance().debug("FeedsRequestHandler:: successfully fetched the feeds");
                this._handleSuccess(feeds);
            } else {
                this._handleInvalidRequest({ "message": "invalid sourceType" });
            }
        } catch (error) {
            RouteLogger.instance().debug(`FeedsRequestHandler:: failed to fetch the feeds . Error: ${JSON.stringify(error)}`);
            this._handleBadRequest();
        }
    }
}
