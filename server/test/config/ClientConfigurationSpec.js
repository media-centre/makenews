/* eslint max-nested-callbacks:0, no-magic-numbers:0 */

import ClientConfig from "../../src/config/ClientConfig";
import EnvironmentConfig from "../../src/config/EnvironmentConfig";
import sinon from "sinon";
import { assert } from "chai";

describe("ClientConfigurationSpec", () => {
    let environmentConfigStub = null;
    beforeEach("ClientConfigurationSpec", () => {
        let clientParamtersJson = {
            "get": (config)=> {
                let json = {
                    "db": {
                        "serverUrl": "http://localhost:5000",
                        "remoteDbUrl": "http://localhost:5984"
                    }
                };
                return json[config];
            }
        };
        environmentConfigStub = sinon.stub(EnvironmentConfig, "instance");
        environmentConfigStub.withArgs(EnvironmentConfig.files.CLIENT_PARAMETERS).returns(clientParamtersJson);
    });

    afterEach("ApplicationConfig", () => {
        EnvironmentConfig.instance.restore();
    });

    describe("db", () => {

        it("should return db paramters from the client paramters file file", ()=> {
            let clientConfig = new ClientConfig();
            assert.strictEqual("http://localhost:5000", clientConfig.db().serverUrl);
            assert.strictEqual("http://localhost:5984", clientConfig.db().remoteDbUrl);
        });
    });

});
