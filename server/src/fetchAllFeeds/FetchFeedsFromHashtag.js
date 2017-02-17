import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import Logger from "../logging/Logger";
import Route from "./../routes/helpers/Route";


export default class FetchFeedsFromHashtag extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accesstoken = request.cookies.AuthSession;
        this.hashtag = request.body.hashtag;
        this.facebookAcessToken = null;
    }

    static logger() {
        return Logger.instance();
    }

    async handle() {
        try {
            let feeds = await TwitterRequestHandler.instance().fetchTweetsRequest(this.hashtag, "", this.accesstoken);
            FetchFeedsFromHashtag.logger().debug("FetchFeedsFromAllSources:: successfully fetched tweets for hashtag.");
            return feeds;
        } catch (err) {
            FetchFeedsFromHashtag.logger().error(`FetchFeedsFromAllSources:: error fetching twitter hashtag feeds. Error: ${JSON.stringify(err)}`);
            return [];
        }
    }
}
