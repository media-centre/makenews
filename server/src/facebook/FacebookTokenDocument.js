import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import CouchClient from "../CouchClient";
import Logger from "../logging/Logger";

export default class FacebookTokenDocument {

    static instance() {
        return new FacebookTokenDocument();
    }

    static logger() {
        return Logger.instance("Facebook");
    }

    async getExpiredTime(authSession) {
        let ZERO = 0;
        try {
            let adminDbInstance = await this._getAdminDBInstance();
            let tokenDocumentId = await this._getUserDocumentId(authSession);
            let document = await adminDbInstance.getDocument(tokenDocumentId);
            return document.expired_after;
        } catch (error) {
            FacebookTokenDocument.logger().debug(`FacebookRequestHandler:: error while getting the user document ${error}. `);
            return ZERO;
        }
    }

    async _getAdminDBInstance() {
        try {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            return await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);
        } catch(error) {
            throw new Error(error);
        }
    }

    async _getUserDocumentId(authSession) {
        try {
            let couchClient = await CouchClient.createInstance(authSession);
            let userName = await couchClient.getUserName();
            return userName + "_facebookToken";
        } catch (error) {
            throw new Error(error);
        }
    }
}