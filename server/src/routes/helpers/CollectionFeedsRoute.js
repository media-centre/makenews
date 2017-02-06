import Route from "./Route";
import { getCollectedFeeds } from "./../../collection/CollectionFeedsRequestHandler";

export default class CollectionFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.collection = this.request.query.collection;
        this.offset = this.validateNumber(this.request.query.offset);
    }

    validate() {
        return super.validate(this.authSession, this.collection);
    }

    async handle() {
        return await getCollectedFeeds(this.authSession, this.collection, this.offset);
    }
}
