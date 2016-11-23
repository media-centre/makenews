
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
        this.addDefaultParameters(envFile.default);
        this.overrideDefaultParameters(envFile[environment]);
    }

    addDefaultParameters(defaultParameters) {
        for(let key in defaultParameters) {
            if(defaultParameters.hasOwnProperty(key)) {
                this.parameters[key] = defaultParameters[key];
            }
        }
    }

    overrideDefaultParameters(environmentParameters) {
        for(let key in environmentParameters) {
            if(environmentParameters.hasOwnProperty(key)) {
                this.parameters[key] = environmentParameters[key];
            }
        }
    }

    get(parameterName) {
        return this.parameters[parameterName];
    }

    getEnvironment() {
        return this.environment;
    }
}
