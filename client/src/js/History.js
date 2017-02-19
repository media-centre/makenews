import { createHashHistory } from "history";

const history = createHashHistory();

export default class History {
    static getHistory() {
        return history;
    }
}

