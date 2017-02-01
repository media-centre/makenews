import Route from "./Route";
import { getCollectedFeeds } from "./../../collection/CollectionFeedsRequestHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import R from "ramda"; //eslint-disable-line id-length

export default class CollectionFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.collectionName = this.request.query.collectionName;
        this.offset = this.validateNumber(this.request.query.offset);
    }

    validate() {
        return R.any(StringUtil.isEmptyString)([this.authSession, this.collectionName, this.offset]) ? "" : "missing parameters";
    }

    async handle() {
        return await getCollectedFeeds(this.authSession, this.collectionName, this.offset);
    }
}

