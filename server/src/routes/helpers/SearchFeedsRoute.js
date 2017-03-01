import Route from "./Route";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";

export default class SearchFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.sourceType = this.request.query.sourceType;
        this.searchKey = this.request.query.searchKey;
        this.skip = super.validateNumber(this.request.query.offset);
    }

    validate() {
        return super.validate(this.authSession, this.sourceType, this.searchKey);
    }

    handle() {
        const feedsRequestHandler = FeedsRequestHandler.instance();
        return feedsRequestHandler.searchFeeds(this.authSession, this.sourceType, this.searchKey, this.skip);
    }
}
