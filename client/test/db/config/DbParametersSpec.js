/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DbParameters from "../../../src/js/db/config/DbParameters.js";
import { expect } from "chai";

describe("DbParameters", () => {
    describe("setLocalDb", () => {
        it("should setLocalDb again for new db instance", () => {
            let dbParameters = DbParameters.instance();
            dbParameters.setLocalDb("db-1");
            expect(dbParameters.dbUrl).to.eq("db-1");
        });
    });

    describe("clearInstance", ()=> {
        it("should clear parameter instance", ()=> {
            let instance1 = DbParameters.instance();
            instance1.setLocalDb("url1");
            instance1.clearInstance();
            expect(instance1.dbParameters).to.be.undefined;
            let instance2 = DbParameters.instance();
            instance2.setLocalDb("url2");
            expect(instance2.getLocalDb()).to.eq("url2");
        });
    });
});
