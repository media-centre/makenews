/* eslint no-sync:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import EnvironmentFileLoader from "../../src/environment/EnvironmentFileLoader";
import fs from "fs";
import path from "path";
import sinon from "sinon";
import { expect } from "chai";

describe("EnvironmentConfig", () => {
    describe("instance", () => {
        let fullPath = null, fileJson = null;
        let sandbox = null;
        before("instance", ()=> {
            fullPath = path.join(__dirname, "../../src/environment/test_file_path");
            fileJson = JSON.stringify({
                "development": {
                    "test_key1": "test_value1"
                },
                "unit_testing": {
                    "unit_test_key1": "unit_test_value1"
                }
            });
        });

        beforeEach("instance", () => {
            sandbox = sinon.sandbox.create();
        });
        afterEach("instance", () => {
            sandbox.restore();
        });

        it("should throw exception if the relative path is empty", () => {
            let envFunc = function() {
                EnvironmentFileLoader.instance("   ");
            };

            expect(envFunc).to.throw(Error, "invalid path while reading configuration file");
        });

        it("should return the associated environment of the configuration file if it is already loaded ", () => {
            sandbox.stub(fs, "readFileSync").withArgs(fullPath, "utf8").returns(fileJson);
            EnvironmentFileLoader.instance(fullPath);
            let envConfig = EnvironmentFileLoader.instance(fullPath);
            expect("test_value1").to.be.equal(envConfig.get("test_key1"));
            expect("development").to.be.equal(envConfig.getEnvironment());
        });

        it("should return the associated environment and load the environment of the mentioned file", () => {
            let anotherFilePath = path.join(__dirname, "../../src/environment/test_file_anotehr_path");

            sandbox.stub(fs, "readFileSync").withArgs(anotherFilePath, "utf8").returns(fileJson);
            let envConfig = EnvironmentFileLoader.instance(anotherFilePath, "unit_testing");
            expect("unit_test_value1").to.be.equal(envConfig.get("unit_test_key1"));
            expect("unit_testing").to.be.equal(envConfig.getEnvironment());
        });

        it("should load multiple configurations", () => {
            let filePath1 = path.join(__dirname, "../../src/environment/filePath1"),
                filePath2 = path.join(__dirname, "../../src/environment/filePath2");
            let fileJson1 = JSON.stringify({
                "development": {
                    "test_key1": "test_value1"
                }
            });
            let fileJson2 = JSON.stringify({
                "development": {
                    "test_key2": "test_value2"
                }
            });
            let readFileStub = sandbox.stub(fs, "readFileSync");
            readFileStub.withArgs(filePath1, "utf8").returns(fileJson1);
            readFileStub.withArgs(filePath2, "utf8").returns(fileJson2);
            EnvironmentFileLoader.instance(filePath1);
            EnvironmentFileLoader.instance(filePath2);

            let envConfig = EnvironmentFileLoader.instance(filePath1);
            expect("test_value1").to.be.equal(envConfig.get("test_key1"));
            expect("development").to.be.equal(envConfig.getEnvironment());
        });
    });
});
