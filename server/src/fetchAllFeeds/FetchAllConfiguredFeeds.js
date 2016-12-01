import CouchClient from "../CouchClient";
export default class FetchAllConfiguredFeeds {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.authSession = this.request.cookies.AuthSession;
        console.log("request", request);
    }

    async fetchFeeds() {
        let couchClient = await CouchClient.createInstance(this.authSession);
        couchClient.getFeeds();

    }
}
