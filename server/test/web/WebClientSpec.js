import { fetchArticleData } from "./../../src/web/WebClient";
import { expect } from "chai";
import nock from "nock";
import { isRejected } from "./../helpers/AsyncTestHelper";

describe("fetchArticleData", () => {
    it("should fetch the article data when given a url", async () => {
        let url = "http://www.thehindu.com/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true";
        let successCode = 200;

        nock("http://www.thehindu.com")
            .get("/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true")
            .reply(successCode, `
                <html><head><title>Some title</title></head>
                <body>
                    <article>
                        <div id="content-body-14269002-17086264">
                            <span class="som" id="tag">Cricket</span>
                            <script type="text/javascript">alert("hello");</script><p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p>
                        </div>
                    </article>
                </body>
                </html>
            `, {
                "content-type": "text/html"
            });

        let expectedData = `<div>
                            Cricket
                            <p>Australia’s player of the year David Warner has welcomed a rest before touring India next month, saying it’s
                                tough preparing for subcontinental conditions.</p>
                        </div>`;
        
        let content = await fetchArticleData(url);
        expect(content).to.deep.equal(expectedData);
    });

    it("should reject with a message if we give invalid url format", async () => {
        await isRejected(fetchArticleData("some.url"), "not able to get the data");
    });

    it("should reject with error if we give invalid url", async () => {
        let url = "http://www.thehindu.com/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true";
        nock("http://www.thehindu.com")
            .get("/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true")
            .replyWithError({ "message": "something awful happened", "code": "AWFUL_ERROR" });

        await isRejected(fetchArticleData(url), { "message": "something awful happened", "code": "AWFUL_ERROR" });

    });
});
