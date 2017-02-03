import { webArticleMarkup, displayCollection } from "./../../../src/js/newsboard/reducers/DisplayArticleReducers";
import { WEB_ARTICLE_RECEIVED } from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { COLLECTION_FEEDS } from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import { expect, assert } from "chai";

describe("DisplayArticleReducer", () => {

    describe("webArticleMarkup", () => {
        it("should return article with type article", () => {
            let action = { "type": WEB_ARTICLE_RECEIVED, "article": "some Article", "isHTML": true };
            expect(webArticleMarkup("", action)).to.deep.equals({ "markup": "some Article", "isHTML": true });
        });

        it("should return article empty string by default", () => {
            expect(webArticleMarkup({ "markup": "", "isHTML": false }, {})).to.deep.equals({ "markup": "", "isHTML": false });
        });
    });

    describe("displayCollection", () => {

        it("should return feeds with type collection feeds", () => {
            let feeds = [{ "_id": "id", "title": "someTitle" }];
            let action = { "type": COLLECTION_FEEDS, "feeds": feeds };

            assert.deepEqual(displayCollection([], action), feeds);
        });

        it("should return empty array by default", () => {
            assert.deepEqual(displayCollection(), []);
        });
    });
});
