import fs from "fs";
import path from "path";

export default class ArticleConfig {
    getSelectors() {
        if(!this.selectors) {
            const articleReadPath = path.join(__dirname, "../config/articleRead.json");
            const jsonString = fs.readFileSync(articleReadPath, "utf8"); //eslint-disable-line no-sync
            this.selectors = JSON.parse(jsonString) || {};
        }
        return this.selectors;
    }
}
