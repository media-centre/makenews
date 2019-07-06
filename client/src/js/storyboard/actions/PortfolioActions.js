import AjaxClient from "../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import Locale from "./../../utils/Locale";

export const ADD_STORY_TITLE = "Story title";
export const REMOVE_STORY = "REMOVE_STORY";
export const CLEAR_STORIES = "CLEAR_STORIES";

export const clearStories = {
    "type": CLEAR_STORIES
};

export function setStoryTitle(story) {
    return {
        "type": ADD_STORY_TITLE,
        story
    };
}

export function removeStory(id) {
    return {
        "type": REMOVE_STORY,
        id
    };
}

export function deleteStory(id) {
    return (dispatch) => {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        AjaxClient.instance("/delete-story").post(headers, { id }).then(() => {
            dispatch(removeStory(id));
            const portfolio = Locale.applicationStrings().messages.portfolio;
            Toast.show(portfolio.successMessages.deleteStory, "success");
        });
    };
}

export function getStories() {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/stories");

        ajax.get().then((response) => {
            response.docs.map((doc) => {
                dispatch(setStoryTitle(doc));
            });
        });
    };
}

export async function getStory(id) {
    const ajax = AjaxClient.instance("/story");
    return await ajax.get({ id });
}

export async function saveStory(story) { //eslint-disable-line consistent-return
    const portfolioStrings = Locale.applicationStrings().messages.portfolio;
    try {
        let ajax = AjaxClient.instance("/save-story");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        return await ajax.put(headers, { story });
    } catch(error) {
        if(error.message === "Please add title" || error.message === "Title Already exists") {
            Toast.show(error.message);
        } else {
            Toast.show(portfolioStrings.errorMessages.saveStoryFailure);
        }
    }
}
