/* eslint react/jsx-wrap-multilines:0*/
import moment from "moment";

export default class DateTimeUtil {

    static getCreatedTime() {
        return moment().utc().valueOf();
    }
    static getLocalTimeFromUTC(dateString) {
        return moment.utc(dateString).local().format("llll");
    }
    static getUTCDateAndTime(dateString) {
        const date = new Date(dateString);
        const dateToISO = isNaN(date.getTime()) ? dateString : date.toISOString();
        return moment(dateToISO).utc().format();
    }
    static getTimestamp(dateString) {
        return new Date(DateTimeUtil.getUTCDateAndTime(dateString)).getTime();
    }
    static getSortedUTCDates(dates) {
        return dates.sort((prev, next) => {
            return DateTimeUtil.getTimestamp(next) - DateTimeUtil.getTimestamp(prev);
        }).map(sortedDate => {
            return DateTimeUtil.getUTCDateAndTime(sortedDate);
        });
    }
    static getCurrentTimeStamp() {
        return moment();
    }

    static getLocalTime(dateString) {
        const DAY_CHARS = 4;
        const timeStamp = new Date(dateString);
        let date = timeStamp.toDateString();
        date = date.substring(DAY_CHARS, date.length);
        const time = timeStamp.toLocaleTimeString();
        const formatedDate = date + ", " + time + " IST";
        return formatedDate;
    }
}
