/* eslint no-process-env:0, no-sync:0 */
"use strict";
import EnvironmentReader from "../../../common/src/environment/EnvironmentReader.js";
import { CONTENT_DISCOVERY_ENVIRONMENT } from "../../config/environment.js";
import applicaitoJson from "../../config/application.json";

export default class EnvironmentConfig {
    static instance() {
        if(!this.environmentReader) {
            this.environmentReader = new EnvironmentReader(applicaitoJson, this.getEnvironment());
        }
        return this.environmentReader;
    }

    static getEnvironment() {
        return CONTENT_DISCOVERY_ENVIRONMENT;
    }
}
