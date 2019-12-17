import { fetchArticleData } from "./../../src/web/WebClient";
import { expect } from "chai";
import nock from "nock";
import { isRejected } from "./../helpers/AsyncTestHelper";
import { articleConfig } from "./../../src/Factory";
import sinon from "sinon";

describe("fetchArticleData", () => {

    before("fetchArticleData", () => {
        sinon.stub(articleConfig, "getSelectors").returns({});
    });

    after("fetchArticleData", () => {
        sinon.restore(articleConfig);
    });

    it("should fetch the article data when given a url", async() => {
        const url = "http://www.thehindu.com/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true";
        const successCode = 200;

        nock("http://www.thehindu.com")
            .get("/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true")
            .reply(successCode, `
                <html><head><title>Some title</title></head>
                <body>
                    <article>
                        <div id="content-body-14269002-17086264"><p>Australias player of the year David Warner has welcomed a rest before touring India next month, saying its tough preparing for subcontinental conditions.</p></div>
                    </article>
                </body>
                </html>
            `, {
                "content-type": "text/html"
            });

        const expectedData = "<div><p>Australias player of the year David Warner has welcomed a rest before touring India next month, saying its tough preparing for subcontinental conditions.</p></div>";

        const content = await fetchArticleData(url);
        expect(content).to.deep.equal(expectedData);
    });

    it("should reject with error if we give invalid url", async() => {
        const url = "http://www.thehindu.com/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true";
        nock("http://www.thehindu.com")
            .get("/sport/cricket/Playing-in-India-is-tough-a-rest-before-tour-is-welcome-David-Warner/article17086264.ece?homepage=true")
            .replyWithError("something awful happened");

        await isRejected(fetchArticleData(url), "Not able to get the data. Error details: something awful happened");

    });
});
