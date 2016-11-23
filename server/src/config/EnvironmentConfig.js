/* eslint no-process-env:0, no-sync:0 */
import EnvironmentFileLoader from "../../../common/src/environment/EnvironmentFileLoader";
import path from "path";


export default class EnvironmentConfig {
    static instance(filePath, environment = null) {
        return EnvironmentFileLoader.instance(filePath, environment);
    }
}

EnvironmentConfig.files = {
    "APPLICATION": path.join(__dirname, "../../config/application.json"),
    "CLIENT_PARAMETERS": path.join(__dirname, "../../config/clientParameters.json"),
    "LOGGING": path.join(__dirname, "../../config/logging.json")
};
