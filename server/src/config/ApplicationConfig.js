"use strict";

import EnvironmentConfig from "./EnvironmentConfig.js";

export default class ApplicationConfig {

    static instance() {
        return new ApplicationConfig();
    }

    constructor() {
        this.environmentConfig = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION);
    }

    dbUrl() {
        return this.environmentConfig.get("couchDbUrl");
    }

    facebook() {
        return this.environmentConfig.get("facebook");
    }

    twitter() {
        return this.environmentConfig.get("twitter");
    }
}
