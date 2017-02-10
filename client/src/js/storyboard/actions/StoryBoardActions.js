import AjaxClient from "../../utils/AjaxClient";
export const ADD_STORY_TITLE = "Story title";
export const CLEAR_STORIES = "CLEAR_STORIES";
export const STORY = "STORY";

export const clearStories = {
    "type": CLEAR_STORIES
};

export function setStoryTitle(story) {
    return {
        "type": ADD_STORY_TITLE,
        story
    };
}

export function gotStory(story) {
    return {
        "type": STORY,
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

export function getStory(storyId) {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/story");
        ajax.get({ "id": storyId }).then((response) => {
            dispatch(gotStory(response));
        }).catch(() => {
            /*TODO: has to handle */ //eslint-disable-line
        });
    };
}
