/*eslint no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient";
import CategoryDb from "./db/CategoryDb.js";
import SourceDb from "./db/SourceDb.js";
import Source from "./Source.js";
import DateTimeUtil from "../utils/DateTimeUtil.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class Category {
    constructor(paramsObj = {}) {
        if(paramsObj._id) {
            this._id = paramsObj._id;
        }
        if(paramsObj._rev) {
            this._rev = paramsObj._rev;
        }
        this.docType = "category";
        this.name = paramsObj.name;
        this.createdTime = paramsObj.createdTime || DateTimeUtil.getCreatedTime();
    }

    static instance(paramsObj) {
        return new Category(paramsObj);
    }

    getDocument() {
        let docObj = {
            "docType": this.docType,
            "name": this.name,
            "createdTime": this.createdTime
        };

        if(this._id) {
            docObj._id = this._id;
        }
        if(this._rev) {
            docObj._rev = this._rev;
        }
        return docObj;
    }

    save() {
        return new Promise((resolve, reject) => {
            if (StringUtil.isEmptyString(this.name)) {
                this._generateCategoryName().then((name) => {
                    this.name = name;
                    create.bind(this)();
                });
            } else {
                create.bind(this)();
            }

            function create() {
                CategoryDb.fetchCategoryByName(this.name).then(result => {
                    if (result.length === 0) {
                        PouchClient.createDocument(this.getDocument()).then(response => {
                            resolve(Object.assign({}, this.getDocument(), response));
                        }).catch(error => {
                            reject(error);
                        });
                    } else {
                        reject("Category with name already exists");
                    }
                }).catch(err => {
                    reject(err);
                });
            }
        });
    }

    update(updateParams) {
        return new Promise((resolve, reject) => {
            if(updateParams.name) {
                if(updateParams.name.toLowerCase() === this.name.toLowerCase()) {
                    updateDb.bind(this)();
                } else {
                    CategoryDb.fetchCategoryByName(updateParams.name).then(result => {
                        if(result.length === 0) {
                            updateDb.bind(this)();
                        } else {
                            reject({ "status": false, "error": "Category with name already exists" });
                        }
                    });
                }
            } else {
                updateDb.bind(this)();
            }

            function updateDb() {
                PouchClient.updateDocument(Object.assign({}, this.getDocument(), updateParams)).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject({ "status": false, "error": error });
                });
            }
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            SourceDb.fetchSourceConfigurationsByCategoryId(this._id).then(sourceUrlsObj => {
                let sourceUrlLength = sourceUrlsObj.length;
                if(sourceUrlLength === 0) {
                    this.deleteCategoryDocument(resolve, reject);
                    return;
                }
                for(let index = 0; index < sourceUrlLength; index += 1) {
                    let sourceUrlObj = sourceUrlsObj[index];
                    Source.instance(sourceUrlObj).delete(this._id).then(success => { //eslint-disable-line no-loop-func
                        if(index + 1 === sourceUrlLength) {
                            this.deleteCategoryDocument(resolve, reject);
                        }
                    }).catch(error => { //eslint-disable-line no-loop-func
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    deleteCategoryDocument(resolve, reject) {
        PouchClient.deleteDocument(this.getDocument()).then(() => { //eslint-disable-line max-nested-callbacks
            resolve(true);
        }).catch((error) => { //eslint-disable-line max-nested-callbacks
            reject(error);
        });
    }

    _generateCategoryName() {
        return new Promise((resolve) => {
            let generatedName = "";
            CategoryDb.fetchAllCategoryDocuments().then(categories => {
                let existingNames = categories.map(category => category.name);
                let existingNamesSize = existingNames.length + 1;
                Array(existingNamesSize).fill().map((value, index) => index).some((index)=> {
                    generatedName = "Untitled Category " + (index + 1);
                    let NEGATIVE_INDEX = -1;
                    if(existingNames.indexOf(generatedName) === NEGATIVE_INDEX) {
                        resolve(generatedName);
                    }
                });
            });
        });
    }
}
