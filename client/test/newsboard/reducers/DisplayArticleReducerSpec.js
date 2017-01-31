import { webArticleMarkup } from "./../../../src/js/newsboard/reducers/DisplayArticleReducer";
import { WEB_ARTICLE_RECEIVED } from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

describe("DisplayArticleReducer", () => {
    it("should return article with type article", () => {
        let action = { "type": WEB_ARTICLE_RECEIVED, "article": "some Article" };
        expect(webArticleMarkup("", action)).to.be.equals("some Article");
    });

    it("should return article empty string by default", () => {
        expect(webArticleMarkup("", {})).to.be.equals("");
    });
});
