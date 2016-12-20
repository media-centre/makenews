import CouchClient from "../CouchClient";

export default class SourceConfigRequestHandler {
    static instance() {
        return new SourceConfigRequestHandler();
    }

    async fetchConfiguredSources(authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        let data = await couchClient.findDocuments({
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            },
            "limit": 1000
        });
        return this._formatConfiguredSources(data.docs);
    }

    _formatConfiguredSources(docs) {
        let result = {
            "profiles": [], "pages": [], "groups": [], "twitter": [], "web": []
        };
        let configSourceTypes = {
            "fb_profile": "profiles", "fb_page": "pages", "fb_group": "groups", "twitter": "twitter", "web": "web"
        };

        for (let source of docs) {
            if(source.sourceType) {
                result[configSourceTypes[source.sourceType]].push(source);
            }
        }
        return result;
    }
}
