export default class StringUtil {
  static validNonEmptyString(value) {
    if(StringUtil.validString(value) && value.trim()) {
      return true;
    }
    return false;
  }

  static validString(value) {
    if(value && typeof value === 'string' ) {
      return true;
    }
    return false;
  }
}
