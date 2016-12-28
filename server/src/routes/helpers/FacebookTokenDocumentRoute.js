/* eslint consistent-this:0*/
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookTokenDocument from "../../facebook/FacebookTokenDocument";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class FacebookSetAccessTokenRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
    }

    async getExpiredTime() {  //eslint-disable-line consistent-return
        if(StringUtil.isEmptyString(this.authSession)) {
            return this._handleInvalidRoute();
        }
        let facebookTokenDocument = FacebookTokenDocument.instance();
        let expiredAfter = await facebookTokenDocument.getExpiredTime(this.authSession);
        RouteLogger.instance().debug("FacebookSetAccessTokenRoute:: successfully fetched Expires time for facebook token.");
        this._handleSuccess({ "expireTime": expiredAfter });
    }
}
