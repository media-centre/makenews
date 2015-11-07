import chai from './helpers/chai';
import NodeErrorHandler from '../src/NodeErrorHandler.js';
import sinon  from "sinon";

describe("errored", function(){
    beforeEach("errored", () => {
        this.logSpy = sinon.stub(NodeErrorHandler, "log", function() {return true});
    });
    afterEach("errored", () => {
        this.logSpy.restore();
    });
    it('should return true if error object is not empty', () => {

        let errorObject = {
            code: 'ECONNREFUSED',
            errno: 'ECONNREFUSED',
            syscall: 'connect',
            address: '127.0.0.1',
            port: 5984 };
        assert.ok(NodeErrorHandler.errored(errorObject));
        assert.ok(this.logSpy.called);
    });

    it('should return false if error object is empty', () => {
        let errorObject = null;
        assert.notOk(NodeErrorHandler.errored(errorObject));
        assert.notOk(this.logSpy.called);
    });

});

describe("no error", function(){
    beforeEach("errored", () => {
        this.logSpy = sinon.stub(NodeErrorHandler, "log", function() {return true});
    });
    afterEach("errored", () => {
        this.logSpy.restore();
    });

    it('should return false if error object is not empty', () => {
        let errorObject = {
            code: 'ECONNREFUSED',
            errno: 'ECONNREFUSED',
            syscall: 'connect',
            address: '127.0.0.1',
            port: 5984 };
        assert.notOk(NodeErrorHandler.noError(errorObject));
        assert.ok(this.logSpy.called);
    });

    it('should return true if error object is empty', () => {
        let errorObject = null;
        assert.ok(NodeErrorHandler.noError(errorObject));
        assert.notOk(this.logSpy.called);
    });

});
