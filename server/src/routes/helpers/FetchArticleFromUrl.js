import Route from "./Route";
import StringUtil from "../../../../common/src/util/StringUtil";
import R from "ramda"; //eslint-disable-line id-length
import { fetchArticleData } from "./../../../src/web/WebClient";

export default class FetchArticleFromUrl extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.url = this.request.query.url;
    }
    
    validate() {
        return R.any(StringUtil.isEmptyString)([this.url]) ? "missing parameter url" : "";
    }
    
    async handle() {
        return { "markup": await fetchArticleData(this.url) };
    }
}
