import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../facebook/FacebookAccessToken";
import Route from "./Route";
import { fbSourceTypesToFetch } from "../../util/Constants";
import { userDetails } from "../../Factory";
import R from "ramda";  //eslint-disable-line id-length

export default class FacebookSourceRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.keyword = this.request.body.keyword;
        this.type = this.request.body.type;
        this.paging = this.request.body.paging;
        this.accessToken = this.request.cookies.AuthSession;
    }

    validate() {
        let message = super.validate(this.type, this.keyword);
        if(!message && R.not(fbSourceTypesToFetch[this.type])) {
            message = `invalid type parameter ${this.type}`;
        }
        return message;
    }

    async handle() {
        let params = {
            "q": this.keyword,
            "type": fbSourceTypesToFetch[this.type]
        };
        let token = await FacebookAccessToken.instance().getAccessToken(userDetails.getUser(this.accessToken).userName);
        return await FacebookRequestHandler.instance(token).fetchSourceUrls(params, this.paging);
    }
}
