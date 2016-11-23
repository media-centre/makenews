import EnvironmentConfig from "./EnvironmentConfig";

export default class ClientConfig {

    static instance() {
        return new ClientConfig();
    }

    constructor() {
        this.environmentConfig = EnvironmentConfig.instance(EnvironmentConfig.files.CLIENT_PARAMETERS);
    }

    db() {
        return this.environmentConfig.get("db");
    }
}
