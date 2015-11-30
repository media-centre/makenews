/* eslint no-process-env:0, no-sync:0 */
"use strict";
import EnvironmentReader from "../../../common/src/environment/EnvironmentReader.js";
import StringUtil from "../../../common/src/util/StringUtil.js";
import fs from "fs";

export default class EnvironmentFileLoader {
    static instance(fullPath, environmentParam) {
        if(StringUtil.isEmptyString(fullPath)) {
            throw new Error("invalid path while reading configuration file");
        }
        if(this.config && this.config[fullPath]) {
            return this.config[fullPath];
        }
        let environment = environmentParam || process.env.NODE_ENV || "development";
        let environmentConfigJson = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        this.config = this.config || {};
        this.config[fullPath] = new EnvironmentReader(environmentConfigJson, environment);
        return this.config[fullPath];
    }
}