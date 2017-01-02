/* eslint consistent-this:0*/
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class TwitterFollowersRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
    }

    async handle() {    //eslint-disable-line consistent-return
        let twitterRequestHandler = TwitterRequestHandler.instance();
        try {
            let data = await twitterRequestHandler.fetchFollowersRequest(this.authSession);
            RouteLogger.instance().debug("TwitterFeedsRoute:: successfully fetched twitter feeds for url %s.", this.url);
            this._handleSuccess(data);
        } catch(error){ //eslint-disable-line
            RouteLogger.instance().debug("TwitterFeedsRoute:: fetching twitter feeds failed for url %s. Error: %s", this.url, error);
            this._handleBadRequest();
        }
    }
}

