import DesignDocumentMigration from "../helpers/DesignDocumentMigration";
import Migration from "../Migration";

export default class AddFilterViewToDesignDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.designDocumentMigObj = DesignDocumentMigration.instance(dbName, accessToken, "_design/category");
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("AddFilterViewToDesignDocument::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._filterViews()).then(response => {
                Migration.logger(this.dbName).info("AddFilterViewToDesignDocument::up - response %j", response);
                resolve(response);
            }).catch(error => {
                Migration.logger(this.dbName).error("AddFilterViewToDesignDocument::up - error %j", error);
                reject(error);
            });
        });
    }

    _filterViews() {
        return {
            "surfFilter": {
                "map": "function(doc) { if(doc.docType == 'surf-filter') {emit(doc._id, doc)} }"
            },
            "latestFeeds": {
                "map": "function(doc) { if(doc.docType == 'feed' && (!doc.status || doc.status != 'park')) {emit(doc.postedDate, doc)} }"
            }
        };

    }
}
