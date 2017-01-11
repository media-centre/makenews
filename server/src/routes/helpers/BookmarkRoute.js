import Route from "./Route";
import RouteLogger from "../RouteLogger";
import BookmarkRequestHandler from "./../../bookmark/BookmarkRequestHandler";

export default class BookmarkRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.docId = this.request.body.docId;
    }

    async bookmarkFeed() {
        let bookmarkRequestHandler = BookmarkRequestHandler.instance();
        try {
            let response = await bookmarkRequestHandler.updateDocument(this.authSession, this.docId);
            RouteLogger.instance().debug(`BookmarkRoute:: successfully added bookmark field for the document ${this.docId}`);
            this._handleSuccess(response);
        } catch(error) {
            RouteLogger.instance().debug(`Bookmark:: Error in adding bookmark field for the document. Error  ${error}`);
            this._handleBadRequest();
        }
    }
}
