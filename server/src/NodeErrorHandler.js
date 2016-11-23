/*eslint no-unused-vars:0 */
import Logger from "../src/logging/Logger";

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
        Logger.instance().error("NodeErrorHandler:: fatal error = %j.", JSON.stringify(error));
    }
}
