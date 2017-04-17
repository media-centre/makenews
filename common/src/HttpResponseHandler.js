import NumberUtil from "./util/NumberUtil";

export default class HttpResponseHandler {
    constructor(code) {
        this.statusCode = NumberUtil.toNumber(code);
    }

    information() {
        const infoCodeStart = 100;
        const infoCodeEnd = 199;
        return (this.statusCode >= infoCodeStart && this.statusCode <= infoCodeEnd);
        
    }
    success() {
        const successStart = 200;
        const successEnd = 299;
        return (this.statusCode >= successStart && this.statusCode <= successEnd);
        
    }

    redirection() {
        const reDirectionStart = 300;
        const reDirectionEnd = 399;
        return (this.statusCode >= reDirectionStart && this.statusCode <= reDirectionEnd);
        
    }

    clientError() {
        const clientErrorStart = 400;
        const clientErrorEnd = 499;
        return (this.statusCode >= clientErrorStart && this.statusCode <= clientErrorEnd);
        
    }

    serverError() {
        const serverErrorStart = 500;
        const serverErrorEnd = 599;

        return (this.statusCode >= serverErrorStart && this.statusCode <= serverErrorEnd);
        
    }

    is(httpStandardCode) {
        return this.statusCode === httpStandardCode;
    }

}
HttpResponseHandler.codes = {
    "CONTINUE": 100,
    "SWITCHING_PROTOCALS": 101,
    "CHECKPOINT": 103,

    "OK": 200,
    "CREATED": 201,
    "ACCEPTED": 202,
    "NON_AUTHORATIVE_INFORMATION": 203,
    "NO_CONTENT": 204,
    "RESET_CONTENT": 205,
    "PARTIAL_CONTENT": 206,

    "MULTIPLE_CHOICES": 300,
    "MOVED_PERMANENTLY": 301,
    "FOUND": 302,
    "SEE_OTHER": 303,
    "NOT_MODIFIED": 304,
    "SWITCH_PROXY": 306,
    "TEMPORARY_REDIRECT": 307,
    "RESUME_INCOMPLETE": 308,

    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "PAYMENT_REQUIRED": 402,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "METHOD_NOT_ALLOWED": 405,
    "NOT_ACCEPTABLE": 406,
    "PROXY_AUTHENTICATION_REQUIRED": 407,
    "REQUEST_TIMEOUT": 408,
    "CONFLICT": 409,
    "GONE": 410,
    "LENGTH_REQUIRED": 411,
    "PRECONDITION_FAILED": 412,
    "REQUEST_ENTITY_TOO_LARGE": 413,
    "REQUEST_URI_TOO_LONG": 414,
    "UNSUPPORTED_MEDIA_TYPE": 415,
    "REQUESTED_RANGE_NOT_SATISFIABLE": 416,
    "EXPECTATION_FAILED": 417,
    "UNPROCESSABLE_ENTITY": 422,

    "INTERNAL_SERVER_ERROR": 500,
    "NOT_IMPLEMENTED": 501,
    "BAD_GATEWAY": 502,
    "SERVICE_UNAVAILABLE": 503,
    "GATEWAY_TIMEOUT": 504,
    "HTTP_VERSION_NOT_SUPPORTED": 505,
    "NETWORK_AUTHENTICATION": 511,

    "TOO_MANY_REQUESTS": 429
};
