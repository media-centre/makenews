import Route from "./Route";
import CollectionRequestHandler from "../../collection/CollectionRequestHandler";
import RouteLogger from "../RouteLogger";

export default class CollectionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        const body = this.request.body;
        this.docId = body.docId;
        this.collection = body.collection;
        this.isNewCollection = body.isNewCollection;
        this.sourceId = body.sourceId;
    }

    async addToCollection() {
        try {
            if(!this.collection) {
                this._handleBadRequest();
                return;
            }
            const response = await CollectionRequestHandler.instance().updateCollection(this.authSession, this.collection, this.isNewCollection, this.docId, this.sourceId);
            RouteLogger.instance().debug(`CollectionRoute:: successfully updated the collection ${this.collection}`);
            this._handleSuccess(response);
        } catch(error) {
            RouteLogger.instance().debug(`CollectionRoute:: Error in updating the collection. Error  ${error}`);
            this._handleBadRequest();
        }
    }

    async getAllCollections() {
        try {
            const response = await CollectionRequestHandler.instance().getAllCollections(this.authSession);
            RouteLogger.instance().debug(`CollectionRoute:: successfully fetched all collection ${this.collection}`);
            this._handleSuccess(response);
        } catch(error) {
            RouteLogger.instance().debug(`CollectionRoute:: Error in fetching the collection. Error  ${error}`);
            this._handleBadRequest();
        }
    }
}
