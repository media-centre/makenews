import DateUtil from "../util/DateUtil";
export function parseFacebookPosts(posts = []) {
    return posts.map(post => _parsePost(post));
}

function _parsePost(post) {
    const noIndex = -1;
    let facebookRegex = /^https:\/\/www\.facebook\.com/;
    let postId = post.id.split("_");
    let feedDocument = {
        "_id": post.id,
        "docType": "feed",
        "type": "description",
        "title": post.name || "",
        "sourceType": "facebook",
        "link": facebookRegex.test(post.link) ? post.link : ("https://www.facebook.com/" + postId[0] + "/posts/" + postId[1]),          //eslint-disable-line no-magic-numbers
        "description": post.message || "",
        "pubDate": post.created_time ? DateUtil.getUTCDateAndTime(post.created_time) : null,
        "tags": [],
        "images": [],
        "videos": []
    };


    if(post.picture) {
        feedDocument.type = "image";
        feedDocument.images[0] = { "url": post.full_picture, "thumbnail": post.picture }; //eslint-disable-line no-magic-numbers
    }

    if(post.link && post.link.indexOf("/videos/") !== noIndex) {
        feedDocument.type = "video";
        feedDocument.videos[0] = { //eslint-disable-line no-magic-numbers
            "thumbnail": post.picture,
            "id": post.id.split("_")[1] //eslint-disable-line no-magic-numbers
        };
    }

    return feedDocument;
}
