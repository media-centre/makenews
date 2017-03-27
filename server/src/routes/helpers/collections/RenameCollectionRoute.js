import Route from "./../Route";
import CollectionRequestHandler from "./../../../collection/CollectionRequestHandler";

export default class RenameCollectionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.newCollectionName = this.request.body.newCollectionName;
        this.collectionId = this.request.body.collectionId;
    }

    validate() {
        return super.validate(this.newCollectionName, this.collectionId);
    }

    async handle() {
        const collectionReqHandler = CollectionRequestHandler.instance();
        return await collectionReqHandler.renameCollection(this.accessToken, this.collectionId, this.newCollectionName);
    }
}
