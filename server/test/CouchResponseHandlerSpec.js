/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";

import CoucheResponseHandler from "../src/CouchResponseHandler.js";
import { expect } from "chai";

describe("CoucheResponseHandler", () => {
    it("should return true for request completed", () => {
        const ok = 200;
        expect(CoucheResponseHandler.requestCompleted(ok)).to.be.ok;
    });

    it("should return true for the unauthorized code", () => {
        const unauthorized = 401;
        expect(CoucheResponseHandler.unauthorized(unauthorized)).to.be.ok;
    });

    it("should return false for the code which is not unauthorized code", () => {
        const unauthorized = 404;
        expect(CoucheResponseHandler.unauthorized(unauthorized)).to.be.not.ok;
    });

});

