import Route from "./Route";
import TwitterRequestHandler from "./../../twitter/TwitterRequestHandler";

export default class TwitterFollowingsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = request.cookies.AuthSession;
        this.nextCursor = request.query.page;
    }

    async handle() {
        const twitterRequestHandler = TwitterRequestHandler.instance();
        return await twitterRequestHandler.fetchFollowings(this.authSession, this.nextCursor);
    }
}
