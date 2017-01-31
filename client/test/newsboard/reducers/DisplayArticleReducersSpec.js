import { addArticleToCollection, addToCollectionStatus } from "../../../src/js/newsboard/reducers/DisplayArticleReducers";
import { ADD_ARTICLE_TO_COLLECTION, ADD_TO_COLLECTION_STATUS } from "../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

describe("DisplayArticleReducers", () => {

    describe("addToCollectionStatus", () => {

        it("should return object with empty message by default", () => {
            expect(addToCollectionStatus()).to.deep.equals({ "message": "" });
        });

        it("should update the message when there is message from server", () => {
            let action = { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "success" } };
            expect(addToCollectionStatus({}, action)).to.deep.equals({ "message": "success" });
        });
    });

    describe("addArticleToCollection", () => {
        it("should return empty object by default", () => {
            expect(addArticleToCollection()).to.deep.equals({});
        });

        it("should update the message when there is message from server", () => {
            let action = { "type": ADD_ARTICLE_TO_COLLECTION, "addArticleToCollection": { "id": "docId", "sourceType": "web" } };
            expect(addArticleToCollection({}, action)).to.deep.equals({ "id": "docId", "sourceType": "web" });
        });
    });
});
