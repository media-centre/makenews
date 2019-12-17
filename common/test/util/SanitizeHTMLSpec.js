import { sanitizeHTML } from "./../../src/util/SanitizeHTML";
import { expect } from "chai";

describe("sanitizeHTML", () => {
    it("should remove the script tags", () => {
        const html = `<div id="content-body-14269002-17086264"><script type="text/javascript">alert("hello");</script>
                            <p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p><span>hello
                        </span></div>`;

        const expectedHTML = `<div>
                            <p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p><span>hello
                        </span></div>`;

        expect(sanitizeHTML(html)).equal(expectedHTML);
    });

    it("should keep the anchor tag with only href attribute", () => {
        const html = "<a href='http://some.url' class='link' id='cK7_'>link</a>";

        const expectedHTML = "<a href=\"http://some.url\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">link</a>";

        expect(sanitizeHTML(html)).equal(expectedHTML);
    });

    it("should keep the img tag with only src and alt attributes", () => {
        const html = "<img src=\"http://some/images.jpg\" alt=\"image\" class=\"img\"/>";

        const expectedHTML = "<img src=\"http://some/images.jpg\" alt=\"image\" />";

        expect(sanitizeHTML(html)).equal(expectedHTML);
    });

    it("should add rel='nofollow noopener noreferrer' attributes to <a> tag", () => {
        const html = "<a class='link' href='http://some.url' rel='some random rel'>link</a>";

        const expectedHTML = "<a href=\"http://some.url\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">link</a>";

        expect(sanitizeHTML(html)).equal(expectedHTML);
    });
});
