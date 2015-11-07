import StringUtil from '../../src/util/StringUtil.js';
import { assert } from 'chai';

describe('valid non empty string', function(){
  it('should return true for the string test', function() {
    assert.isTrue(StringUtil.validNonEmptyString('test'));
  });

  it('should return false if the arugment is undefined', function() {
    assert.isFalse(StringUtil.validNonEmptyString(undefined));
  });

  it('should return false if the arugment is null', function() {
    assert.isFalse(StringUtil.validNonEmptyString(null));
  });

  it('should return false if the arugment number', function() {
    assert.isFalse(StringUtil.validNonEmptyString(10));
  });

  it('should return false if the arugment is empty string', function() {
    assert.isFalse(StringUtil.validNonEmptyString(''));
  });

  it('should return false if the arugment is white spaces, tabs, new lines', function() {
    assert.isFalse(StringUtil.validNonEmptyString(' \t \n'));
  });

});
