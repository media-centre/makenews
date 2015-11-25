/* eslint no-sync:0 */
"use strict";
import EnvironmentConfig from "../config/EnvironmentConfig";
import winston from "winston";
import fs from "fs";
import path from "path";

export const logLevel = { "LOG_INFO": "info", "LOG_DEBUG": "debug", "LOG_ERROR": "error", "LOG_WARN": "warn" },
    logType = { "CONSOLE": 0, "FILE": 1, "CONSOLE_FILE": 2 },
    logCategories = { "DEFAULT": "default", "HTTP": "http", "DATABASE": "database", "AUTHORIZATION": "authorization" };
let defaultCategoryLogger = null, defaultLogger = null, categoriesInitialized = false;
let LOG_DIR = "server/logs", LOG_FILE = "defaultLog.log";

export default class Logger {

    constructor(logger) {
        this.logger = logger;
    }

    static initialize() {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR);
        }
        if(!defaultLogger) {
            defaultLogger = new winston.Logger({
                "transports": [new (winston.transports.File)({
                    "dirname": LOG_DIR,
                    "filename": LOG_FILE,
                    "level": logLevel.LOG_INFO
                })
                ]
            });
        }
        if(!Logger._isCategoriesInitialized()) {
            Logger._readLogConfig(EnvironmentConfig.files.LOGGING);
        }
    }

    static _isCategoriesInitialized() {
        return categoriesInitialized;
    }

    static instance(categoryName) {
        Logger.initialize();
        if(categoryName) {
            return new Logger(winston.loggers.get(categoryName));
        }
        return new Logger();
    }

    static _createCategoryLoggers(logConfigJson) {
        let environment = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION);
        let loggingConfig = logConfigJson[environment.environment];
        if(loggingConfig) {
            let dirName = loggingConfig.dirname;
            let categoriesConfig = loggingConfig.logging;
            for (let loggerName of Object.keys(categoriesConfig)) {
                let categoryConfig = categoriesConfig[loggerName];
                if (categoryConfig.file) {
                    categoryConfig.file.dirname = categoryConfig.file.dirname || dirName;
                }
                winston.loggers.add(loggerName, categoryConfig);
                if (loggerName === logCategories.DEFAULT) {
                    defaultCategoryLogger = winston.loggers.get(loggerName);
                }
            }
            categoriesInitialized = true;
        }
    }

    static _getJson(relativefilePath) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, relativefilePath), "utf8"));
    }

    static fileInstance(fileName, level) {
        let fileOptions = { "filename": fileName, "level": level };
        return Logger.customInstance(fileOptions);
    }

    static customInstance(options = []) {
        return new Logger(this._createLogger(options));
    }

    static _readLogConfig(relativefilePath) {
        let logConfigJSON = Logger._getJson(relativefilePath);
        Logger._createCategoryLoggers(logConfigJSON);
    }

    static _createLogger(options) {
        let transports = Logger._createTransports(options);
        return new winston.Logger({
            "transports": transports
        });
    }

    static _createTransports(options) {
        let transports = [];
        switch (options.logType) {
        case logType.CONSOLE:
            transports.push(Logger._createConsoleTransport(options));
            break;
        case logType.FILE:
            transports.push(Logger._createFileTransport(options));
            break;
        case logType.CONSOLE_FILE:
            transports.push(Logger._createFileTransport(options));
            transports.push(Logger._createConsoleTransport(options));
            break;
        default:
            transports.push(Logger._createFileTransport(options));
        }
        return transports;
    }

    static _createFileTransport(options) {
        return new (winston.transports.File)({
            "dirname": options.dirName ? options.dirName : LOG_DIR,
            "filename": options.filename ? options.filename : LOG_FILE,
            "level": options.level ? options.level : logLevel.LOG_INFO,
            "maxsize": 20000,
            "maxFiles": 10,
            "tailable": true,
            "rotationFormat": this.getFormattedDate
        });
    }

    static _createConsoleTransport(options) {
        return new (winston.transports.Console)({ "level": options.level, "colorize": true });
    }

    getFormattedDate() {
        let currentDate = new Date();
        return this.appendZero(currentDate.getFullYear()) +
            this.appendZero(1 + currentDate.getMonth()) +
            this.appendZero(currentDate.getDate());
    }

    appendZero(value) {
        let maxValue = 10;
        return (value < maxValue) ? "0" + value : String(value);
    }

    getLogger() {
        return this.logger || defaultCategoryLogger || defaultLogger;
    }

    debug(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_DEBUG, message, insertions);
    }
    info(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_INFO, message, insertions);
    }
    warn(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_WARN, message, insertions);
    }
    error(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_ERROR, message, insertions);
    }

    log(level, message, insertions) {
        this.getLogger().log(level, message, insertions, {});
    }
}
