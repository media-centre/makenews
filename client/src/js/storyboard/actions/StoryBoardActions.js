import AjaxClient from "../../utils/AjaxClient";
export const ADD_STORY_TITLE = "Story title";
export const CLEAR_STORIES = "CLEAR_STORIES";
export const UNTITLED_NUMBER = "UNTITLED_NUMBER";

export const clearStories = {
    "type": CLEAR_STORIES
};

export function setStoryTitle(story) {
    return {
        "type": ADD_STORY_TITLE,
        story
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
export function addDefaultTitle(untitledIndex) {
    return (dispatch) => {
        dispatch({ "type": UNTITLED_NUMBER, untitledIndex });
    };
}
