/* eslint no-process-env:0, no-sync:0 */
"use strict";
import EnvironmentFileLoader from "../../../common/src/environment/EnvironmentFileLoader.js";
import path from "path";


export default class EnvironmentConfig {
    static instance(filePath, environment = null) {
        return EnvironmentFileLoader.instance(filePath, environment);
    }
}

EnvironmentConfig.files = {
    "APPLICATION": path.join(__dirname, "../../config/application.json"),
    "LOGGING": path.join(__dirname, "../../config/logging.json")
};
