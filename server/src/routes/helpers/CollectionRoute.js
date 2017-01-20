import Route from "./Route";
import CollectionRequestHandler from "../../collection/CollectionRequestHandler";
import RouteLogger from "../RouteLogger";

export default class CollectionRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.docId = this.request.body.docId;
        this.collection = this.request.body.collection;
    }

    async addToCollection() {
        let response = null;
        try {
            if(!this.collection) {
                this._handleBadRequest();
            }
            response = await CollectionRequestHandler.instance().updateCollection(this.authSession, this.docId, this.collection);
            RouteLogger.instance().debug(`CollectionRoute:: successfully added feed ${this.docId} to the collection ${this.collection}`);
            this._handleSuccess(response);
        } catch(error) {
            RouteLogger.instance().debug(`CollectionRoute:: Error in updating the collection. Error  ${error}`);
            this._handleBadRequest();
        }
    }
}
