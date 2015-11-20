"use strict";
export default class StringUtil {
  static validNonEmptyString(value) {
      if(StringUtil.validString(value) && value.trim()) {
          return true;
      }
      return false;
  }

  static isEmptyString(value) {
      return !StringUtil.validNonEmptyString(value);
  }

  static validString(value) {
      if(value && typeof value === "string") {
          return true;
      }
      return false;
  }

  static trim(value) {
      if(!StringUtil.validNonEmptyString(value)) {
          return "";
      }
      return String(value).trim();
  }

}
