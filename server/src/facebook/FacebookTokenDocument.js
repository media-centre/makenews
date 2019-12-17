import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import Logger from "../logging/Logger";
import { userDetails } from "../Factory";
import DateUtil from "./../util/DateUtil";
export const FACEBOOK_DOCUMENT_ID = "_facebookToken";

export default class FacebookTokenDocument {

    static instance() {
        return new FacebookTokenDocument();
    }

    static logger() {
        return Logger.instance("Facebook");
    }

    async isExpired(authSession) {
        try {
            const adminDbInstance = await getAdminDBInstance();
            const tokenDocumentId = await getUserDocumentId(authSession, FACEBOOK_DOCUMENT_ID);
            const document = await adminDbInstance.getDocument(tokenDocumentId);
            return document.expired_after < DateUtil.getCurrentTime();
        } catch (error) {
            FacebookTokenDocument.logger().debug(`FacebookTokenDocument:: error while getting the user document ${JSON.stringify(error)}. `);
            return true;
        }
    }

}

export async function getAdminDBInstance() {
    const adminDetails = ApplicationConfig.instance().adminDetails();
    return await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);
}

export async function getUserDocumentId(authSession, id) {
    const { userName } = userDetails.getUser(authSession);
    return `${userName}${id}`;
}
