"use strict";

import EnvironmentConfig from "./EnvironmentConfig.js";

export default class ApplicationConfig {

    static dbUrl() {
        return EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("couchDbUrl");
    }
}
