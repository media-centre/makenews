import { addArticleToCollection, webArticleMarkup } from "../../../src/js/newsboard/reducers/DisplayArticleReducers";
import { ADD_ARTICLE_TO_COLLECTION, WEB_ARTICLE_RECEIVED } from "../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

describe("DisplayArticleReducers", () => {

    describe("addArticleToCollection", () => {
        it("should return empty object by default", () => {
            expect(addArticleToCollection()).to.deep.equals({});
        });

        it("should update the message when there is message from server", () => {
            let action = { "type": ADD_ARTICLE_TO_COLLECTION, "addArticleToCollection": { "id": "docId", "sourceType": "web" } };
            expect(addArticleToCollection({}, action)).to.deep.equals({ "id": "docId", "sourceType": "web" });
        });
    });

    describe("webArticleMarkup", () => {
        it("should return article with type article", () => {
            let action = { "type": WEB_ARTICLE_RECEIVED, "article": "some Article", "isHTML": true };
            expect(webArticleMarkup("", action)).to.deep.equals({ "markup": "some Article", "isHTML": true });
        });

        it("should return article empty string by default", () => {
            expect(webArticleMarkup({ "markup": "", "isHTML": false }, {})).to.deep.equals({ "markup": "", "isHTML": false });
        });
    });
});
