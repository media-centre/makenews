/* eslint max-nested-callbacks: [2, 5] */

"use strict";

import { assert } from "chai";
import Logger, { logLevel, logType } from "../../src/logging/Logger";
import sinon from "sinon";

describe("Logger", () => {

    describe("instance", () => {
        let sandBox = null, JsonStub = null, loggerStub = null, defaultCategoryLogger = null;

        beforeEach("stub getJson", () => {
            sandBox = sinon.sandbox.create();
            loggerStub = sandBox.stub(Logger, "_isCategoriesInitialized");
        });
        afterEach("restore getJson stub", ()=> {
            sandBox.restore();
        });

        it("defaultLogger is called", () => {
            JsonStub = sandBox.stub(Logger, "_getJson");
            JsonStub.returns({});
            loggerStub.returns(true);
            defaultCategoryLogger = sandBox.stub(Logger, "_getDefaultCategoryLogger");
            defaultCategoryLogger.returns(null);
            assertFileLogger(Logger.instance(), "defaultLog.log", logLevel.LOG_INFO);

        });

        it("default logger should be returned when instance is called without default logging config ", () => {
            let myJson = {
                "unit_testing": {
                    "dir": "../../../dist/logs",
                    "test1": {
                        "file": {
                            "filename": "test1.log",
                            "level": logLevel.LOG_INFO
                        }
                    }
                }
            };
            JsonStub = sandBox.stub(Logger, "_getJson");
            JsonStub.returns(myJson);
            defaultCategoryLogger = sandBox.stub(Logger, "_getDefaultCategoryLogger");
            defaultCategoryLogger.returns(null);
            const logger = Logger.instance();
            assertFileLogger(logger, "defaultLog.log", logLevel.LOG_INFO);
        });

        it("default category logger should be returned if looging.json is read", () => {
            loggerStub.returns(false);
            assertFileLogger(Logger.instance(), "unitTest.log", logLevel.LOG_ERROR);
        });

        it("category logger should be returned when instance is called with category name", () => {
            let myJson = {
                "unit_testing": {
                    "dir": "../../../dist/logs",
                    "default": {
                        "file": {
                            "filename": "def.log",
                            "level": logLevel.LOG_WARN
                        }
                    },
                    "test3": {
                        "file": {
                            "filename": "test3.log",
                            "level": logLevel.LOG_INFO
                        }
                    }
                }
            };
            JsonStub = sandBox.stub(Logger, "_getJson");
            JsonStub.returns(myJson);
            loggerStub.returns(false);
            let logger = Logger.instance("test3");
            assertFileLogger(logger, "test3.log", logLevel.LOG_INFO);
        });
    });

    describe("File instance", () => {
        it("default file instance", () => {
            assertFileLogger(Logger.fileInstance(), "defaultLog.log", logLevel.LOG_INFO);
        });
        it("Instance with filename", () => {
            assertFileLogger(Logger.fileInstance("fileTest1.log"), "fileTest1.log", logLevel.LOG_INFO);
        });
        it("Instance with filename and log level", () => {
            assertFileLogger(Logger.fileInstance("fileTest1.log", logLevel.LOG_ERROR), "fileTest1.log", logLevel.LOG_ERROR);
        });
    });

    describe("Custom instance", () => {
        it("default instance", () => {
            assertFileLogger(Logger.customInstance(), "defaultLog.log", logLevel.LOG_INFO);
        });
        it("file instance", () => {
            let options = { "logType": logType.FILE, "filename": "customtest1.log", "level": logLevel.LOG_DEBUG };
            assertFileLogger(Logger.customInstance(options), "customtest1.log", logLevel.LOG_DEBUG);
        });
        it("console instance", () => {
            let options = { "logType": logType.CONSOLE, "level": logLevel.LOG_DEBUG };
            assertConsoleLogger(Logger.customInstance(options), logLevel.LOG_DEBUG);
        });
        it("file and console instance", () => {
            let options = { "logType": logType.CONSOLE_FILE, "filename": "customtest3.log", "level": logLevel.LOG_ERROR };
            let logger = Logger.customInstance(options);
            assertFileLogger(logger, "customtest3.log", "error");
            assertConsoleLogger(logger, "error");
        });
    });

    function assertFileLogger(logger, fileName, level) {
        assert.strictEqual(logger.getLogger().transports.file.filename, fileName);
        assert.strictEqual(logger.getLogger().transports.file.level, level);
    }

    function assertConsoleLogger(logger, level) {
        assert.strictEqual(logger.getLogger().transports.console.level, level);
    }
});
