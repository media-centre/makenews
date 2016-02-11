"use strict";
import { createHashHistory } from "history";

const history = createHashHistory({
    "queryKey": false
});
export default class History {
    static getHistory() {
        return history;
    }
}
