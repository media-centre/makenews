import * as StoryBoardActions from "../../../src/js/storyboard/actions/StoryBoardActions";
import mockStore from "./../../helper/ActionHelper";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";
import Locale from "./../../../src/js/utils/Locale";
import Toast from "./../../../src/js/utils/custom_templates/Toast";

describe("StoryBoardActions", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("StoryBoardActions", () => {
        sandbox.restore();
    });

    let story = {
        "_id": "id",
        "title": "title"
    };

    describe("setStoryTitle", () => {
        it("should return an action type of ADD_STORY_TITLE and story with title and id", () => {
            const action = { "type": StoryBoardActions.ADD_STORY_TITLE, story };
            const expectedAction = StoryBoardActions.setStoryTitle(story);
            assert.deepEqual(action, expectedAction);
        });
    });

    describe("clearStories", () => {
        it("should return an action type of CLEAR_STORIES", () => {
            const action = { "type": StoryBoardActions.CLEAR_STORIES };
            assert.deepEqual(action, StoryBoardActions.clearStories);
        });
    });

    describe("getStories", () => {
        it("should dispatch set story title action with id and title", (done) => {
            const action = [{ "type": StoryBoardActions.ADD_STORY_TITLE, "story": { "_id": "id", "title": "title" } },
                { "type": StoryBoardActions.ADD_STORY_TITLE, "story": { "_id": "id2", "title": "title" } }];
            const response = { "docs": [{ "_id": "id", "title": "title" }, { "_id": "id2", "title": "title" }] };
            const ajaxClientInstance = AjaxClient.instance("/stories");
            const ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            const getMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(response));
            const store = mockStore([], action, done);
            store.dispatch(StoryBoardActions.getStories());
            ajaxClientMock.verify();
            getMock.verify();
        });
    });

    describe("deleteStory", () => {
        it("should dispatch REMOVE_STORY action with id", (done) => {
            const storyBoardMessages = {
                "successMessages": {
                    "deleteStory": "Story deleted successfully"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "storyBoard": storyBoardMessages
                }
            });
            const id = 2;
            const action = [{ "type": StoryBoardActions.REMOVE_STORY, id }];
            const store = mockStore([{ "_id": 1 }, { "_id": id }, { "_id": 3 }], action, done);
            const ajaxClientInstance = AjaxClient.instance("/delete-story");
            sandbox.stub(AjaxClient, "instance")
                .returns(ajaxClientInstance);
            const postMock = sandbox.mock(ajaxClientInstance).expects("post")
                .returns(Promise.resolve("success"));
            store.dispatch(StoryBoardActions.deleteStory(id));
            postMock.verify();
        });
    });

    describe("getStory", () => {
        it("should get the story details", async() => {
            const id = "41bbf2025f28f2666adb613252002849";
            const response = {
                "_id": "41bbf2025f28f2666adb613252002849",
                "_rev": "183-43b954b356e1d2113d786f90d648cac7",
                "title": "durga",
                "body": "<div><b>dlfsnsvkjdghbnksfjgnbkfg <span style=\"font-size: 18px;\"></div>",
                "docType": "story"
            };
            const ajaxClientInstance = AjaxClient.instance("/story");
            sandbox.stub(AjaxClient, "instance")
                .returns(ajaxClientInstance);
            const getMock = sandbox.mock(ajaxClientInstance).expects("get").withArgs({ id })
                .returns(Promise.resolve(response));

            const result = await StoryBoardActions.getStory(id);
            assert.equal(result, response);
            getMock.verify();
        });
    });

    describe("saveStory", () => {
        let ajaxClientInstance = null;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        story = {
            "_id": "41bbf2025f28f2666adb613252002849",
            "_rev": "183-43b954b356e1d2113d786f90d648cac7",
            "title": "durga",
            "body": "<div><b>dlfsnsvkjdghbnksfjgnbkfg <span style=\"font-size: 18px;\"></div>",
            "docType": "story"
        };

        beforeEach("saveStory", () => {
            const storyBoardMessages = {
                "successMessages": {
                    "saveStory": "Story saved successfully",
                    "deleteStory": "Story deleted successfully"
                },
                "warningMessages": {
                    "emptyStory": "Cannot save empty story"
                },
                "errorMessages": {
                    "saveStoryFailure": "Not able to save"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "storyBoard": storyBoardMessages
                }
            });
            ajaxClientInstance = AjaxClient.instance("/save-story");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
        });

        afterEach("saveStory", () => {
            sandbox.restore();
        });

        it("should save the story", async() => {
            const response = {
                "ok": true,
                "id": "41bbf2025f28f2666adb613252002849",
                "rev": "186-989f7a25c7eb85dceed679d3deaba60d"
            };

            const putMock = sandbox.mock(ajaxClientInstance).expects("put").withArgs(headers, { story })
                .returns(Promise.resolve(response));

            const result = await StoryBoardActions.saveStory(story);
            assert.equal(result, response);
            putMock.verify();
        });

        it("should should show toast message if unable to save story", async() => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Not able to save");
            const putMock = sandbox.mock(ajaxClientInstance).expects("put").withArgs(headers, { story })
                .returns(Promise.reject({ "message": "Not able to save" }));

            await StoryBoardActions.saveStory(story);
            putMock.verify();
            toastMock.verify();
        });

        it("should should show toast message if title already exists", async() => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Title Already exists");
            const putMock = sandbox.mock(ajaxClientInstance).expects("put").withArgs(headers, { story })
                .returns(Promise.reject({ "message": "Title Already exists" }));

            await StoryBoardActions.saveStory(story);
            putMock.verify();
            toastMock.verify();
        });

        it("should should show toast message if title is empty", async() => {
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("Please add title");
            const putMock = sandbox.mock(ajaxClientInstance).expects("put").withArgs(headers, { story })
                .returns(Promise.reject({ "message": "Please add title" }));

            await StoryBoardActions.saveStory(story);
            putMock.verify();
            toastMock.verify();
        });
    });

});
