
import StringUtil from "../util/StringUtil";

export default class EnvironmentReader {
    constructor(envFile, environment) {
        if(!envFile || !StringUtil.validNonEmptyString(environment)) {
            throw new Error("envFile or environment can not be empty");
        }
        this.environment = environment.trim();
        this.parameters = {};

        this.parseParameters(envFile, environment);
    }

    parseParameters(envFile, environment) {
        this.parameters = this.addDefaultParameters(envFile.default);
        this.parameters = this.overrideDefaultParameters(envFile[environment]);
    }

    addDefaultParameters(defaultParameters) {
        return Object.assign({}, this.parameters, defaultParameters);
    }

    overrideDefaultParameters(environmentParameters) {
        return Object.assign({}, this.parameters, environmentParameters);
    }

    get(parameterName) {
        return this.parameters[parameterName];
    }

    getEnvironment() {
        return this.environment;
    }
}
