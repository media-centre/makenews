
export default class StringUtil {
    static validNonEmptyString(value) {
        return (StringUtil.validString(value) && value.trim());

    }

    static isEmptyString(value) {
        return !StringUtil.validNonEmptyString(value);
    }

    static validString(value) {
        return (value && typeof value === "string");

    }

    static trim(value) {
        if(!StringUtil.validNonEmptyString(value)) {
            return "";
        }
        return String(value).trim();
    }

}
