/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import { expect } from "chai";
import NodeErrorHandler from "../src/NodeErrorHandler";

describe("NodeErrorHandler", () => {
    let errorObject = null;

    beforeEach("NodeErrorHandler", () => {
        errorObject = {
            "code": "ECONNREFUSED",
            "errno": "ECONNREFUSED",
            "syscall": "connect",
            "address": "127.0.0.1",
            "port": 5984
        };
    });

    afterEach("NodeErrorHandler", () => {
    });

    describe("errored", () => {
        it("should return true if error object is not empty", () => {
            expect(NodeErrorHandler.errored(errorObject)).to.be.ok;
        });

        it("should return false if error object is empty", () => {
            const error = null;
            expect(NodeErrorHandler.errored(error)).to.be.not.ok;
        });

    });

    describe("noError", () => {
        it("should return false if error object is not empty", () => {
            expect(NodeErrorHandler.noError(errorObject)).to.be.not.ok;
        });

        it("should return true if error object is empty", () => {
            const error = null;
            expect(NodeErrorHandler.noError(error)).to.be.ok;
        });
    });
});

