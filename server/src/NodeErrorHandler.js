/*eslint no-unused-vars:0 */
"use strict";
import Logger from "../src/logging/Logger.js";

export default class NodeErrorHandler {
    static errored(error) {
        if(!error) {
            return false;
        }
        NodeErrorHandler.log(error);
        return true;
    }
    static noError(error) {
        return !NodeErrorHandler.errored(error);
    }

    static log(error) {
        Logger.instance().error("fatal error = " + JSON.stringify(error));
    }
}
