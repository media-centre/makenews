import { CHANGE_HIGHLIGHTED_TAB } from "./TabActions";
import { List } from "immutable";

export function highlightedTab(state = { "tabNames": new List(["Surf"]) }, action = {}) {
    switch (action.type) {
    case CHANGE_HIGHLIGHTED_TAB:
        return Object.assign({}, state, { "tabNames": new List(action.tabNames) });
    default:
        return state;
    }
}
