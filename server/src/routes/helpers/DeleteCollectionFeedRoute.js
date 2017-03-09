import Route from "./Route";
import { deleteFeedFromCollection } from "../../collection/CollectionFeedsRequestHandler";

export default class DeleteCollectionFeedRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies. AuthSession;
        this.feedId = this.request.query.feedId;
        this.collectionId = this.request.query.collectionId;
    }

    validate() {
        return super.validate(this.authSession, this.feedId, this.collectionId);
    }

    async handle() {
        return await deleteFeedFromCollection(this.authSession, this.feedId, this.collectionId);
    }
}
