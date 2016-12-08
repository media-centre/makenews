import CouchClient from "../CouchClient";
import { sourceTypes } from "../util/Constants";
import R from "ramda"; //eslint-disable-line id-length

export default class SourceConfigRequestHandler {
    static instance() {
        return new SourceConfigRequestHandler();
    }

    async fetchConfiguredSources(authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        let data = await couchClient.findDocuments({
            "selector": {
                "docType": {
                    "$eq": "configuredSource"
                }
            }
        });
        return this._formatConfiguredSources(data.docs);
    }

    /* TODO change it to one time traversal */ //eslint-disable-line
    _formatConfiguredSources(docs) {
        let result = {
            "profiles": [], "pages": [], "groups": [], "twitter": [], "web": []
        };
        result.profiles = R.filter(R.propEq("sourceType", sourceTypes.fb_profile), docs);
        result.pages = R.filter(R.propEq("sourceType", sourceTypes.fb_page), docs);
        result.groups = R.filter(R.propEq("sourceType", sourceTypes.fb_group), docs);
        result.twitter = R.filter(R.propEq("sourceType", "twitter"), docs);
        result.web = R.filter(R.propEq("sourceType", "web"), docs);

        return result;
    }
}
