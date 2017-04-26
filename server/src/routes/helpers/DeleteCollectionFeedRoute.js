import Route from "./Route";
import { deleteFeedFromCollection } from "../../collection/CollectionFeedsRequestHandler";

export default class DeleteCollectionFeedRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies. AuthSession;
        this.intermediateDocId = this.request.query.intermediateDocId;
    }

    validate() {
        return super.validate(this.intermediateDocId);
    }

    async handle() {
        return await deleteFeedFromCollection(this.authSession, this.intermediateDocId);
    }
}
