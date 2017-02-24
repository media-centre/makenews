import Route from "./Route";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";

export default class SearchFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.sourceType = this.request.query.sourceType;
        this.searchKey = this.request.query.searchKey;
        this.skip = super.validateNumber(this.request.query.offset);
    }

    validate() {
        return super.validate(this.sourceType, this.searchKey);
    }

    handle() {
        let feedsRequestHandler = FeedsRequestHandler.instance();
        return feedsRequestHandler.searchFeeds(this.sourceType, this.searchKey, this.skip);
    }
}
