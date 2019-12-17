import ApplicationConfig from "./config/ApplicationConfig";
import { getRequest } from "./util/FetchClient";

export async function searchDocuments(dbName, indexPath, query) {
    const searchEngineUrl = ApplicationConfig.instance().searchEngineUrl();
    const searchDocsUrl = `${searchEngineUrl}/${dbName}/${indexPath}`;
    return getRequest(searchDocsUrl, query);
}
