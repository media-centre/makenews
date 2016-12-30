import CryptUtil from "./util/CryptUtil";

export default class UserDetails {

    constructor() {
        this.userDetailsMap = new Map();
    }

    updateUser(token, userName) {
        let dbName = CryptUtil.dbNameHash(userName);
        this.userDetailsMap.set(token, { userName, dbName });
    }

    getUser(token) {
        return this.userDetailsMap.get(token) || {};
    }

    removeUser(token) {
        this.userDetailsMap.delete(token);
    }
}
