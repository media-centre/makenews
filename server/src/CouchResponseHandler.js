"use strict";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";

export default class CoucheResponseHandler {
    static requestCompleted(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.OK);
    }
    static documentCreated(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.CREATED);
    }

    static requestAccepted(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.ACCEPTED);
    }

    static additionalContentRequestNotModified(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.NOT_MODIFIED);
    }

    static badRequestStructure(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.BAD_REQUEST);
    }

    static unauthorized(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.UNAUTHORIZED);
    }

    static forbidden(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.FORBIDDEN);
    }

    //return extra information like {"error":"not_found","reason":"no_db_file"} in this case
    static contentNotFound(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.NOT_FOUND);
    }

    static invalidHttpRequestTypeForUrl(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.METHOD_NOT_ALLOWED);
    }

    static contentTypeNotSupported(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.NOT_ACCEPTABLE);
    }

    static updateConflict(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.CONFLICT);
    }

    static requestHeaderClientServerNotMatched(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.PRECONDITION_FAILED);
    }

    static contentTypeNotSupported(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.UNSUPPORTED_MEDIA_TYPE);

    }
    static requestRangeNotSatisfiable(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.REQUESTED_RANGE_NOT_SATISFIABLE);
    }

    static bulkLoadOperationFailed(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.EXPECTATION_FAILED);
    }

    static internalServerError(code) {
        return new HttpResponseHandler(code).is(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
    }
}
