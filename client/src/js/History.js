"use strict";
import { createHashHistory } from "history";
import UserSession from "./user/UserSession";

const history = createHashHistory({
    "queryKey": false
});

history.listen((ev) => {
    if(ev.pathname !== "/") {
        UserSession.instance().continueSessionIfActive();
    }
});

export default class History {
    static getHistory() {
        return history;
    }
}
