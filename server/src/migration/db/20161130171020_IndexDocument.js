import Migration from "../Migration";
import ApplicationConfig from "../../config/ApplicationConfig";
import fetch from "isomorphic-fetch";

export default class IndexDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("IndexDocument::up - started");
            let categoryDocument = {
                "index": {
                    "fields": ["name", "id"]
                },
                "name": "defaultIndex"
            };
            let dbUrl = `${ApplicationConfig.instance().dbUrl()}/${this.dbName}/_index`;
            let response = await fetch(dbUrl, {
                "method": "POST",
                "body": JSON.stringify(categoryDocument),
                "headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Cookie": `AuthSession=${this.accessToken}`
                }
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            Migration.logger(this.dbName).error("IndexDocument::up - error %j", error);
            throw error;
        }
    }
}
