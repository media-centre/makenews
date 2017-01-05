import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route";
import RouteLogger from "../RouteLogger";

export default class TwitterHandlesRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
        this.keyword = this.request.query.keyword;
        this.page = this.request.query.page;
        this.preFirstId = this.request.query.twitterPreFirstId;
        this.authSession = this.request.cookies.AuthSession;
    }

    pageNumber() {
        let ONE = 1;
        let page = Number.parseInt(this.page, 10);
        return (Number.isInteger(page) && page >= ONE) ? page : ONE;
    }

    async handle() {
        let twitterRequestHandler = TwitterRequestHandler.instance();
        try {
            let data = await twitterRequestHandler.fetchHandlesRequest(this.authSession, this.keyword, this.pageNumber(), this.preFirstId);
            RouteLogger.instance().debug("TwitterHandlesRoute:: successfully fetched twitter feeds for key");
            this._handleSuccess(data);
        } catch(error) {
            RouteLogger.instance().debug(`TwitterHandlesRoute:: fetching twitter feeds failed for key ${JSON.stringify(error)}`);

            this._handleBadRequest();
        }
    }
}

