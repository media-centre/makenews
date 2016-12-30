import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import Logger from "../logging/Logger";
import { userDetails } from "../Factory";

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
    let { userName } = userDetails.getUser(authSession);
    return userName + "_facebookToken";
}
