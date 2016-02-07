"use strict";
import Logger, { logCategories } from "../logging/Logger.js";

export default class RouteLogger {
    static instance() {
        if(!this.logger) {
            this.logger = Logger.instance(logCategories.HTTP);
        }
        return this.logger;
    }
}
