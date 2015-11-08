"use strict";
export default class StringUtil {
  static validNonEmptyString(value) {
      if(StringUtil.validString(value) && value.trim()) {
          return true;
      }
      return false;
  }

  static validString(value) {
      if(value && typeof value === "string") {
          return true;
      }
      return false;
  }

  /*test cases pending*/
  static trim(value) {
      if(!value) {
          return "";
      }
      return String(value).trim();
  }

}
