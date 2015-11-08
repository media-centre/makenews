import CoucheResponseHandler from '../src/CouchResponseHandler.js';
import { assert, expect } from 'chai';

describe("CoucheResponseHandler", () => {
    it('should return true for request completed', () => {
        const ok=200;
        expect(new CoucheResponseHandler.requestCompleted(ok)).to.be.ok;
    });

    it('should return true for the unauthorized code', () => {
        const unauthorized=401;
        expect(new CoucheResponseHandler.unauthorized(unauthorized)).to.be.ok;
    });

    it('should return false for the code which is not unauthorized code', () => {
        const unauthorized=404;
        expect(new CoucheResponseHandler.unauthorized(unauthorized)).to.be.ok;
    });

});

