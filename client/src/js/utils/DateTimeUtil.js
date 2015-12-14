"use strict";

export default class DateTimeUtil {

    static getCreatedTime() {
        return new Date().getTime();
    }

    static getDateAndTime(dateString) {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let date = new Date(dateString);
        return months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + "    " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    }
}
