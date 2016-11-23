import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";
import Logger from "../logging/Logger";

export default class FacebookAccessToken {

    static instance() {
        return new FacebookAccessToken();
    }

    static logger() {
        return Logger.instance("Facebook");
    }

    getAccessToken(userName) {
        return new Promise((resolve, reject) => {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then(dbInstance => {
                dbInstance.getDocument(userName + "_facebookToken").then((document) => {
                    FacebookAccessToken.logger().debug("FacebookAccessToken:: fetched access token for user %s.", userName);
                    resolve(document.access_token);
                }).catch((error) => {
                    FacebookAccessToken.logger().error("FacebookAccessToken:: error while reading access token for user %s. Error: %s", userName, error);
                    reject("access token not there");
                });
            });
        });
    }
}
