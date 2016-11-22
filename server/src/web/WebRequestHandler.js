import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";

export default class WebRequestHandler {

    static instance() {
        return new WebRequestHandler();
    }

    static logger() {
        return Logger.instance();
    }

    searchUrl(selector) {
        return new Promise((resolve, reject) => {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then(dbInstance => {
                dbInstance.getUrlDocument(selector).then((document) => {
                    WebRequestHandler.logger().debug("WebRequestHandler:: successfully fetched feeds for the selector.");
                    resolve(document);
                }).catch((error) => {
                    WebRequestHandler.logger().error("WebRequestHandler:: selector is not a proper feed url. Error: %j.", error);
                    reject(error);
                });
            });
        });
    }
}
