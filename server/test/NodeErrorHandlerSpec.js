/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { expect } from "chai";
import NodeErrorHandler from "../src/NodeErrorHandler.js";
import sinon from "sinon";

describe("NodeErrorHandler", () => {
    let logSpy = null, errorObject = null;

    beforeEach("NodeErrorHandler", () => {
        logSpy = sinon.stub(NodeErrorHandler, "log", () => {
            return true;
        });
        errorObject = {
            "code": "ECONNREFUSED",
            "errno": "ECONNREFUSED",
            "syscall": "connect",
            "address": "127.0.0.1",
            "port": 5984
        };

    });

    afterEach("NodeErrorHandler", () => {
        logSpy.restore();
    });

    describe("errored", () => {
        it("should return true if error object is not empty", () => {
            expect(NodeErrorHandler.errored(errorObject)).to.be.ok;
            expect(logSpy.called).to.be.ok;
        });

        it("should return false if error object is empty", () => {
            let error = null;
            expect(NodeErrorHandler.errored(error)).to.be.not.ok;
            expect(logSpy.called).to.be.not.ok;
        });

    });

    describe("noError", () => {
        it("should return false if error object is not empty", () => {
            expect(NodeErrorHandler.noError(errorObject)).to.be.not.ok;
            expect(logSpy.called).to.be.ok;
        });

        it("should return true if error object is empty", () => {
            let error=null;
            expect(NodeErrorHandler.noError(error)).to.be.ok;
            expect(logSpy.called).to.be.not.ok;
        });
    });
});

