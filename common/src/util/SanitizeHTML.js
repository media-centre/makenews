import sanitize from "sanitize-html";

export function sanitizeHTML(html) {
    return sanitize(html, {
        "allowedTags": sanitize.defaults.allowedTags.concat(["img"]),
        "allowedAttributes": {
            "a": ["href", "target", "rel"],
            "img": ["src", "alt"]
        },
        "transformTags": {
            "a": (tagName, attribs) => {
                return {
                    tagName,
                    "attribs": {
                        "href": attribs.href,
                        "target": "_blank",
                        "rel": "nofollow noopener noreferrer"
                    }
                };
            }
        }
    });
}
