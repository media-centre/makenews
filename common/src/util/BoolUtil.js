"use strict";

export default class BoolUtil {
    static isEmpty(object) {
      return !object;
    }
    static isNotEmpty(object) {
        return !isEmpty(object);
    }
}