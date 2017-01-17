import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import RouteLogger from "../RouteLogger";
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

    async process() {
        let routeClass = this.constructor.name;
        let routeParams = this.request.query || this.request.body || "";
        let message = this.validate();
        if(message) {
            RouteLogger.instance().warn(`${routeClass}:: validation failed for parameters: [${routeParams}] with message: [${message}]`);
            this._handleInvalidRequest({ message });
        } else {
            try {
                let response = await this.handle();
                this._handleSuccess(response);
                RouteLogger.instance().debug(`${routeClass}:: request processing completed successfully`);
            } catch (err) {
                this._handleError(err);
                RouteLogger.instance().warn(`${routeClass}:: request with parameters: [${routeParams}]  failed with error: [${err}]`);
            }
        }
    }

    validate(...params) {
        return R.any(StringUtil.isEmptyString)(params) ? "missing parameters" : "";
    }

    checkInvalidParameters(...params) {
        return R.any(StringUtil.isEmptyString)(params);
    }

    validateNumber(numberString) {
        let defaultNumber = 0;
        let safeNumber = Number.parseInt(numberString, 10);
        return (Number.isInteger(safeNumber) && safeNumber >= defaultNumber) ? safeNumber : defaultNumber;
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

    _handleInvalidRequest(error) {
        this.response.status(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        this.response.json(error);
    }

    _handleSuccess(json) {
        this.response.status(HttpResponseHandler.codes.OK);
        this.response.json(json);
    }

    _handleError(message) {
        this.response.status(HttpResponseHandler.codes.BAD_REQUEST);
        this.response.json({ message });
    }
}
