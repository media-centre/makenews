import Route from "./Route";
import RouteLogger from "../RouteLogger";
import TwitterLogin from "../../twitter/TwitterLogin";

export default class TwitterOauthCallbackRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.oauth_token = this.request.query.oauth_token; //eslint-disable-line
        this.accessToken = this.request.cookies.AuthSession;
        this.denied = this.request.query.denied;
    }

    handle() { //eslint-disable-line consistent-return
        if(this.denied) {
            return this.response.redirect(`${this.request.secure ? "https" : "http"}://${this.request.headers.host}/#/twitterFailed`);
        }

        if(!this.oauth_token) {
            RouteLogger.instance().warn("TwitterOauthCallbackRoute:: OAuth token not available.");
            return this._handleInvalidRequest({ "message": "authentication failed" });
        }

        TwitterLogin.instance({ "previouslyFetchedOauthToken": this.oauth_token, "accessToken": this.accessToken }).then((twitterLoginInstance) => {
            twitterLoginInstance.accessTokenFromTwitter(this.request.query.oauth_verifier).then((clientRedirectUrl) => {
                RouteLogger.instance().debug("TwitterOauthCallbackRoute:: OAuth token fetched successfully.");
                this._handleSuccess(clientRedirectUrl);
            });
        });
    }

    _handleSuccess(clientRedirectUrl) {
        this.response.redirect(clientRedirectUrl);
    }
}
