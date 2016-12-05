import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import R from "ramda"; //eslint-disable-line id-length

export default class Route {
    constructor(request, response, next) {
        if(!request || !response) {
            throw new Error("request or response can not be empty");
        }

        this.request = request;
        this.response = response;
        this.next = next;
    }

    handle() {
    }

    checkInvalidParameters(...params) {
        return R.any(StringUtil.isEmptyString)(params);
    }

    isValidRequestData() {
        if(!this.request.body || !this.request.body.data || this.request.body.data.length === 0) { //eslint-disable-line no-magic-numbers
            return false;
        }
        let errorItems = this.request.body.data.filter((item)=> { //eslint-disable-line consistent-return
            let { timestamp, url, id } = item;
            return R.any(StringUtil.isEmptyString)([timestamp, url, id]);
        });

        return errorItems.length === 0; //eslint-disable-line no-magic-numbers
    }

    _handleFailure(error) {
        this.response.status(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
        this.response.json(error);
    }

    _handleFileNotFoundFailure(error) {
        this.response.status(HttpResponseHandler.codes.NOT_FOUND);
        this.response.json(error);
    }

    _handleInvalidRoute() {
        this.response.status(HttpResponseHandler.codes.BAD_REQUEST);
        this.response.json({ "message": "bad request" });
    }

    _handleBadRequest() {
        this._handleInvalidRoute();
    }

    _handleSuccess(json) {
        this.response.status(HttpResponseHandler.codes.OK);
        this.response.json(json);
    }
}
