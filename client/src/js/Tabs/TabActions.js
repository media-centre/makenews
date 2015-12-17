"use strict";

export const CHANGE_HIGHLIGHTED_TAB = "CHANGE_HIGHLIGHTED_TAB";

export function highLightTabAction(tabNames) {
    return { "type": CHANGE_HIGHLIGHTED_TAB, tabNames };
}
