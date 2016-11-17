/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/

"use strict";
import RssParser from "../../src/rss/RssParser";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import { assert } from "chai";


describe("parser", () => {
    it("should return error when parser returns error", () => {
        let rssParser =new RssParser( { "message": "bad request" });
        rssParser.parse().catch(error => {
            console.log(error);
        });
    });

});