"use strict";
import { createHashHistory } from "history";
import UserSession from "./user/UserSession";

const history = createHashHistory({
    "queryKey": false
});

export default class History {
    static getHistory() {
        return history;
    }
}

history.listen((ev) => {
    if(ev.pathname !== "/") {
        UserSession.instance().continueSessionIfActive();
    }
});
