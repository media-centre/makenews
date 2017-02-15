import sanitize from "sanitize-html";

export function sanitizeHTML(html) {
    return sanitize(html, {
        "allowedTags": sanitize.defaults.allowedTags.concat(["img"]),
        "allowedAttributes": {
            "a": ["href", "rel"],
            "img": ["src", "alt"]
        },
        "transformTags": {
            "a": (tagName, attribs) => {
                return {
                    tagName,
                    "attribs": {
                        "href": attribs.href,
                        "rel": "nofollow noopener noreferrer"
                    }
                };
            }
        }
    });
}
