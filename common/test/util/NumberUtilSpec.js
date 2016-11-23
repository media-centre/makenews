import NumberUtil from '../../src/util/NumberUtil';
import { assert, expect } from 'chai';

describe("NumberUtil", () => {
    it('should return number 5', () => {
        const number = 5;
        expect(number).to.equals(NumberUtil.toNumber(number));
    });

    it('should return number 5 for string 5', () => {
        const number = 5;
        const string = "5";
        expect(number).to.equals(NumberUtil.toNumber(string));
    });

    it('should throw exception if for the string test', () => {
        const string = "test";
        try{
            NumberUtil.toNumber(string)
        }catch(error) {
            expect("test is not a number").to.equal(error.message);
        }
    });

    it('should throw exception if for the 14.5', () => {
        const number = 14.5;
        expect(number).to.equal(NumberUtil.toNumber(number));
    });

});