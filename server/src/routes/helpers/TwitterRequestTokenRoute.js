/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import Route from "./Route";
import RouteLogger from "../RouteLogger";
import ApplicationConfig from "../../config/ApplicationConfig";
import TwitterLogin from "../../twitter/TwitterLogin";

export default class TwitterRequestTokenRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.serverCallbackUrl = this.request.query.serverCallbackUrl;
        this.clientCallbackUrl = this.request.query.clientCallbackUrl;
        this.userName = this.request.query.userName;
    }

    isValid() {
        RouteLogger.instance().error("TwitterRequestTokenRoute:: user name is empty");
        return StringUtil.validNonEmptyString(this.userName);
    }
    handle() {                //eslint-disable-line consistent-return
        if(!this.isValid()) {
            return this._handleInvalidRoute();
        }
        TwitterLogin.instance({ "serverCallbackUrl": this.serverCallbackUrl, "clientCallbackUrl": this.clientCallbackUrl, "userName": this.userName }).then((instance) => {
            RouteLogger.instance().debug("TwitterRequestTokenRoute:: fetching of twitter request token is successful for user '%s'.", this.userName);
            this._handleSuccess({ "authenticateUrl": ApplicationConfig.instance().twitter().authenticateUrl + "?oauth_token=" + instance.getOauthToken() });
        });
    }
}
