import StringUtil from '../../src/util/StringUtil.js';
import { assert, expect } from 'chai';

describe('StringUtil', () => {
  it('should return true for the string test', () => {
    expect(StringUtil.validNonEmptyString('test')).to.be.ok;
  });

  it('should return false if the arugment is undefined', () => {
    expect(StringUtil.validNonEmptyString(undefined)).to.be.not.ok;
  });

  it('should return false if the arugment is null', () => {
    expect(StringUtil.validNonEmptyString(null)).to.be.not.ok;
  });

  it('should return false if the arugment number', () => {
    expect(StringUtil.validNonEmptyString(10)).to.be.not.ok;
  });

  it('should return false if the arugment is empty string', () => {
    expect(StringUtil.validNonEmptyString('')).to.be.not.ok;
  });

  it('should return false if the arugment is white spaces, tabs, new lines', () => {
    expect(StringUtil.validNonEmptyString(' \t \n')).to.be.not.ok;
  });

  it('should return empty string if the input is null', () => {
    expect("").to.equals(StringUtil.trim(null));
  });

  it('should return empty string if the input is undefined', () => {
    expect("").to.equals(StringUtil.trim(undefined));
  });

  it('should return empty string if the input is whitespaces', () => {
    expect("").to.equals(StringUtil.trim("     \t   "));
  });


});
