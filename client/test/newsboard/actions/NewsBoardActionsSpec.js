describe("NewsBoardActions", () => {
    describe("displayAllConfiguredFeeds", () => {
        it("dispatch displayAllConfiguredFeeds action with new feeds on successful fetch", (done) => {
            let feeds = [
                {
                    "url": "www.hindu.com",
                    "categoryNames": ["hindu"],
                    "items": [
                        { "title": "chennai rains", "desc": "desc" }
                    ]
                }
            ];
            done();
        });
    });
});
