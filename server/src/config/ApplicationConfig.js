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

    adminDetails() {
        return this.environmentConfig.get("adminDetails");
    }

    facebook() {
        return this.environmentConfig.get("facebook");
    }

    twitter() {
        return this.environmentConfig.get("twitter");
    }

    serverIpAddress() {
        return this.environmentConfig.get("serverIpAddress");
    }

    serverPort() {
        return this.environmentConfig.get("serverPort");
    }

    userDbPrefix() {
        return this.environmentConfig.get("userDbPrefix");
    }
}
