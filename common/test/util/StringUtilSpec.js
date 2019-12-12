/* eslint-disable no-unused-expressions */
import StringUtil from "../../src/util/StringUtil";
import { expect } from "chai";

describe("StringUtil", () => {
    it("should return true for the string test", () => {
        expect(StringUtil.validNonEmptyString("test")).to.be.ok;
    });

    it("should return false if the argument is undefined", () => {
        // eslint-disable-next-line no-undefined
        expect(StringUtil.validNonEmptyString(undefined)).to.be.not.ok;
    });

    it("should return false if the argument is null", () => {
        expect(StringUtil.validNonEmptyString(null)).to.be.not.ok;
    });

    it("should return false if the argument number", () => {
        const number = 10;
        expect(StringUtil.validNonEmptyString(number)).to.be.not.ok;
    });

    it("should return false if the argument is empty string", () => {
        expect(StringUtil.validNonEmptyString("")).to.be.not.ok;
    });

    it("should return false if the argument is white spaces, tabs, new lines", () => {
        expect(StringUtil.validNonEmptyString(" \t \n")).to.be.not.ok;
    });

    it("should return empty string if the input is null", () => {
        expect("").to.equals(StringUtil.trim(null));
    });

    it("should return empty string if the input is undefined", () => {
        // eslint-disable-next-line no-undefined
        expect("").to.equals(StringUtil.trim(undefined));
    });

    it("should return empty string if the input is whitespaces", () => {
        expect("").to.equals(StringUtil.trim("     \t   "));
    });

    it("should return true if the string is empty", () => {
        expect(StringUtil.isEmptyString("")).to.be.true;
    });

    it("should return false if the string is not empty", () => {
        expect(StringUtil.isEmptyString("test")).to.be.false;
    });
});
