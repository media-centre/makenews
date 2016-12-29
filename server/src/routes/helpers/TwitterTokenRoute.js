/* eslint consistent-this:0*/
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import TwitterToken from "../../twitter/TwitterToken";

export default class TwitterTokenRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
    }
    
    handle() {
        TwitterToken.instance().isPresent(this.accessToken).then((authenticated) => {
            RouteLogger.instance().debug("TwitterTokenRoute:: authentication details fetched successfully.");
            this._handleSuccess({ "twitterAuthenticated": authenticated });
        });
    }

}
