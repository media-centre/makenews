import CouchClient from "../CouchClient";
import StringUtil from "../../../common/src/util/StringUtil";
import R from "ramda"; //eslint-disable-line id-length

export default class SourceConfigRequestHandler {
    static instance() {
        return new SourceConfigRequestHandler();
    }

    async addConfiguredSource(sourceType, sources, authSession) {
        const couchClient = CouchClient.instance(authSession);
        const data = this._getFormattedSources(sourceType, sources);
        await couchClient.saveBulkDocuments({ "docs": data });
        return { "ok": true };
    }

    async fetchConfiguredSources(authSession) {
        const couchClient = CouchClient.instance(authSession);
        const data = await couchClient.findDocuments({
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            },
            "limit": 1000
        });
        return this._formatConfiguredSources(data.docs);
    }

    _getFormattedSources(sourceType, sources) {
        const formatSources = source => {
            const doc = {
                "_id": source.url,
                "name": source.name,
                "docType": "source",
                "sourceType": sourceType
            };

            if(source.url.startsWith("#")) {
                doc._id = encodeURIComponent(source.url);
                doc.hashtag = true;
            }
            return doc;
        };
        const filterEmpty = source => {
            return !StringUtil.isEmptyString(source.url);
        };
        return R.pipe(
            R.filter(filterEmpty),
            R.map(formatSources)
        )(sources);
    }

    _formatConfiguredSources(docs) {
        const result = {
            "profiles": [], "pages": [], "groups": [], "twitter": [], "web": []
        };
        const configSourceTypes = {
            "fb_profile": "profiles", "fb_page": "pages", "fb_group": "groups", "twitter": "twitter", "web": "web"
        };

        docs.forEach(source => {
            if(source.sourceType) {
                result[configSourceTypes[source.sourceType]].push(source);
            }
        });
        return result;
    }
}
