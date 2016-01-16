"use strict";
import Logger from "../logging/Logger.js";

export default class RouteLogger {
    static instance() {
        if(!this.logger) {
            this.logger = Logger.instance(Logger.HTTP);
        }
        return this.logger;
    }
}
