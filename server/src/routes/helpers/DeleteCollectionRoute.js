import Route from "./Route";
import { deleteCollection } from "./../../collection/CollectionFeedsRequestHandler";

export default class DeleteCollectionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.collectionId = this.request.query.collection;
    }

    validate() {
        return super.validate(this.authSession, this.collectionId);
    }

    async handle() {
        return await deleteCollection(this.authSession, this.collectionId);
    }
}
