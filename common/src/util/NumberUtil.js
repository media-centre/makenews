"use strict";

export default class NumberUtil {
    static toNumber(number) {
        if(isNaN(Number(number))) {
            throw new Error("response code " + number + " is not a number");
        }
        return Number(number);
    }
}