/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import DbSession from "./DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class PouchClient {
    static fetchDocuments(queryPath, options) {
        return new Promise((resolve, reject) => {
            DbSession.instance().query(queryPath, options).then(result => {
                let documents = result.rows.map((row) => {
                    return row.value;
                });
                resolve(documents);
            }).catch((error) => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    resolve([]);
                } else {
                    reject(error);
                }
            });
        });
    }
}
