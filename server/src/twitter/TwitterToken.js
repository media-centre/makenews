import { getUserDocumentId, getAdminDBInstance } from "../facebook/FacebookTokenDocument";
import Logger from "../logging/Logger";
export const TWITTER_DOCUMENT_ID = "_twitterToken";
export default class TwitterToken {
    
    static instance() {
        return new TwitterToken();
    }

    static logger() {
        return Logger.instance("TwitterToken");
    }
    
    async isPresent(authSession) {
        try {
            const adminDbInstance = await getAdminDBInstance();
            const tokenDocumentId = await getUserDocumentId(authSession, TWITTER_DOCUMENT_ID);
            await adminDbInstance.getDocument(tokenDocumentId);
            return true;
        } catch (error) {
            TwitterToken.logger().debug(`TwitterToken:: error while getting the user document ${error}. `);
            return false;
        }
    }
}
