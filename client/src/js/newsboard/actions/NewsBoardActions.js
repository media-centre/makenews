import fetch from "isomorphic-fetch";
import AppWindow from "../../utils/AppWindow";

export async function displayAllConfiguredFeeds() {
    return async dispatch => {
        let feeds = await fetch(`${AppWindow.instance().get("serverUrl")}/fetch-all-feeds/`, {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

    };
}
