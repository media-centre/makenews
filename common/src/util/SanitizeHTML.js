import sanitize from "sanitize-html";

export function sanitizeHTML(html) {
    return sanitize(html, {
        "allowedTags": sanitize.defaults.allowedTags.concat(["img"]),
        "allowedAttributes": {
            "a": ["href"],
            "img": ["src", "alt"]
        }
    });
}
