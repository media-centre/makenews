import DesignDocumentMigration from "../helpers/DesignDocumentMigration";
import Migration from "../Migration";

export default class ModifyAllCategoriesByNameView {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.designDocumentMigObj = DesignDocumentMigration.instance(dbName, accessToken, "_design/category");
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("ModifyAllCategoriesByNameView::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._filterViews()).then(response => {
                Migration.logger(this.dbName).info("ModifyAllCategoriesByNameView::up - response %j", response);
                resolve(response);
            }).catch(error => {
                Migration.logger(this.dbName).error("ModifyAllCategoriesByNameView::up - error %j", error);
                reject(error);
            });
        });
    }

    _filterViews() {
        return {
            "allCategoriesByName": {
                "map": "function(doc) { if(doc.docType == 'category') {emit(doc.name.toLowerCase(), doc)} }"
            }
        };

    }
}
