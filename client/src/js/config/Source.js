"use strict";
import PouchClient from "../db/PouchClient";
import CategoryDb from "../config/db/CategoryDb";

export default class Source {
    constructor(sourceId){
        this.sourceId = sourceId;
    }

    delete(categoryId) {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(this.sourceId).then(document => {
                const NEGATIVE_INDEX = -1;
                const foundIndex = document.categoryIds.indexOf(categoryId);
                if(foundIndex === NEGATIVE_INDEX) {
                    reject(false);
                } else if(document.categoryIds.length > 1) {
                    document.categoryIds.splice(foundIndex, 1);
                    PouchClient.updateDocument(document).then(response => {
                       resolve(true);
                    });
                } else {
                    CategoryDb.deleteSourceWithReference(this.sourceId).then(response => {
                        resolve(true);
                    });
                }
            });
        });
    }
}


function deleteSource() {
   let s = new Source("A7AE6BD7-0B65-01EF-AE07-DAE4727754E3");
    s.delete("95fa167311bf340b461ba414f1004074");
}

window.deleteSource = deleteSource;