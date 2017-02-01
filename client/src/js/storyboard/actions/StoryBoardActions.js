import AjaxClient from "../../utils/AjaxClient";
export const ADD_STORY_TITLE = "Story title";
export const CLEAR_STORIES = "CLEAR_STORIES";


export function addStory(story) {
    return (dispatch) => {
        dispatch(setStoryTitle(story));
    };
}

export function setStoryTitle(story) {
    return {
        "type": ADD_STORY_TITLE,
        story
    };
}

export const clearStories = () => ({
    "type": CLEAR_STORIES
});

export function getStories() {
    return (dispatch) => {
        let ajax = AjaxClient.instance("/story");

        ajax.get().then((response) => {
            response.docs.map((doc) => {
                let { _id, title } = doc;
                dispatch(setStoryTitle({ _id, title }));
            });
        });
    };
}

