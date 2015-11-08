import BoolUtil from '../../src/util/BoolUtil.js';
import { assert, expect } from 'chai';

describe("BoolUtil", () => {
    describe("isEmpty", () => {
        it('should return false for 1234', () => {
            const number = 1234;
            expect(BoolUtil.isEmpty(number)).to.be.not.ok;
        });

        it('should return false for json', () => {
            const json = { "key": 2};
            expect(BoolUtil.isEmpty(json)).to.be.not.ok;
        });

        it('should return true for null', () => {
            const string = null;
            expect(BoolUtil.isEmpty(string)).to.be.ok;
        });

        it('should return true for undefined', () => {
            const string = undefined;
            expect(BoolUtil.isEmpty(string)).to.be.ok;
        });

        it('should return true for NaN', () => {
            const nonNumber = NaN;
            expect(BoolUtil.isEmpty(nonNumber)).to.be.ok;
        });

    });

    describe("isNotEmpty", () => {
        it('should return true for 1234', () => {
            const number = 1234;
            expect(BoolUtil.isNotEmpty(number)).to.be.ok;
        });
    });

});
