import Route from "./Route";
import { getCollectedFeeds } from "./../../collection/CollectionFeedsRequestHandler";

export default class CollectionFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.collectionName = this.request.query.collectionName;
        this.offset = this.validateNumber(this.request.query.offset);
    }

    validate() {
        return super.validate(this.authSession, this.collectionName);
    }

    async handle() {
        return await getCollectedFeeds(this.authSession, this.collectionName, this.offset);
    }
}
