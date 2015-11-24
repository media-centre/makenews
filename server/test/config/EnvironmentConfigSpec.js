/* eslint no-sync:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import fs from "fs";
import path from "path";
import sinon from "sinon";
import { expect } from "chai";

describe("EnvironmentConfig", () => {
    describe("instance", () => {
        let relativeFilePath = null, fileJson = null, fsMock = null;
        before("instance", ()=> {
            relativeFilePath = "test_file_path";
            fileJson = JSON.stringify({
                "unit_testing": {
                    "test_key1": "test_value1"
                }
            });
        });

        beforeEach("instance", () => {
            fsMock = sinon.mock(fs);

        });
        afterEach("instance", () => {
            fsMock.restore();
        });

        it("should throw exception if the relative path is empty", () => {
            let envFunc = function() {
                EnvironmentConfig.instance("   ");
            };

            expect(envFunc).to.throw(Error, "invalid path while reading configuration file");
        });

        it("should return the associated environment of the configuration file if it is already loaded ", () => {
            fsMock.expects("readFileSync").withArgs(path.join(__dirname, "../../src/config/test_file_path"), "utf8").once().returns(fileJson);
            EnvironmentConfig.instance(relativeFilePath);
            let envConfig = EnvironmentConfig.instance(relativeFilePath);
            expect("test_value1").to.be.equal(envConfig.get("test_key1"));
            expect("unit_testing").to.be.equal(envConfig.getEnvironment());
            fsMock.verify();

        });

        it("should return the associated environment and load the environment of the mentioned file", () => {
            relativeFilePath = "test_file_anotehr_path";

            fsMock.expects("readFileSync").withArgs(path.join(__dirname, "../../src/config/test_file_anotehr_path"), "utf8").returns(fileJson);
            let envConfig = EnvironmentConfig.instance(relativeFilePath);
            expect("test_value1").to.be.equal(envConfig.get("test_key1"));
            expect("unit_testing").to.be.equal(envConfig.getEnvironment());
            fsMock.verify();
        });

        it("should load multiple configurations", () => {
            let file_path1 = "file_path1", file_path2 = "file_path2";
            let fileJson1 = JSON.stringify({
                "unit_testing": {
                    "test_key1": "test_value1"
                }
            });
            let fileJson2 = JSON.stringify({
                "unit_testing": {
                    "test_key2": "test_value2"
                }
            });
            fsMock.expects("readFileSync").withArgs(path.join(__dirname, "../../src/config/"+file_path1), "utf8").once().returns(fileJson1);
            EnvironmentConfig.instance(file_path1);
            fsMock.expects("readFileSync").withArgs(path.join(__dirname, "../../src/config/"+file_path2), "utf8").once().returns(fileJson2);
            EnvironmentConfig.instance(file_path2);
            fsMock.verify();

            let envConfig = EnvironmentConfig.instance(file_path1);
            expect("test_value1").to.be.equal(envConfig.get("test_key1"));
            expect("unit_testing").to.be.equal(envConfig.getEnvironment());
        });
    });
});
