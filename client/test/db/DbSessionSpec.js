/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { DbSession } from "../../src/js/db/DbSession.js";
import { assert } from "chai";
import PouchDB  from "pouchdb";


describe("DbSession", () => {
    describe("instance", () => {
        xit("should create the new pouch db instance for the first time", () => {
            var pouch = new PouchDB('myDB', {db: require('memdown')});
        });

        xit("should return the same pouch db instance from second time onwards", () => {
        });
    });
});
