import { selectedWebArticle } from "./../../../src/js/newsboard/reducers/DisplayArticleReducer";
import { WEB_ARTICLE } from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

describe("DisplayArticleReducer", () => {
    it("should return article with type article", () => {
        let action = { "type": WEB_ARTICLE, "article": "some Article" };
        expect(selectedWebArticle("", action)).to.be.equals("some Article");
    });

    it("should return article empty string by default", () => {
        expect(selectedWebArticle("", {})).to.be.equals("");
    });
});
