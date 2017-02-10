import UserSession from "../user/UserSession";
import AppSessionStorage from "./AppSessionStorage";

export function setLastAccestime() {
    if(AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.LAST_RENEWED_TIME)) {
        UserSession.instance().continueSessionIfActive();
    }
    return false;
}
