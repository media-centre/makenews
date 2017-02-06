import { webArticleMarkup } from "./../../../src/js/newsboard/reducers/DisplayArticleReducers";
import { WEB_ARTICLE_RECEIVED } from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

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
});
