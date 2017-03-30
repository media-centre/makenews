import FacebookRequestHandler from "./../../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "./../../../facebook/FacebookAccessToken";
import Route from "./../Route";
import { userDetails } from "./../../../Factory";

export default class ConfigureFacebookPageRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accessToken = this.request.cookies.AuthSession;
        this.pageUrl = this.request.body.pageUrl;
    }

    validate() {
        return super.validate(this.pageUrl);
    }

    async handle() {
        const token = await FacebookAccessToken.instance().getAccessToken(userDetails.getUser(this.accessToken).userName);
        return await FacebookRequestHandler.instance(token).configureFacebookPage(this.pageUrl, this.accessToken);
    }
}
