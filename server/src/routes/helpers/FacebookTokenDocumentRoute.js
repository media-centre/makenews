import FacebookTokenDocument from "../../facebook/FacebookTokenDocument";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookSetAccessTokenRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
    }

    async isExpired() {
        const facebookTokenDocument = FacebookTokenDocument.instance();
        const isExpired = await facebookTokenDocument.isExpired(this.authSession);
        RouteLogger.instance().debug("FacebookSetAccessTokenRoute:: successfully fetched Expires time for facebook token.");
        this._handleSuccess({ isExpired });
    }
}
