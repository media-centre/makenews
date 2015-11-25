/* eslint no-process-env:0, no-sync:0 */
"use strict";
import EnvironmentReader from "../../../common/src/environment/EnvironmentReader.js";
import StringUtil from "../../../common/src/util/StringUtil.js";
import fs from "fs";
import path from "path";


export default class EnvironmentConfig {
    static instance(relativefilePath) {
        if(!StringUtil.validNonEmptyString(relativefilePath)) {
            throw new Error("invalid path while reading configuration file");
        }
        if(this.config && this.config[relativefilePath]) {
            return this.config[relativefilePath];
        }
        let environment = process.env.NODE_ENV || "development";
        let environmentConfigJson = JSON.parse(fs.readFileSync(path.join(__dirname, relativefilePath), "utf8"));
        this.config = this.config || {};
        this.config[relativefilePath] = new EnvironmentReader(environmentConfigJson, environment);
        return this.config[relativefilePath];
    }

}

EnvironmentConfig.files = {
    "APPLICATION": "../../config/application.json",
    "LOGGING": "../../config/application.json"
};
