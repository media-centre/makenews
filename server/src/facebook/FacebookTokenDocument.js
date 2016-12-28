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
            let adminDbInstance = await getAdminDBInstance();
            let tokenDocumentId = await getUserDocumentId(authSession);
            let document = await adminDbInstance.getDocument(tokenDocumentId);
            return document.expired_after;
        } catch (error) {
            FacebookTokenDocument.logger().debug(`FacebookTokenDocument:: error while getting the user document ${error}. `);
            return ZERO;
        }
    }

}

export async function getAdminDBInstance() {
    const adminDetails = ApplicationConfig.instance().adminDetails();
    return await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);
}

export async function getUserDocumentId(authSession) {
    let couchClient = await CouchClient.createInstance(authSession);
    let userName = await couchClient.getUserName();
    return userName + "_facebookToken";
}
