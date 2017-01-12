import moment from "moment";
export default class DateUtil {
    static getCurrentTime() {
        return new Date().getTime();
    }

    static getUTCDateAndTime(dateString) {
        let date = new Date(dateString);
        let dateToISO = isNaN(date.getTime()) ? dateString : date.toISOString();
        return moment(dateToISO).utc().format();
    }
}
