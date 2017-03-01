import ApplicationConfig from "./config/ApplicationConfig";
import { getRequest } from "./util/FetchClient";

export async function searchDocuments(dbName, indexPath, query) {
    let searchEngineUrl = ApplicationConfig.instance().searchEngineUrl();
    let searchDocsUrl = `${searchEngineUrl}/${dbName}/${indexPath}`;
    return getRequest(searchDocsUrl, query);
}
