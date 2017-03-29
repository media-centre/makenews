import Route from "./../Route";
import CollectionRequestHandler from "./../../../collection/CollectionRequestHandler";
import CouchClient from "../../../CouchClient";

export default class RenameCollectionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.newCollectionName = this.request.body.newCollectionName;
        this.collectionId = this.request.body.collectionId;
    }

    validate() {
        return super.validate(this.newCollectionName, this.collectionId);
    }

    async handle() {
        const couchClient = CouchClient.instance(this.authSession);
        const collectionReqHandler = CollectionRequestHandler.instance(couchClient);

        return await collectionReqHandler.renameCollection(this.collectionId, this.newCollectionName);
    }
}
