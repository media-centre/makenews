/* eslint consistent-this:0*/
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import ApplicationConfig from "../../config/ApplicationConfig";
import TwitterLogin from "../../twitter/TwitterLogin";

export default class TwitterRequestTokenRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.serverCallbackUrl = this.request.query.serverCallbackUrl;
        this.clientCallbackUrl = this.request.query.clientCallbackUrl;
    }

    handle() {
        TwitterLogin.instance({ "serverCallbackUrl": this.serverCallbackUrl, "clientCallbackUrl": this.clientCallbackUrl })
            .then(instance => {
                RouteLogger.instance().debug("TwitterRequestTokenRoute:: fetching of twitter request token is successful for user.");
                this._handleSuccess({ "authenticateUrl": ApplicationConfig.instance().twitter().authenticateUrl + "?oauth_token=" + instance.getOauthToken() });
            }).catch(err => {
                RouteLogger.instance().error(`TwitterRequestTokenRoute:: unable to fetch twitter request token :: ${err}`);
                this._handleError("Unable to fetch the twitter request token");
            });
    }
}
