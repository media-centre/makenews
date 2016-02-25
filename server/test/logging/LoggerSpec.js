/* eslint max-nested-callbacks: [2, 5] */

"use strict";

import { assert } from "chai";
import Logger, { logLevel, logType, LOG_DIR } from "../../src/logging/Logger";
import sinon from "sinon";
import path from "path";

describe("Logger", () => {
    const defaultDirPath = LOG_DIR;

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
            loggerStub.returns(false);
            sandBox.stub(Logger, "_readLogConfig");
            defaultCategoryLogger = sandBox.stub(Logger, "_getDefaultCategoryLogger");
            defaultCategoryLogger.returns(null);
            assertFileLogger(Logger.instance(), "defaultLog.log", defaultDirPath, logLevel.LOG_INFO);

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
            assertFileLogger(logger, "defaultLog.log", defaultDirPath, logLevel.LOG_INFO);
        });

        it("default category logger should be returned if logging.json is read", () => {
            loggerStub.returns(false);
            assertFileLogger(Logger.instance(), "unitTest.log", "/var/mc/logs/server", logLevel.LOG_ERROR);
        });

        it("category logger creation with invalid directory should be handled with default folder", () => {
            let dirname = "";
            let myJson = {
                "unit_testing": {
                    "dir": dirname,
                    "test4": {
                        "file": {
                            "filename": "test4.log",
                            "level": logLevel.LOG_INFO
                        }
                    }
                }
            };
            JsonStub = sandBox.stub(Logger, "_getJson");
            JsonStub.returns(myJson);
            loggerStub.returns(false);
            defaultCategoryLogger = sandBox.stub(Logger, "_getDefaultCategoryLogger");
            defaultCategoryLogger.returns(null);
            let logger = Logger.instance("test4");
            assertFileLogger(logger, "test4.log", path.join(__dirname, "../../../../../logs"), logLevel.LOG_INFO);
        });

        it("category logger should be returned when instance is called with category name", () => {
            let myJson = {
                "unit_testing": {
                    "dir": "/var/logs",
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
            assertFileLogger(logger, "test3.log", "/var/logs", logLevel.LOG_INFO);
        });

    });

    describe("File instance", () => {
        it("default file instance", () => {
            assertFileLogger(Logger.fileInstance(), "defaultLog.log", defaultDirPath, logLevel.LOG_INFO);
        });
        it("Instance with filename", () => {
            assertFileLogger(Logger.fileInstance("fileTest1.log"), "fileTest1.log", defaultDirPath, logLevel.LOG_INFO);
        });
        it("Instance with filename and log level", () => {
            assertFileLogger(Logger.fileInstance("fileTest1.log", logLevel.LOG_ERROR), "fileTest1.log", defaultDirPath, logLevel.LOG_ERROR);
        });
    });

    describe("Custom instance", () => {
        it("default instance", () => {
            assertFileLogger(Logger.customInstance(), "defaultLog.log", defaultDirPath, logLevel.LOG_INFO);
        });
        it("file instance", () => {
            let options = { "logType": logType.FILE, "filename": "customtest1.log", "level": logLevel.LOG_DEBUG };
            assertFileLogger(Logger.customInstance(options), "customtest1.log", defaultDirPath, logLevel.LOG_DEBUG);
        });
        it("console instance", () => {
            let options = { "logType": logType.CONSOLE, "level": logLevel.LOG_DEBUG };
            assertConsoleLogger(Logger.customInstance(options), logLevel.LOG_DEBUG);
        });
        it("file and console instance", () => {
            let options = { "logType": logType.CONSOLE_FILE, "filename": "customtest3.log", "level": logLevel.LOG_ERROR };
            let logger = Logger.customInstance(options);
            assertFileLogger(logger, "customtest3.log", defaultDirPath, "error");
            assertConsoleLogger(logger, "error");
        });
    });

    function assertFileLogger(logger, fileName, dirName, level) {
        assert.strictEqual(logger.getLogger().transports.file.filename, fileName);
        assert.strictEqual(logger.getLogger().transports.file.dirname, dirName);
        assert.strictEqual(logger.getLogger().transports.file.level, level);
    }

    function assertConsoleLogger(logger, level) {
        assert.strictEqual(logger.getLogger().transports.console.level, level);
    }
});
