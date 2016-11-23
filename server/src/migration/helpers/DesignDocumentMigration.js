import CouchClient from "../../../src/CouchClient";

export default class DesignDocumentMigration {
    static instance(dbName, accessToken, designDocName) {
        return new DesignDocumentMigration(dbName, accessToken, designDocName);
    }

    constructor(dbName, accessToken, designDocName) {
        this.couchClient = CouchClient.instance(dbName, accessToken);
        this.designDocName = designDocName;
    }

    addOrUpdateViews(viewsJson) {
        return new Promise((resolve, reject) => {
            this.couchClient.getDocument(this.designDocName).then(document => {
                Object.keys(viewsJson).forEach(key => {
                    document.views[key] = viewsJson[key];
                });

                this.couchClient.saveDocument(this.designDocName, document).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}
