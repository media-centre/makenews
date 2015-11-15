/*eslint no-unused-vars:0 */
"use strict";
import BoolUtil from "../../common/src/util/BoolUtil.js";

export default class NodeErrorHandler {
    static errored(error) {
        if(BoolUtil.isEmpty(error)) {
            return false;
        }
        NodeErrorHandler.log(error);
        return true;
    }
    static noError(error) {
        return !NodeErrorHandler.errored(error);
    }
    static log(error) {
    }
}
